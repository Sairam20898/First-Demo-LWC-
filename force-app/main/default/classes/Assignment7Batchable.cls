global class Assignment7Batchable implements Database.Batchable<sObject> {
    global Database.QueryLocator start(Database.BatchableContext bc){
        String query = 'select id, name from Merchandise__c';
        return Database.getQueryLocator(query);
    }
    
    global void execute (Database.BatchableContext bc, List<Merchandise__c> mer){
        for(Merchandise__c m:mer){
            m.name = m.name+'-Updated...!';
          
            //String newName = m.name.removeEnd('-Updated...!');
            //m.name = newName;
        }
        update mer;
    }
    
    public void finish(Database.BatchableContext bc){
        
    }
}