
angular.module("end2end").directive("fillViewHeight", function(){
	var jar = [];

	function setHeight(element) {
		element.css("max-height", document.documentElement.clientHeight + "px");
	}

	angular.element(window).on("resize", function(){
		var i;
		for (i = 0; i < jar.length; i++) {
			setHeight(jar[i]);
		}
	});

	return {
		restrict: "C",
		link: function(scope, element){
			jar.push(element);
			setHeight(element);
		}
	};
});
