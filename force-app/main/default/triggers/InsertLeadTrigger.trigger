//Assignment4 trigger
trigger InsertLeadTrigger on Lead (before insert,after insert, before update, after update, 
                                   before delete, after delete) {
	if(Trigger.isDelete && Trigger.isBefore){
        InsertIntoArchivedLeads.insertRecords(Trigger.old);
    }
}