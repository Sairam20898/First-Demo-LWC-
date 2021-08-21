@restResource(urlMapping='/myAccounts/*')
global class REST_DemoClass {
    @httpGet
    global static List<Account> getAllAccounts(){
        List<Account> acts = [select id,name from account];
        return acts;
    }
    
    @httpPost
    global static void postAllAccounts(String name){
        Account act = new Account();
        act.name = name;
        insert act;
    }

}