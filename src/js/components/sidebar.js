angular.module("end2end").directive("sidebar", function(){
	return {
		restrict: "C",
		controller: function($element, $animate){
			var controller = this;

			controller.toggle = function(){
				if (!$element.hasClass("active")) {
					$animate.addClass($element, "active");
					$element.on("click", controller.toggle);
				} else {
					$animate.removeClass($element, "active");
					$element.off("click", controller.toggle);
				}
			};
		}
	};
}).directive("sidebarToggle", function(){
	return {
		restrict: "C",
		require: "^sidebar",
		link: function(scope, element, attrs, controller){
			element.on("click", function(e){
				controller.toggle();
				e.stopPropagation();
			});
		}
	};
});
