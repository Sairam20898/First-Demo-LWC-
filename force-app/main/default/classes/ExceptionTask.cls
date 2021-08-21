public class ExceptionTask {
    public void getRes(){
        try{
            DemoClass d;
            d.getString();
            
            List<integer> li = new List<integer>();
            li.add(20);
            integer a = li[0];
            integer b = li[1];
            
        } catch(NullPointerException e){
            System.debug('The null object cannot be initiated');
        }catch(ListException e){
            System.debug('The list index out of range..');
        }catch(Exception e){
            System.debug('Something went wrong..'+e);
        }finally{
            System.debug('Haii... Iam from Finally block');
        }
    }

}