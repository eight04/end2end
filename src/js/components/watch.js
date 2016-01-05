
angular.module("end2end").factory("watch", function(){
	return function(exp, callback) {
		var hold = null;

		var check = function() {
			var newHold = exp(), digest;
			if (newHold != hold) {
				hold = newHold;
				digest = callback(hold);
			}
			if (digest !== false) {
				setTimeout(check);
			}
		};
		setTimeout(check);
	};
});
