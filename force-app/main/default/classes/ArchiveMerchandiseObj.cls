public class ArchiveMerchandiseObj {
    
    public static void insertMerchandiseRecords(List<Merchandise__c> mer){
        Archived_Merchandise__c am;// = new Archived_Merchandise__c();
        //am.name = mer[0].name;
        //insert am;
        for(Merchandise__c m:mer){
            am=new Archived_Merchandise__c();
            am.name = m.name;
            am.Description__c = m.Description__c;
            am.Stock__c = m.Stock__c;
            am.Cost__c = m.Currency__c;
            
            insert am;
        }
    }
}