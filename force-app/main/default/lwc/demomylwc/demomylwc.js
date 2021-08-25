import { LightningElement, wire } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import Account_Object from '@salesforce/schema/Account';
import Source_Field from '@salesforce/schema/Account.Source__c';
import BillingState_Field from '@salesforce/schema/Account.BillingState';
import Name_Field from '@salesforce/schema/Account.Name';
import RecordTypeId_Field from '@salesforce/schema/Account.RecordTypeId';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord } from 'lightning/uiRecordApi';
import moreInfoChannel from '@salesforce/messageChannel/Account_More_Info__c';
import { publish, MessageContext } from 'lightning/messageService';


export default class Demomylwc extends LightningElement {
    inpText = 'Sairam Yadav';

    searchResults = [];
    accountDataforCreation;
    isFirstLWCVisible=true;

    accountName;

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
        }catch(e){
            console.log(e);
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
            //alert('Account created: '+ result.id);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Account created succesfully ' + result.id,
                variant: 'success',
                mode: 'sticky'
            }))
        })
        .catch(error=>{
            console.log(error);
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

    changeVisibility(event){
        this.isFirstLWCVisible = event.detail;
    }

}