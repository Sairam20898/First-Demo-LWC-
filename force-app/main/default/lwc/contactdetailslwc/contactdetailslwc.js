import { LightningElement, wire } from 'lwc';
import contactMoreInfo from '@salesforce/messageChannel/Contact_More_Info__c';
import getContactData from '@salesforce/apex/accountSearchController.getContactData';
// import getAccountName from '@salesforce/apex/accountSearchController.getAccountName';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';

const maindiv = document.getElementById('contactdetailsdiv');
const gridColumns = [
    {label:'Contacts under Account', fieldName:'accountName', type:'text'},
    {label:'Birth Date', fieldName:'dob',type:'text'},
    {label:'Phone number', fieldName:'phone', type:'text'},
    {label:'Email', fieldName:'email', type:'text'}
];
export default class Contactdetailslwc extends LightningElement {
    gridColumns = gridColumns;
    gridData = [];
    name;
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
        results.forEach(e => {
            var con = [];
            console.log(e);
            console.log(e.Contacts);
            e.Contacts.forEach( c =>{
               var conData ={
                   name:c.Id,
                   accountName:c.Name,
                   dob:c.Birthdate,
                   phone:c.Phone,
                   email:c.Email
               };
               con.push(conData);
            });

            var data = {
                name:e.Id,
                accountName:e.Name,
                dob:"",
                phone:"",
                email:"",
                _children:con
            };
            this.gridData.push(data);
            console.log(this.gridData);
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
}