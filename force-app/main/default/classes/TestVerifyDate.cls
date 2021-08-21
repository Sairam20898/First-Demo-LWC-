@isTest
private class TestVerifyDate {

    @isTest static void WithinMonthCheckDates(){
        Date d1 = date.today();
        Date d2 = date.today().addDays(20);
        Date d3 = date.today().addDays(45);
        Date d4 = date.today().addDays(-10);

        Date Date1 = VerifyDate.CheckDates(d1,d2);
        System.assertEquals(d2, Date1);

        Date Date2 = VerifyDate.CheckDates(d1,d3);
        System.assertEquals(d2, Date1);

        Date Date3 = VerifyDate.CheckDates(d1,d4);
        System.assertEquals(d2, Date1);

       }
}