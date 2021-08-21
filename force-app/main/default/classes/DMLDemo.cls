public class DMLDemo {
    public void insertTo(){
        List<Contact> con = new List<Contact>{
            new Contact(FirstName='Joe',LastName='Smith',Department='Finance'),
            new Contact(FirstName='Kathy',LastName='Smith',Department='Technology')
                };
        insert con;            
    }
    public void updateTo(){
        List<Account> con = new List<Account>{
            new Account(id='0015g00000MuHYRAA3',name='joy'),
            new Account(id='0015g00000MuHWdAAN',name='Google')
                };
        update con;            
    }
    public void toUpsert(){
        List<Account> con = new List<Account>{
            new Account(id='0015g00000MuHYRAA3',name='joy'),
            new Account(id='0015g00000MuHWdAAN',name='Google'),
            new Account(name='facebook')
                };
        upsert con;            
    }
    public void deleteRecords(){
        List<Account> con = new List<Account>{
            new Account(id='0015g00000MuHYRAA3'),
            new Account(id='0015g00000MuHWdAAN')};
        delete con;            
    }
}