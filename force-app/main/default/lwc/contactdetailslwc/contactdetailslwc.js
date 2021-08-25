import { LightningElement, wire } from 'lwc';
import contactMoreInfo from '@salesforce/messageChannel/Contact_More_Info__c';
import getContactData from '@salesforce/apex/accountSearchController.getContactData';
// import getAccountName from '@salesforce/apex/accountSearchController.getAccountName';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import Name from '@salesforce/schema/Account.Name';
import { getRecord } from 'lightning/uiRecordApi';


const maindiv = document.getElementById('contactdetailsdiv');
const columns = [
    {label:'Account Name',fieldName:'AccountId'},
    {label:'Contact Name',fieldName:'Name'},
    {label:'Date of Birth',fieldName:'Birthdate', type:'Text'},
    {label:'Phone',fieldName:'Phone',type:'Phone'},
    {label:'Email',fieldName:'Email', type:'Email'}
];
export default class Contactdetailslwc extends LightningElement {
    columns = columns;

    searchString = '\"Search String\"';
    accountName;
    subscribtionmesg = null;
    contactResults = [];

    @wire(MessageContext)
    mesgContext;

    connectedCallback(){
        this.subscribeToChannelMessage();
        
    }

    subscribeToChannelMessage(){
        if(this.subscribtionmesg==null || this.subscribtionmesg==undefined){
            this.subscribtionmesg =  subscribe(this.mesgContext,
                                                contactMoreInfo,
                                                (mesg)=> this.getContactDetails(mesg));
        }
    }

    getContactDetails(mesg){
        console.log(mesg);
        this.searchString = '\"'+ mesg.accountName +'\"';
        this.accountName = mesg.accountName;
        getContactData({accountName:this.accountName})
        .then(results => {
            this.getContactResults(results);
            console.log(results);
        })
        .catch(error =>{
            console.log(error);
        })   
    }

    getContactResults(results){
        var res=[];
        var index = 0;
        var acName;
        results.forEach(e => {
            e.Contacts.forEach(c => {
                this.recordId = c.AccountId;
                res[index]=c; 
                console.log(res);
                index = index+1;
                this.contactResults = res;
                console.log(this.contactResults);
            })
        });
    }

    // getAccountNameFun(accId){
    //     getAccountName({acId:accId})
    //     .then(results =>{
    //         return results;
    //         console.log(results);
    //     })
    //     .catch(error =>{
    //         console.log(error);
    //     });
    // }
    columns = columns;
    
    
    getContacts(e){
        const contactDiv = document.createElement('div');
        // contactDiv.innerHTML = `
        //         <h1>Account Name: ${e.Name}</h1>
        //         // <div style="height: 300px;">
        //         //     <lightning-datatable
        //         //             key-field="id"
        //         //             data={contactDetails}}
        //         //             columns={columns}>
        //         //     </lightning-datatable>
        //         // </div> 
        // `
        contactDiv.innerHTML = 'Haii how r u?';
        maindiv.appendChild(contactDiv);
        console.log(e.Contacts);
    }



}