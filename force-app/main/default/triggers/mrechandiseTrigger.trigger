trigger mrechandiseTrigger on Merchandise__c (before Insert, before Update, before Delete, 
after Insert, after Update, after Delete) {

    if(Trigger.isDelete && Trigger.isBefore){
        ArchiveMerchandiseObj.insertMerchandiseRecords(Trigger.old);
    }
    
}