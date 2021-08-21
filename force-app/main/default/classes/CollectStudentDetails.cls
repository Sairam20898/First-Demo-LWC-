@restResource(urlMapping='/Details/*')
global class CollectStudentDetails {
	
    @httpGet
    global static Map<String, String> getDetailsGetMethod(){
        Map<String, String> ma = new Map<String, String>();
        ma.put('name', 'Sairam');
        return ma;
    }
    
    @httpPost
    global static void getDetailsGetMethod(String name){
        System.debug('Name : '+name);
    }
}