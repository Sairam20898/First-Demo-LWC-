public with sharing class accountSearchController {
    public accountSearchController() {

    }
    @AuraEnabled(cacheable=true)
    public static List<account> getAccountResults(String accountName, String address){
        List<Account> accounts;
        if(accountName == 'All' || accountName == 'all' ){
            accounts = [SELECT id, name, website, phone, AnnualRevenue,BillingAddress FROM Account];
        }else{
            accountName = '%' + accountName + '%';
            accounts = [SELECT id, name,website, phone, AnnualRevenue,BillingAddress FROM Account WHERE name LIKE:accountName];
        }
        
        System.debug('Accounts'+accounts);
        return accounts;
        //String accountName
        // WHERE name LIKE:accountName

    }

    @AuraEnabled(cacheable=true)
    public static List<RecordType> getRecordTypes(string objName){
        try {
            return [SELECT ID, NAME FROM RecordType WHERE SobjectType =:objName];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getContactData(String accountName){
        accountName = '%'+accountName+'%';
        try {
            List<Account> accts = [SELECT id, Name,(SELECT ID, Name,Birthdate, Phone, Email FROM contacts) FROM Account WHERE Name LIKE:accountName];
            System.debug('Accounts'+accts);
            return  accts;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled(cacheable=false)
    public static string updateAccounts(List<Account> accounts){
        try {
            System.debug('accounts: '+accounts);
            update accounts;
            return 'Accounts updated';
        } catch (Exception e) {
            System.debug(e.getMessage());
            return e.getMessage();
            //throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=false)
    public static string deleteAccounts(List<Account> accounts){
        try {
            System.debug('accounts: '+accounts);
            delete accounts;
            return 'Successfully Deleted Selected Accounts ';
        } catch (Exception e) {
            return 'Not deleted '+e.getMessage();
        }
    }

    @AuraEnabled
    public static string insertLogger(Logger__c log){
        insert log;
        return log.Id;
    }
}
