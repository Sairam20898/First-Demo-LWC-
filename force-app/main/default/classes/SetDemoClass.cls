public class SetDemoClass {
    public void getMethod(){
        set<String> s = new set<String>();
        s.add('sairam');
        s.add('raj');
        s.add('amith');
        s.add('amith');
        System.debug(s);
        
        for (String x:s){
            System.debug(x);
        }
    }

}