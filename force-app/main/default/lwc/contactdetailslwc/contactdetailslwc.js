import { LightningElement, wire, track } from 'lwc';
import contactMoreInfo from '@salesforce/messageChannel/Contact_More_Info__c';
import getContactData from '@salesforce/apex/accountSearchController.getContactData';
// import getAccountName from '@salesforce/apex/accountSearchController.getAccountName';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';

const maindiv = document.getElementById('contactdetailsdiv');
const columns = [
    {label:'Contacts under Account', fieldName:'accountName', type:'text'},
    {label:'Birth Date', fieldName:'dob',type:'text'},
    {label:'Phone number', fieldName:'phone', type:'phone'},
    {label:'Email', fieldName:'email', type:'email'}
];
export default class Contactdetailslwc extends LightningElement {
    @track columns = columns;
    @track data = [];

    acIndex = 1;
    conIndex = 1;
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
        this.acIndex = 1;
        this.conIndex = 1;
        results.forEach((e,index) => {
           this.acIndex = this.acIndex+index;
            var con = [];
            console.log(e);
            console.log(e.Contacts);
            e.Contacts.forEach( (c,index) =>{
                this.conIndex = this.conIndex+index;
               var conData ={
                   name:this.acIndex +'-'+this.conIndex,
                   accountName:c.Name,
                   dob:c.Birthdate,
                   phone:c.Phone,
                   email:c.Email
               };
               con.push(conData);
            });

            var acData = {
                name:this.acIndex,
                accountName:e.Name,
                // dob:"-",
                // phone:"-",
                // email:"-",
                _children:con
            };
            this.data.push(acData);

            this.data = [...this.data];
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

    columns = columns;
}