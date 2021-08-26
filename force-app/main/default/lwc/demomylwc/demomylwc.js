import { LightningElement, track, wire } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import Account_Object from '@salesforce/schema/Account';
import Source_Field from '@salesforce/schema/Account.Source__c';
import BillingState_Field from '@salesforce/schema/Account.BillingState';
import Name_Field from '@salesforce/schema/Account.Name';
import RecordTypeId_Field from '@salesforce/schema/Account.RecordTypeId';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord } from 'lightning/uiRecordApi';
import moreInfoChannel from '@salesforce/messageChannel/Account_More_Info__c';
import otherChannel from '@salesforce/messageChannel/Contact_More_Info__c';
import { NavigationMixin } from 'lightning/navigation'
import { publish, MessageContext,subscribe } from 'lightning/messageService';
import insertLogger from '@salesforce/apex/accountSearchController.insertLogger'

export default class Demomylwc extends NavigationMixin(LightningElement) {
    inpText = 'Sairam Yadav';

    searchResults = [];
    accountDataforCreation;
    isFirstLWCVisible=true;
    accountName;
    valuefromaura;
    navigationURL;

    @wire(MessageContext)
    messageContext;

    @wire(getRecord, { recordId: '0015g00000P3vykAAB', fields: [Name_Field], optionalFields:[RecordTypeId_Field] })
    myRecord({data, error}){
        if(data){
            console.log('Record data'+data);
        } else if(error){
            console.log(error);
        }
    }
    
    changeInpValue(event){
        this.inpText = event.target.value;
    }

    handleAccountData(event){
        this.accountDataforCreation = event.detail.inputDetails;
        this.searchResults = [];
        console.log(event.detail.results);
        var arrow;
        try{
            event.detail.results.forEach(e => {
                if(e.AnnualRevenue == null){
                    arrow = '';
                }else if(e.AnnualRevenue > 50000){
                    arrow='utility:arrowup';
                }else{
                    arrow='utility:arrowdown';
                }
                var accdata = {
                    id:e.Id,
                    name:e.Name,
                    website:e.Website,
                    phone:e.Phone,
                    AnnualRevenue:(e.AnnualRevenue == null || e.AnnualRevenue == undefined)? '' : e.AnnualRevenue,
                    state:e.BillingAddress.state,
                    
                    revenueIcon:arrow,
                    revenueClass:e.AnnualRevenue > 50000? 'redRow':'greenRow'
                }
                this.searchResults.push(accdata);
                console.log(this.searchResults);
            });
        }catch(error){
            console.log(error);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: this.handleError(error,''),
                variant: 'error',
                mode: 'sticky'
            }))

            const logData = {
                Method_Name__c: 'Handle account data',
                Component_Name__c: 'Demomylwc',
                Error__c: this.handleError(error,'')
              }
              insertLogger({log:logData})
              .then(loggerResult=>{
                console.log(loggerResult);
              })
        }
        
    }

    connectedCallback(){
        var dataTableStyle = document.createElement('style');
        dataTableStyle.innerHTML = `
                                    .redRow{
                                        color: red;
                                    }
                                    .greenRow{
                                        color: green;
                                    }
                                    `
        document.head.appendChild(dataTableStyle);
        // this.subscribeMethod();
        console.log('Value from Aura component'+this.valuefromaura);

    }

    subscribeMethod(){
        subscribe(
            this.messageContext,
            otherChannel,
            (mesg) =>{
                this.isFirstLWCVisible = mesg.isFirstLWCVisible
            }
        )
    }

    resetHandler(event){
        this.searchResults = event.detail;
    }

    getNewAccData(event){
        this.searchResults = event.detail;
    }

    createAccountRecord(event){
        console.log(event.detail);
        console.log('accountDataforCreation' + this.accountDataforCreation);
        const fields = {};
        fields[Name_Field.fieldApiName] = this.accountDataforCreation["accountName"];
        fields[Source_Field.fieldApiName] = this.accountDataforCreation["source"];
        fields[RecordTypeId_Field.fieldApiName] = this.accountDataforCreation["recordTypeId"];
        fields[BillingState_Field.fieldApiName] = this.accountDataforCreation["billingState"];
        var Record = {
            "apiName": Account_Object.objectApiName,
            "fields": fields
        };
        createRecord(Record)
        .then(result=>{
            console.log(result);
            // this.dispatchEvent(new ShowToastEvent({
            //     title: 'Success',
            //     message: 'Account created succesfully ' + result.id,
            //     variant: 'success',
            //     mode: 'sticky'
            // }))

            this.navigateToStandardRecordPage(result.id);
        })
        .catch(error=>{
            console.log(error);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: this.handleError(error,''),
                variant: 'error',
                mode: 'sticky'
            }))

            const logData = {
                Method_Name__c: 'createAccountRecord',
                Component_Name__c: 'Demomylwc',
                Error__c: this.handleError(error,'')
              }
              insertLogger({log:logData})
              .then(loggerResult=>{
                console.log(loggerResult);
              })
        })
    }

    handleMoreInfo(event){
        this.isFirstLWCVisible = false;
        const payload = {
            accountName: this.accountDataforCreation["accountName"],
            recType:this.accountDataforCreation["recordTypeId"],
            acSource:this.accountDataforCreation["source"],
            billingState:this.accountDataforCreation["billingState"],
            visibility:true};
        publish(this.messageContext,moreInfoChannel,payload);
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


    changeVisibility(event){
        this.isFirstLWCVisible = event.detail;
    }

    navigateToStandardRecordPage(recordId){
        // this[NavigationMixin.Navigate]({
        //         type: 'standard__recordPage',
        //         attributes: {
        //             recordId: recordId,
        //             actionName: 'view'
        //         }
        //     });
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                actionName: 'view'
            }
        }).then(url=>{
            console.log(url);
            this.navigationURL = url;

            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Account created succesfully. Click {0}',
                variant: 'success',
                mode: 'sticky',
                messageData: [{
                    url,
                    label: 'here'
                }]
            }))

        })
    }

}