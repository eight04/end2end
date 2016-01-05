
angular.module("end2end").directive("number", function(){

	return {
		restrict: "A",
		require: "ngModel",
		scope: {
			min: "=",
			max: "="
		},
		link: function(scope, element, attrs, ngModel) {

			ngModel.$parsers.push(function(viewValue){
				var empty = viewValue == "";
				ngModel.$setValidity("number", empty || /^-?\d+(\.\d+)?$/.test(viewValue));
				ngModel.$setValidity("min", empty || scope.min == null || +viewValue >= scope.min);
				ngModel.$setValidity("max", empty || scope.max == null || +viewValue <= scope.max);
				return viewValue;
			});

			ngModel.$formatters.push(function(modelValue){
				var empty = modelValue == null;
				ngModel.$setValidity("number", empty || typeof modelValue == "number" && !isNaN(modelValue));
				ngModel.$setValidity("min", empty || scope.min == null || modelValue >= scope.min);
				ngModel.$setValidity("max", empty || scope.max == null || modelValue <= scope.max);
				return modelValue;
			});

			element.on("keydown", function(e){
				var value;

				if (e.keyCode == "38") {
					// Up
					scope.$apply(function(){
						if (scope.max != null && ngModel.$modelValue + 1 > scope.max) {
							return;
						}
						if (scope.min == null && ngModel.$modelValue == null) {
							return;
						}
						if (scope.min != null && (ngModel.$modelValue < scope.min || ngModel.$modelValue == null)) {
							value = scope.min;
						} else {
							value = ngModel.$modelValue + 1;
						}

						ngModel.$setViewValue(value);
						ngModel.$render();
						element[0].select();
					});
				}

				if (e.keyCode == "40") {
					// Down
					scope.$apply(function(){
						if (scope.min != null && ngModel.$modelValue - 1 < scope.min) {
							return;
						}
						if (scope.max == null && ngModel.$modelValue == null) {
							return;
						}
						if (scope.max != null && (ngModel.$modelValue > scope.max || ngModel.$modelValue == null)) {
							value = scope.max;
						} else {
							value = ngModel.$modelValue - 1;
						}

						ngModel.$setViewValue(value);
						ngModel.$render();
						element[0].select();
					});
				}
			});
		}
	};
});
