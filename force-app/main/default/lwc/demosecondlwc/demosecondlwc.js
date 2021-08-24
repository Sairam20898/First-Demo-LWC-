import { LightningElement, wire } from 'lwc';
import getAccountData from '@salesforce/apex/accountSearchController.getAccountResults';
import getRecordType from '@salesforce/apex/accountSearchController.getAccountResults';
import moreInfoChannel from '@salesforce/messageChannel/Account_More_Info__c'; 
import contactMoreInfo from '@salesforce/messageChannel/Contact_More_Info__c';

import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import { getObjectInfo, getRecord } from 'lightning/uiObjectInfoApi';
import { getObjectInfos } from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import Employee_OBJECT from '@salesforce/schema/Employee__c';
import Source_FIELD from '@salesforce/schema/Account.Source__c';

import { publish, MessageContext } from 'lightning/messageService';

export default class Demosecondlwc extends LightningElement {
    resetVisibility = false;
    accountName;
    accountPhone;
    billingStreet;
    billingCity;
    billingState;
    billingPincode;

    accType;
    optionsAccType=[{ label: 'UK Records', value: '0125g000001n5MPAAY' },{ label: 'USA Records', value: '0125g000001n5PiAAI' }];

    selectedRecType;
    accSource;
    optionsSourceType = [];
    
    @wire(getPicklistValues, { recordTypeId: '$selectedRecType', fieldApiName: Source_FIELD })
    getAccountSourceValues({data,error}){
        if(data){
            console.log(data);
            this.optionsSourceType = [];
            data.values.forEach(item=>{
                var source = {
                    label: item.label,
                    value: item.value,
                };
                this.optionsSourceType.push(source);
            });
            this.optionsSourceType = [...this.optionsSourceType];
        }
        else{
            console.log(error);
        }
    }

    @wire(getPicklistValuesByRecordType, { objectApiName: ACCOUNT_OBJECT, recordTypeId: '0125g000001n5MPAAY' })
    getAccountPickListValues({data,error}){
        if(data){
            console.log(data);
        }

        else{
            console.log(error);
        }
    }

    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    getAccountObjectInfo({data,error}){
        if(data){
            console.log(data);
        }

        else{
            console.log(error);
        }
    }

    @wire(getObjectInfos, { objectApiNames: [ACCOUNT_OBJECT, Employee_OBJECT ]})
    getObjectsInfoData({data,error}){
        if(data){
            console.log('ObjectInfos:' + data);
        }

        else{
            console.log(error);
        }
    }


    @wire(MessageContext)
    mesgContext;

    
    // get optionsAccType(){
    //     return [
    //         { label: 'Individual', value: '' },
    //         { label: 'Corporate', value: '' },
    //     ];
    // }
    

    // @wire(getRecordType,{objName:'Account'})
    // getRecordType({data,error}){
    //     if(data){
    //         console.log(data);
    //         data.forEach(element => {
    //             var item = {
    //                 label: element.Name,
    //                 value: element.Id
    //             };
    //             this.optionsAccType.push(item);
    //         });
    //         this.optionsAccType = [... this.optionsAccType];
    //     }
    //     else if(error){
    //         console.log(error);
    //     }
    // }

    handleOnchangeEvent(event){
        if(event.target.name === 'accountName'){
            this.accountName = event.target.value;
        } else if(event.target.name === 'accountPhone'){
            this.accountPhone = event.target.value;
        }
    }

    handleOnchangeBillingEvent(event){
        if(event.target.name === 'billingStreet'){
            this.billingStreet = event.target.value;
        } else if (event.target.name === 'billingCity'){
            this.billingCity = event.target.value;
        } else if (event.target.name === 'billingState'){
            this.billingState = event.target.value;
        } else if (event.target.name === 'billingPincode'){
            this.billingPincode = event.target.value;
        }
    }

    getAccountResults(event){
        var allValid = this.callAllValidFun();
        if(allValid){
            getAccountData({accountName: this.accountName, address:this.billingState})
            .then(results =>{
                console.log(results);
                this.dispatchEvent(new CustomEvent('getaccountdata',{
                    // detail:results
                    detail:{results:results,
                        inputDetails: {
                            recordTypeId : this.selectedRecType,
                            source: this.accSource,
                            accountName: this.accountName,
                            billingState: this.billingState
                        }
                    }
                }));

                const payload = {accountName:this.accountName, visibility:false}
                publish(this.mesgContext, moreInfoChannel, payload);
                publish(this.mesgContext, contactMoreInfo, payload);
            })
            .catch(error =>{
                console.log(error);
            });

            console.log('This is the line after the then and catch blocks');
            this.resetVisibility = true;
        }
    }

    callAllValidFun(){
        const allValid = [...this.template.querySelectorAll('lightning-input')]
        .reduce((validSoFar, inpComp) =>{
            if(!inpComp.checkValidity()){
                if(inpComp.label === 'Account Name'){
                    inpComp.setCustomValidity('Please enter Account Name');
                } else if(inpComp.label === 'Billing State'){
                    inpComp.setCustomValidity('Please enter Billing State');
                }
            }
            inpComp.reportValidity();
            inpComp.setCustomValidity('');
            console.log(inpComp);
            return validSoFar && inpComp.checkValidity();
        },true);

        const allComboValid = [...this.template.querySelectorAll('lightning-combobox')]
        .reduce((validSoFar, inpComp) =>{
            if(!inpComp.checkValidity()){
                if(inpComp.label === 'Account Type'){
                    inpComp.setCustomValidity('Please Select Account Type');
                } else if(inpComp.label === 'Source Type'){
                    inpComp.setCustomValidity('Please Select Account Source');
                }
            }
            inpComp.reportValidity();
            inpComp.setCustomValidity('');
            console.log(inpComp);
            return validSoFar && inpComp.checkValidity();
        },true);

        return allValid;
    }

    resetAccountResults(event){   
        this.accountName = '';
        this.accountPhone = '';
        this.billingStreet = '';
        this.billingCity = '';
        this.billingState = '';
        this.billingPincode = '';
        var emptyArray = [];
        this.dispatchEvent(new CustomEvent('resetaccountdata',{   
            detail:emptyArray
        }));

        const payload = {visibility:false}
        publish(this.mesgContext, moreInfoChannel, payload);

        this.resetVisibility = false;
    }

    handleAccTypeChange(event){
        console.log(event);
        this.selectedRecType = event.target.value;
    }

    handleSourceTypeChange(event){
        console.log(event);
        this.accSource = event.target.value;
    }

    
}