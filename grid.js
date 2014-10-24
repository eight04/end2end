(function(){
"use strict";

$(function(){
	$("[class|=row]").contents().filter(function(){
		// alert(this.parentNode.all[0]);
		return this.nodeType == 3;
	}).remove();
});

})();
