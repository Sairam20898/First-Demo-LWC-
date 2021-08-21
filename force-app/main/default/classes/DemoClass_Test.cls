@isTest
private class DemoClass_Test {
	@isTest
    public static void doTest(){
        DemoClass dc = new DemoClass();
        dc.getString();
        
        dc.privateMethod();
        
        integer r = dc.doAddition(12,13);
        System.assertEquals(r, 25);
        
        integer r1 = dc.doSubtraction(20,13);
        System.assertEquals(r1,7);
    }
}