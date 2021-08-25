import { LightningElement, api } from 'lwc';

export default class Checkboxlwc extends LightningElement {
    @api isChecked;
	@api rowId;
	@api isRowEditable;
	@api columnName;
	@api userId;

	@api handleCheckboxChange(event)
	{
		console.log(this.rowId);
		console.log(event.target.checked);
		this.dispatchEvent(new CustomEvent('checkboxchange', {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {
                data: { checkboxvalue: event.target.checked,
						columnName: event.target.title,
						rowId: this.rowId
				 	  }
            }
        }));
	}
}