public class ListOfAccountRecords {
    public void ListOfAccountRecords(){
        //contructor body
    }

    public List<Account> getGetListOfAccountRecords() {
        List<Account> acc = [select id, name from account];
        return acc;
    }
    
    public void doInsert(Account acc){
        insert acc;
    }


}