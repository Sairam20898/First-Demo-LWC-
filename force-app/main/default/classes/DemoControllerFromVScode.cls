public with sharing class DemoControllerFromVScode {
    public static List<Account> DemoControllerFromVScode() {
        List<Account> accs = [select id,name from Account];

        return accs;
    }
}