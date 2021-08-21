import { LightningElement,api } from 'lwc';

const columns = [
    { label: 'Account Name', fieldName: 'name', cellAttributes: {iconName:'standard:account', iconPosition:'Left'}},
    {label: 'Website', fieldName: 'website', type:'text'},
    {label: 'Phone', fieldName: 'phone', type: 'phone' },
    {label: 'AnnualRevenue', fieldName:'AnnualRevenue', cellAttributes:{iconName:{fieldName:'revenueIcon'},iconPosition:'right',class:{fieldName:'revenueClass'}}},
    {label: 'Billing State', fieldName:'state', type:'text'}
    
];
export default class Showsearchresult extends LightningElement {
    columns = columns;
    @api searchResults = [];
    
}