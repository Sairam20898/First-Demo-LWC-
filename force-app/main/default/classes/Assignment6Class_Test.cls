@isTest
public class Assignment6Class_Test {
    @isTest static void doClassTest(){
        integer expResult = Assignment6Class.doMultiplication(5, 6);
        Test.startTest();
        System.assertEquals(expResult, 30);
        Test.stopTest();
    }

}