//Assignment 5
public class SOSLDemo {
    public void getText(){
        List<List<sObject>> sList = [find 'birlasoft' in name fields returning lead(id,name),account(name),contact(name)];
        List<Lead> ld = sList[0];
        List<account> acc = sList[1];
        List<contact> con = sList[2];
        
        if (ld.size()>0){
            for(Lead l:ld){
                System.debug('Lead Name = '+l.name+', Lead Id : '+l.id);
            }
        } else {
            System.debug('There no elements in the Lead Objects Matching to your Query');
        }
        
        if (acc.size()>0){
            for(Account a:acc){
                System.debug('Account Name = '+a.name);
            }
        } else {
            System.debug('There no elements in the Account Objects Matching to your Query');
        }
        
        if (con.size()>0){
            for(Contact c:con){
                System.debug('Contact Name = '+c.name);
            }
        } else {
            System.debug('There no elements in the Contact Objects Matching to your Query');
        }
    }

}