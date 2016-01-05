angular.module("end2end").directive("inputSame", function(){
	var pool = {};

	return {
		restrict: "A",
		require: "ngModel",
		link: function(scope, element, attrs, ngModel){
			var id = null;

			if (!attrs.inputSame) {
				pool[attrs.inputSame] = [];
			}

			pool[attrs.inputSame].push(ngModel);


			attrs.$observe("checkPass", function(value){
				var i;

				if (passJar[id]){
					for (i = 0; i < passJar[id].length; i++) {
						if (passJar[id][i] == ngModel) {
							passJar[id].splice(i, 1);
							break;
						}
					}
				}
				validate(id);

				id = value;
				if (!passJar[id]) {
					passJar[id] = [];
				}
				passJar[id].push(ngModel);
				validate(id);
			});

			scope.$watch(function(){
				return ngModel.$modelValue;
			}, function(){
				validate(id);
			});
		}
	};
});
