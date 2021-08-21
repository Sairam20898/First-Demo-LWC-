({
	doInsert : function(comp) {
        alert('This is from doInsert Method from Helper js');
		//var en = comp.get("v.empName");
        var efn = comp.get("v.empFatherName");
        var eem = comp.get("v.empEmail");
        var ed = comp.get("v.empDept");
        var ead = comp.get("v.empAddress");
        
        var action = comp.get('c.doInsertData');
        action.setParams({
            "en":comp.get('v.empName'),
            "efn":efn,
            "ee":eem,
            "ed":ed,
            "ead":ed
        });
        
        action.setCallback(this,function(res){
            var state = res.getState();
            if(state == 'SUCCESS'){
                alert('Congrats, your details has been successfully Saved...');
            } else{
                alert('Sorry, Something went wrong....!');
            }
        });
        
        $A.enqueueAction(action);
	}
})