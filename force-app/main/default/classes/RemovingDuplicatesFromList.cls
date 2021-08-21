public class RemovingDuplicatesFromList {
    public void getMethod(){
        List<String> emp = new List<String>();
        emp.add('sai');
        emp.add('suresh');
        emp.add('ramesh');
        emp.add('naresh');
        emp.add('sai');
        emp.add('suresh');
        System.debug('Before removing the duplicate elements: '+emp);
        
        set<String> st = new set<String>();
        st.addAll(emp);
        System.debug('After removing the duplicate elements: '+st);
    }

}