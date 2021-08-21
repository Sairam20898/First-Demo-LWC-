public class MyCustomController {

    
    Account md;
    public MyCustomController(){
        ID i = apexpages.currentpage().getparameters().get('id');
        if(i==null){
            md = new Account();
        }
        else{
            md = [select id,name from Account where id =:i];
        }
    }
    
    public Account getMyCustomController() {
        return md;
    }
    
    
    public pageReference doSave() {
        upsert md;
        return new pageReference('https://www.google.com');
    }
}