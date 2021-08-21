public class DifferentArgTypes {
    public void getRes(integer a, integer b){
        integer res = a+b;
        System.debug('Sum of ' + a +',' + b +' is : '+res);
    }
    public void getRes(String s1, String s2){
        String res = s1+'-'+s2;
        System.debug('Concatenation of \"' + s1 +'\",\"' + s2 +'\" is : '+res);
    }
    
    public void getRes(integer x, String st){
        String res = x+st;
        System.debug('The results of ' + x + '+' + st + ' is :' + res);
    }

}