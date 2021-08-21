public virtual class ParentClass {
    public void getParentMethod(){
        System.debug('This is the method from Parent class');
    }
    public void getParentMethod2(){
        System.debug('Method 2 from Parent Class');
    }
    
    public virtual void info(){
        System.debug('Information method from Parent Object or Class');
    }

}