global class MySchedule implements Schedulable{
    global void execute(SchedulableContext sc){
        MyBatch mb = new MyBatch();
        Database.executeBatch(mb);
    }
}