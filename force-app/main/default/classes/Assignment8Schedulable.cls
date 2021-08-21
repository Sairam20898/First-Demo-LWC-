global class Assignment8Schedulable implements Schedulable {
    global void execute(SchedulableContext sc){
        Assignment7Batchable ab = new Assignment7Batchable();
        Database.executeBatch(ab);
    }
}