public class DemoClass {
    public void getString(){
        System.debug('Nothing here to dispaly...');
    }
    
    @testVisible
    private void privateMethod(){
        System.debug('This is the test method iside the DemoClass...');
    }
    
    public integer doAddition(integer x, integer y){
        integer res = x+y;
        return res;
    }
    
    public integer doSubtraction(integer x, integer y){
        integer res = x-y;
        return res;
    }
    
    public static void checkAccount(Account acc){
        System.debug('This is the checkAccount method to execute');
    }
    
}