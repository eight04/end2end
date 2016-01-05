angular.module("end2end").directive("noscroll", function(prepare){
	return {
		restrict: "A",
		link: function(scope, element){
			prepare(element).then(function(){
				var vspace = element[0].offsetHeight - element[0].clientHeight,
					hspace = element[0].offsetWidth - element[0].clientWidth;

				element.css("margin-bottom", "-" + vspace + "px");
				element.css("margin-right", "-" + hspace + "px");
			});
		}
	};
});
