public class ASMD {
    integer a = 10;
    integer b = 6;
    integer res;
    
    public void getSum(){
        res = a+b;
        System.debug('a+b is : '+res);
    }
    public void getSubValue(){
        res = a-b;
        System.debug('a-b is : '+res);
    }
    public void getMult(){
        res = a*b;
        System.debug('a*b is : '+res);
    }
    public void getDiv(){
        res = a/b;
        System.debug('a/b is : '+res);
    }

}