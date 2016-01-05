angular.module("end2end").directive("ngType", function(){
	return {
		restrict: "A",
		link: function(scope, element, attrs){
			scope.$watch(function(){
				return scope.$eval(attrs.ngType);
			}, function(value){
				if (typeof value == "string") {
					element.attr("type", value);
				} else {
					element.removeAttr("type");
				}
			});
		}
	};
});
