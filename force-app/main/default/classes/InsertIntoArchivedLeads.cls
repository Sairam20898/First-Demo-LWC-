//Assignment4 class
public class InsertIntoArchivedLeads{
    public static void insertRecords(List<Lead> ld){
        Archived_Lead__c al = new Archived_Lead__c();
        al.name = ld[0].name;
        insert al;
    }
}