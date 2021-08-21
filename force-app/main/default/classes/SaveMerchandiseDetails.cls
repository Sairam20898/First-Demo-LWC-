public class SaveMerchandiseDetails {
    @auraEnabled
    public static void saveMerchDetails(String merchName, String merchDesc, String merchStock, String merchCost){
        Merchandise__c mer = new Merchandise__c();
        mer.Name = merchName;
        mer.Description__c = merchDesc;
        mer.Stock__c = decimal.valueOf(merchStock);
        mer.Currency__c = decimal.valueOf(merchCost);
        
        insert mer;
    } 

}