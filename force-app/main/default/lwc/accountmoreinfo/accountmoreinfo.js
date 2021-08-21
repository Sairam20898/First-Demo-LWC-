import { LightningElement, api, wire } from 'lwc';
import moreInfoChannel from '@salesforce/messageChannel/Account_More_Info__c';
import getAccountData from '@salesforce/apex/accountSearchController.getAccountResults';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';

const columns = [
    { label: 'Account Name', fieldName: 'Name', cellAttributes: {iconName:'standard:account', iconPosition:'Left'}},
    {label: 'Website', fieldName: 'Website', type:'text'},
    {label: 'Phone', fieldName: 'Phone', type: 'phone' },
    {label: 'Annual Revenue', fieldName:'AnnualRevenue', cellAttributes:{iconName:{fieldName:'revenueIcon'},iconPosition:'right',class:{fieldName:'revenueClass'}}}
];

export default class Accountmoreinfo extends LightningElement {
    columns = columns;

    @api visibility;
    accountName;
    subscribtionmesg = null;
    accountResults = [];

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
        getAccountData({accountName:this.accountName})
        .then(results => {this.accountResults = results})
        .catch(error =>{
            console.log(error);
        })   
    }
}