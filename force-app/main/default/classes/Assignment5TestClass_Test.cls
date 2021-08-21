@isTest
public class Assignment5TestClass_Test {
    static testMethod void doTest(){
        integer expResult = Assignment5TestClass.doAddition(5, 17);
        Test.startTest();
        	System.assertEquals(expResult, 22);
        Test.stopTest();
    }
}