import { LightningElement, api, wire } from 'lwc';
import moreInfoChannel from '@salesforce/messageChannel/Account_More_Info__c';
import otherChannel from '@salesforce/messageChannel/Contact_More_Info__c';
import getAccountData from '@salesforce/apex/accountSearchController.getAccountResults';
import { publish,subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import insertLogger from '@salesforce/apex/accountSearchController.insertLogger';
export default class Accountmoreinfo extends LightningElement {

    @api visibility;
    subscribtionmesg = null;
    accountResults = [];

    jsonData;
    imgURL;

    accountName;
    legalName;
    domainName;
    accountPhone;
    email;
    billingState;
    recType;
    acSource;
    description;
    foundedYear;
    location;

    @wire(MessageContext)
    mesgContext;

    connectedCallback(){
        this.subscribeToChannelMessage();
        
    }

    subscribeToChannelMessage(){
        if(this.subscribtionmesg==null || this.subscribtionmesg==undefined){
            this.subscribtionmesg =  subscribe(this.mesgContext,
                                                moreInfoChannel,
                                                (mesg)=> this.getAccountDetails(mesg));
        }
    }

    unsubscribeToMessageChannel(){
        unsubscribe(this.subscribtionmesg);
        this.subscribtionmesg = null;
    }

    getAccountDetails(mesg){
        this.visibility = mesg.visibility;
        console.log(mesg);
        this.accountName = mesg.accountName;
        this.billingState = mesg.billingState;
        this.recType = mesg.recType;
        this.acSource = mesg.acSource;
        this.fetchCompanyWebSite(this.accountName);
    }

    handleOnchangeEvent(event){
        if(event.target.name === 'accountName'){
            this.accountName = event.target.value;
        } else if(event.target.name === 'accountPhone'){
            this.accountPhone = event.target.value;
        }else if(event.target.name === 'email'){
            this.email = event.target.value;
        }else if(event.target.name === 'domainName'){
            this.domainName = event.target.value;
        }else if(event.target.name === 'legalName'){
            this.legalName = event.target.value;
        }else if(event.target.name === 'billingState'){
            this.billingState = event.target.value;
        }else if(event.target.name === 'recType'){
            this.recType = event.target.value;
        }else if(event.target.name === 'acSource'){
            this.acSource = event.target.value;
        }
    }

    handlePrevInfo(event){
        this.visibility = false;   
        const payload = {isFirstLWCVisible:true}
        publish(this.messageContext,otherChannel,payload);
    }

    fetchCompanyWebSite(companyName){
        fetch('https://company.clearbit.com/v1/domains/find?name='+companyName,
        {
            method:"GET",
            headers:{
            "Accept":"*/*",
            "Content-Type": "application/json",
            "Accept-Encoding":"gzip, deflate, br",
            "Authorization": "Bearer sk_c2308f8ab176b42123d7cb2a2cca569a"
        }
        })
        .then((response) => {
            return response.json(); // returning the response in the form of JSON
        })
        .then((jsonResponse) => {
            console.log('jsonResponse ===> ' +JSON.stringify(jsonResponse));
            this.fetchCompanyDetails(jsonResponse.domain);
        })
        .catch(error => {
            console.log('callout error 1 ===> ' + error);
        })
    }

    fetchCompanyDetails(domain){
        fetch('https://company.clearbit.com/v2/companies/find?domain='+domain,
        {
            method:"GET",
            headers:{
            "Accept":"*/*",
            "Content-Type": "application/json",
            "Authorization": "Bearer sk_c2308f8ab176b42123d7cb2a2cca569a"
        }
        })
        .then((response) => {
            return response.json();
        })
        .then((jsonResponse) => {
            this.imgURL = jsonResponse.logo;
            this.jsonData = JSON.stringify(jsonResponse);
            console.log(jsonResponse.name);
            this.accountName = jsonResponse.name;
            this.legalName = jsonResponse.legalName;
            this.domainName = jsonResponse.domain;
            this.accountPhone = jsonResponse.phone;
            this.email = jsonResponse.email;
            this.description = jsonResponse.description;
            this.foundedYear = jsonResponse.foundedYear;
            this.location = jsonResponse.location;
            this.console.log('jsonResponse ===> ' +JSON.stringify(jsonResponse));
        })
        .catch(error => {
            console.log('callout error 2 ===> ' + error);
        })
    }

    createAccountRecord(event){
        console.log(event);
        const fields = {
            'Name' : this.accountName, 
            'Domain_Name__c' : this.domainName, 
            'Legal_Name__c' : this.legalName,
            'Phone': this.accountPhone,
            'Source__c':this.acSource,
            'RecordTypeId':this.recType,
            'Description': this.description,
            'Founded_Year__c': this.foundedYear,
            'Location__c': this.location
        };
        const Record = {
            "apiName": 'Account',
            fields
          }

        createRecord(Record).then(response => {
            alert('Account created with Id: ' +response.id);
        }).catch(error => {
            alert('Error: ' +JSON.stringify(error));
            const logData = {
                Method_Name__c: 'createAccountRecord',
                Component_Name__c: 'Accountmoreinfo',
                Error__c: this.handleError(error,'')
              }
              insertLogger({log:logData})
              .then(loggerResult=>{
                console.log(loggerResult);
              })
        });
    }

    handleError(error, errorMessage) {
		var message = errorMessage;
		if (Array.isArray(error.body)) {
			message = message + ' ' + error.body.map(e => e.message).join(', ')
		} else if (typeof error.body.message === 'string') {
			message = message + ' ' + error.body.message
		}
		if (error.body != null && error.body.output != null) {
			if(error.body.output.errors != null && typeof error.body.output.errors === 'object' && error.body.output.errors.length > 0){
				error.body.output.errors.forEach(er => {
				message = message + ' ' + er.errorCode;
				message = message + ' ' + er.message;
				if (er.duplicateRecordError != null && typeof er.duplicateRecordError === 'object' && er.duplicateRecordError.matchResults != null && typeof er.duplicateRecordError.matchResults === 'object' && er.duplicateRecordError.matchResults.length > 0) {
					message = message + ' Following are the matching records';
					er.duplicateRecordError.matchResults.forEach(erMatchRec => {
						erMatchRec.matchRecordIds.forEach(matchRec => {
							message = message + ' ' + matchRec
						})
					})
					}
				});	
			}
			else if(error.body.output.fieldErrors !=null && typeof error.body.output.errors === 'object'){
				error.body.output.fieldErrors.forEach(x=>{
					Object.keys(x).forEach(y=>{
						console.log(y);
					});
				});
			}
		}
		return message
	}

}