
angular.module("end2end").factory("loader", function(modal){
	var m = null;
	return {
		start: function(){
			if (m) {
				this.stop();
			}
			m = modal.open({
				template: "Loading...",
				escToggle: false,
				backdropToggle: false
			});
		},
		stop: function(){
			if (!m) {
				return;
			}
			m.close();
			m = null;
		}
	};
});
