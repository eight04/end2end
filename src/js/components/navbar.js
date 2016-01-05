
angular.modue("end2end").directive("navbar", function($animate){
	return {
		restrict: "C",
		controller: function() {
			var collapse = null;

			this.addCollapse = function(c){
				collapse = c;
			};

			this.toggle = function(){
				if (!collapse) {
					return;
				}

				if (!collapse.show) {
					$animate.addClass(collapse.element, "active");
				} else {
					$animate.removeClass(collapse.element, "active");
				}
				collapse.show = !collapse.show;
			};
		}
	};
}).directive("navbarToggle", function(){
	return {
		restrict: "C",
		require: "?^navbar",
		link: function(scope, element, attrs, nbCtrl) {
			if (!nbCtrl) {
				return;
			}
			element.on("click", function(){
				nbCtrl.toggle();
			});
		}
	};
}).directive("navbarCollapse", function(){
	return {
		restrict: "C",
		require: "?^navbar",
		link: function(scope, element, attrs, nbCtrl) {
			if (!nbCtrl) {
				return;
			}

			var collapse = {
				element: element,
				show: element.hasClass("active")
			};

			nbCtrl.addCollapse(collapse);
		}
	};
});
