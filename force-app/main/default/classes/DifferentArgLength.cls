public class DifferentArgLength {
    integer res;
    public void sum(integer a, integer b){
        res = a+b;
        System.debug('Sum of '+ a + '&' + b + 'is : '+res);
    }
    
    public void sum(integer a, integer b, integer c){
        res = a+b+c;
        System.debug('Sum of '+ a + ',' + b +',' + c + 'is : '+res);
    }

}