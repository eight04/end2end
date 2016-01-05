
angular.module("end2end").directive("modelUpdate", function(){

	return {
		restrict: "A",
		require: "ngModel",
		scope: {
			exp: "&modelUpdate"
		},
		link: function(scope, element, attrs, ngModel){
			var updateFlag = false;

			scope.$watch(function(){
				return ngModel.$modelValue;
			}, function(){
				updateFlag = true;
			});

			element.on("blur", function(){
				if (updateFlag) {
					scope.exp();
					updateFlag = false;
					scope.$apply();
				}
			});
		}
	};
});
