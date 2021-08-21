public class GetWeatherDetails {
    public static void getWeatherReports(){
        Http htp = new Http();
        HttpRequest req = new HttpRequest();
        
        req.setEndpoint('https://api.openweathermap.org/data/2.5/weather?q=chennai&appid=3f3c4571996310de45c2a4ffddd5908c');
        req.setMethod('GET');
        req.setTimeout(100000);
        
        HttpResponse res = htp.send(req);
        
        if(res.getStatusCode() == 200){
            System.debug('Result is: '+ res.getBody());
        }
    }

}