public class ConsumeRestClass {
    public void getConsumeData(){
        Http h = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndPoint('https://th-apex-http-callout.herokuapp.com/animals');
        req.setMethod('GET');
        HttpResponse res = h.send(req);
        System.debug(res);
        if (res.getStatusCode() == 200){
            System.debug('Response Body '+ res.getBody());
        }
    }

}