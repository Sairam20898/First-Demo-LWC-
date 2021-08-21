public class SOQLDemo {
    public void getAccounts(){
        List<Account> act = [SELECT id, name,Rating FROM Account];
        //List<Account> act = [SELECT id, name,Rating FROM Account order by name limit 5];
        //List<Account> act = [SELECT id, name, Rating FROM Account where Rating='Warm'];
        
        for(Account a:act){
            System.debug('Account ID= '+a.id+', Account Name= '+a.Name+', Rating : '+a.Rating);
        }
    }

}