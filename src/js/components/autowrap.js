
angular.module("end2end").directive("autowrap", function(prepare){
	return {
		restrict: "C",
		link: function(scope, element) {
			prepare(element).then(function(){
				var scrollWidth = element[0].scrollWidth,
					offsetWidth = element[0].offsetWidth;

				if (offsetWidth < scrollWidth) {
					element.addClass("wrap");
				}
			});
		}
	};
});
