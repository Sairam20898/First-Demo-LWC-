public class StringArrayTest {
    public static List<String> generateStringArray(integer n){
        List<String> stringArray = new List<String>();
        for(integer i=0; i<n; i++){
            stringArray.add('Test'+i);
        }
        System.debug(stringArray);
        return stringArray;
        
    }

}