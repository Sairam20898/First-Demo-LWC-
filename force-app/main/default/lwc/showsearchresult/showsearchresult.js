import { LightningElement,api, wire } from 'lwc';
import { deleteRecord, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import moreInfoChannel from '@salesforce/messageChannel/Account_More_Info__c'; 
import Name_Field from '@salesforce/schema/Account.Name';
import Phone_Field from '@salesforce/schema/Account.Phone';
import Website_Field from '@salesforce/schema/Account.Website';
import Id_Field from '@salesforce/schema/Account.Id';
import updateAccounts from '@salesforce/apex/accountSearchController.updateAccounts';
import deleteAccounts from '@salesforce/apex/accountSearchController.deleteAccounts';
import insertLogger from '@salesforce/apex/accountSearchController.insertLogger';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';

const actions = [
    {label:'Update Record', name:'Update_Record'},
    {label:'Delete Record', name:'Delete_Record'}
];

const columns = [
    { label: 'Select', type: 'checkbox', fieldName: 'select', typeAttributes:{rowId: {fieldName: 'id'}, columnName: 'Click to select the row'}},
    { label: 'Account Name',  editable:true, fieldName: 'name', sortable: true, cellAttributes: {iconName:'standard:account', iconPosition:'Left'}},
    {label: 'Website', fieldName: 'website', type:'text'},
    {label: 'Phone', fieldName: 'phone', type: 'phone' },
    {label: 'AnnualRevenue', fieldName:'AnnualRevenue', cellAttributes:{iconName:{fieldName:'revenueIcon'},iconPosition:'right',class:{fieldName:'revenueClass'}}},
    {label: 'Billing State', fieldName:'state', type:'text'},
    { label: 'Upload Files', type:'fileupload',fieldName:'upload'},
    { label: 'Action', type: 'action', typeAttributes: {rowActions:actions }}
    
];

export default class Showsearchresult extends LightningElement {
    columns = columns;
    actions = actions;
    @api searchResults = [];
    sortedBy;
    sortedDirection;

    selectedRowIds = [];

    accountName;
    subscribtionmesg = null;

    @wire(MessageContext)
    mesgContext;

    updateColumnSorting(event) {
        var fieldName = event.detail.fieldName;
        var sortDirection = event.detail.sortDirection;
        // assign the latest attribute with the sorted column fieldName and sorted direction
        this.sortedBy = fieldName;
        if(this.sortedDirection=='asc'){
            sortDirection = 'desc';
        }
        else{
            sortDirection = 'asc'
        }
        this.sortedDirection = sortDirection;
        this.sortData(fieldName, sortDirection);
   }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.searchResults));

        let keyValue = (a) => {
            return a[fieldname];
        };

        let isReverse = direction === 'asc' ? 1 : -1;

        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; 
            y = keyValue(y) ? keyValue(y) : '';

            return isReverse * ((x > y) - (y > x));
        });
        this.searchResults = parseData;
    }

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
    
    handleGridCheckboxChange(event){
        console.log(event);
    }

    handleUploadFile(event){
        console.log(event);
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
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Accounts Updated Succesfully',
                    variant: 'success'
                })
            );
        })
        .catch(error=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error in updating records',
                    message: this.handleError(error,''),
                    variant: 'error'
                })
            );

            const logData = {
                Method_Name__c: 'handle save method',
                Component_Name__c: 'Show search result',
                Error__c: this.handleError(error,'')
              }
              insertLogger({log:logData})
              .then(loggerResult=>{
                console.log(loggerResult);
              })
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
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Account Updated Succesfully',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                console.log('error');
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: this.handleError(error,''),
                        variant: 'error'
                    })
                );
                const logData = {
                    Method_Name__c: 'update Row record',
                    Component_Name__c: 'Show search result',
                    Error__c: this.handleError(error,'')
                  }
                  insertLogger({log:logData})
                  .then(loggerResult=>{
                    console.log(loggerResult);
                  })
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
           alert(this.handleError(error,''));
           const logData = {
                Method_Name__c: 'deleteRow',
                Component_Name__c: 'Showsearchresult',
            Error__c: this.handleError(error,'')
            }
            insertLogger({log:logData})
            .then(loggerResult=>{
                console.log(loggerResult);
            })
           
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
            alert(this.handleError(e, ''));
            const logData = {
                Method_Name__c: 'deleteMultipleRecords',
                Component_Name__c: 'Showsearchresults',
                Error__c: this.handleError(error,'')
              }
              insertLogger({log:logData})
              .then(loggerResult=>{
                console.log(loggerResult);
              })
        })
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