//Assignment 1
public class MapDemoClass {
    public void getMethod(){
        Map<integer, String> mp = new Map<integer, String>();
        mp.put(1, 'sairam');
        mp.put(2, 'amith');
        mp.put(5, 'sairam');
        mp.put(4,'raj');
        mp.put(3,'vakul');
        mp.put(2,'malhotra');
        
        System.debug(mp);
        
        set<integer> keys = mp.keySet();
        for (integer k:keys){
            System.debug(mp.get(k));
        }
        
        Iterator<integer> itr = keys.iterator();
        while(itr.hasNext()){
            System.debug(mp.get(itr.next()));    
        }
    }

}