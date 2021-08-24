import { LightningElement,api, wire } from 'lwc';
import { deleteRecord, updateRecord } from 'lightning/uiRecordApi';
import moreInfoChannel from '@salesforce/messageChannel/Account_More_Info__c'; 
import Name_Field from '@salesforce/schema/Account.Name';
import Phone_Field from '@salesforce/schema/Account.Phone';
import Website_Field from '@salesforce/schema/Account.Website';
import Id_Field from '@salesforce/schema/Account.Id';
import updateAccounts from '@salesforce/apex/accountSearchController.updateAccounts';
import deleteAccounts from '@salesforce/apex/accountSearchController.deleteAccounts';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';

const actions = [
    {label:'Update Record', name:'Update_Record'},
    {label:'Delete Record', name:'Delete_Record'}
];

const columns = [
    { label: 'Account Name',  editable:true, fieldName: 'name', cellAttributes: {iconName:'standard:account', iconPosition:'Left'}},
    {label: 'Website', fieldName: 'website', type:'text'},
    {label: 'Phone', fieldName: 'phone', type: 'phone' },
    {label: 'AnnualRevenue', fieldName:'AnnualRevenue', cellAttributes:{iconName:{fieldName:'revenueIcon'},iconPosition:'right',class:{fieldName:'revenueClass'}}},
    {label: 'Billing State', fieldName:'state', type:'text'},
    { label: 'Action', type: 'action', typeAttributes: {rowActions:actions }}
];

export default class Showsearchresult extends LightningElement {
    columns = columns;
    actions = actions;
    @api searchResults = [];

    selectedRowIds = [];

    accountName;
    subscribtionmesg = null;

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
    getAccountDetails(mesg){
        this.accountName = mesg.accountName;
    }
    

    handleRowAction(event){
        console.log('handle row action'+event);
        const actioName = event.detail.action.name;
        if (actioName === 'Update_Record'){
            console.log('update condition..');
            this.updateRow(event.detail.row);
        } else if(actioName === 'Delete_Record' ){
            console.log('Delete record condition');
            this.deleteRow(event.detail.row['id'], event.detail.row);
        }
    }

    handleSave(event){
        console.log(event.detail.draftValues);
        var accountsData = [];
        event.detail.draftValues.forEach(x=>{
           var account = {
                Name: x.name,
                Id : x.id
            }
            accountsData.push(account);
        });
        updateAccounts({accounts: accountsData})
        .then(x=>{
            console.log(x);
        })
        .catch(e=>{
            console.log(e);
        })
    }

    updateRow(row){
        const fields = {};
        console.log(row['name']);
        fields[Id_Field.fieldApiName] = row['id'];
        fields[Name_Field.fieldApiName] = row['name'];
        fields[Website_Field.fieldApiName] = row['website'];
        fields[Phone_Field.fieldApiName] = row['phone'];
        
        var Record = {
            "fields": fields
        };
        updateRecord(Record)
            .then(() => {
                console.log('success');
            })
            .catch(error => {
                console.log('error');
            });
    }

    deleteRow(id, row){
        deleteRecord(id).then(result=>{
           alert('Recod has been deleted succesfully.');
           this.searchResults = this.searchResults.filter(function(value){
               console.log(result);
               return value.id != id;
           });
       })
       .catch(error=>{
           console.log('Record Deletion Error' + error);
       })
   }

   handleRowSelection(event){
        this.selectedRowIds = event.detail.selectedRows;
        console.log(this.selectedRowIds);
   }

   deleteMultipleRecords(event){
        console.log(this.selectedRowIds);
        var acctsData = [];
        this.selectedRowIds.forEach(x=>{
           var account = {
                Id : x.id
            }
            this.searchResults = this.searchResults.filter(function(value){
                return value.id != x.id;
            })

            // getAccountData({accountName: this.accountName})
            // .then(results =>{
            //     console.log(results);
            //     this.dispatchEvent(new CustomEvent('getnewaccountdata',{
            //         detail:results
            //     }));

            // })
            // .catch(error =>{
            //     console.log(error);
            // });

            acctsData.push(account);
        });
        console.log(acctsData);
        deleteAccounts({accounts: acctsData})
        .then(x=>{
            console.log(x);
        })
        .catch(e=>{
            console.log(e);
        })
   }

}