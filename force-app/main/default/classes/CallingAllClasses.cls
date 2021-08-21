public class CallingAllClasses {
    public void getMethod(){
        Addition add = new Addition();
        Subtraction sub = new Subtraction();
        Multiplication mult = new Multiplication();
        Division div = new Division();
        
        add.getSum();
        sub.getSub();
        mult.getMult();
        div.getDiv();
    }
    
}