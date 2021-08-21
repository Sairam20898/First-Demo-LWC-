({
	saveDetails : function(comp) {
        alert('Saving Merchandise details has started');
        var n = comp.get("v.merName");
        var d = comp.get("v.merDesc");
        var s = comp.get("v.merStock");
        var c = comp.get("v.merCost");
        
        var action = comp.get('c.saveMerchDetails');
        action.setParams({
            "merchName":n,
            "merchDesc":d,
            "merchStock":s,
            "merchCost":c
        });
        
        action.setCallback(this, function(res){
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