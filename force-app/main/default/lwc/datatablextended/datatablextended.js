import LightningDatatable from 'lightning/datatable';
import checkboxextended from './checkboxlwcnew.html';
import fileupload from './fileuploadlwc.html';
export default class Datatablextended extends LightningDatatable {
    static customTypes = {
        checkbox: {
            template: checkboxextended,
			typeAttributes: ['isChecked', 'isRowEditable', 'columnName', 'userId', 'rowId'],
        },
        fileupload: {
            template: fileupload,
			typeAttributes: [],
        }
    };
}