import { LightningElement, wire } from 'lwc';
import contactMoreInfo from '@salesforce/messageChannel/Contact_More_Info__c';
import getContactData from '@salesforce/apex/accountSearchController.getContactData';
// import getAccountName from '@salesforce/apex/accountSearchController.getAccountName';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import {
    EXAMPLES_COLUMNS_DEFINITION_BASIC,
    EXAMPLES_DATA_BASIC,
} from './sampleData';

const maindiv = document.getElementById('contactdetailsdiv');
const gridColumns = [
    {label:'Contacts under Account', fieldName:'accountName', type:'text'},
    {label:'Birth Date', fieldName:'dob',type:'text'},
    {label:'Phone number', fieldName:'phone', type:'Phone'},
    {label:'Email', fieldName:'email', type:'Email'}
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
            var data = {};
            console.log(e);
            console.log(e.Contacts);
            e.Contacts.forEach( c =>{
               var conData ={};
               conData['id'] = c.Id;
               conData['accountName'] = c.Name;
               conData['dob'] = c.Birthdate;
               conData['phone'] = c.Phone;
               conData['email'] = c.Email;
               console.log('Contact Details:'+conData);
               con.push(conData);
            })

            if(e.Contacts.length === 0){
                data['id'] = e.Id;
                data['accountName'] = e.Name;
                data['dob'] = '';
                data['phone'] = '';
                data['email'] = '';
                this.gridData.push(data);
            } else{
                data['id'] = e.Id;
                data['accountName'] = e.Name;
                data['dob'] = '';
                data['phone'] = '';
                data['email'] = '';
                data['_children'] = con;
                this.gridData.push(data);
                console.log(this.gridData);
            }
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