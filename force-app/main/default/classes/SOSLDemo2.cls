public class SOSLDemo2 {
    public void getText(){
        List<List<sObject>> sList = [Find 'Lenovo' in name fields returning Merchandise__c(id,name)];
        List<Merchandise__c> mar = sList[0];
        for(Merchandise__c m:mar){
            System.debug('Name : '+m.name+', Id : '+m.id);
        }
    }

}