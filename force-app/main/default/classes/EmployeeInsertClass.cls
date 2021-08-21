public class EmployeeInsertClass {
    @auraEnabled
    public static void doInsertData(String en, String efn, String ee, String ed, String ea){
        Employee__c emp = new Employee__c();
        emp.Name = en;
        emp.Employee_Father_Name__c = efn;
        emp.Employee_Email_Id__c = ee;
        emp.Address__c = ea;
        emp.Department__c = ed;
        
        insert emp;
    }

}