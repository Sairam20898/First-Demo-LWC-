public class ExceptionDemo {
    public void getMethod(integer a, integer b){
        try{
            integer res= a/b;
            System.debug('Result is : '+res);
            
            DemoClass d;
            d.getString();
        }catch(MathException e){     
            System.debug('Please do not divide any number with zero, The program throws '+e +'Exception');
        } catch(NullPointerException e){
            System.debug('Please do not call method with null object..');
        }catch(Exception e){
            System.debug('Something went wrong.. system returns'+e+ 'Exception');
        }finally{
            System.debug('This is from Finally block...');
        }
        System.debug('Normal execution process will be Continued');
    }

}