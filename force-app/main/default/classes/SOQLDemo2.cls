public class SOQLDemo2 {
    public void getMarchandise(){
        List<Merchandise__c> mrc = [SELECT id, name,Stock__c FROM Merchandise__c];
        //List<Merchandise__c> mrc = [SELECT id, name,Stock__c FROM Merchandise__c where Stock__c=5000];
        for(Merchandise__c m:mrc){
            System.debug('Marchandise ID= '+m.id+', Marchandise Name= '+m.Name+', Stock : '+m.Stock__c);
        }
    }

}