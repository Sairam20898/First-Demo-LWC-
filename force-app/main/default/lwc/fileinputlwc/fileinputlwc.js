import { LightningElement,api } from 'lwc';

export default class Fileinputlwc extends LightningElement {
    @api recordId;
    get acceptedFormats() {
        return ['.pdf', '.png','.jpg','.jpeg'];
    }


    @api handleUploadFinished(event){
        console.log(event);
        this.dispatchEvent(new CustomEvent('uploadfile',{
            composed: true,
            bubbles: true,
            cancelable: true,
            detail:''
        }))
    }
}