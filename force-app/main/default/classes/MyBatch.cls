global class MyBatch implements Database.Batchable<sObject> {
    global Database.QueryLocator start(Database.BatchableContext bc){
        String query = 'select id, name from account';
        return Database.getQueryLocator(query);
    }
    
    global void execute (Database.BatchableContext bc, List<Account> acc){
        for(Account a:acc){
            a.name = a.name+'-Updated...!';
          
            //String newName = a.name.removeEnd('-Updated...!');
            //a.name = newName;
        }
        update acc;
    }
    
    public void finish(Database.BatchableContext bc){
        
    }
}