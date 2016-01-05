
angular.module("end2end").factory("affix", function($window){
	var affixJar = [];

	function affix(o){
		var rect, parentRect, containerRect, width, height, state;

		rect = o.element[0].getBoundingClientRect();
		containerRect = o.container[0].getBoundingClientRect();
		parentRect = o.parent[0].getBoundingClientRect();

		if (parentRect.top >= 0) {
			state = "affix-top";
		} else if (parentRect.top < 0 && containerRect.bottom - (rect.bottom - rect.top) <= 0) {
			state = "affix-bottom";
		} else {
			state = "affix-fixed";
		}

		if (state != "affix-top") {
			width = o.parent[0].clientWidth + "px";
			height = o.element[0].offsetHeight + "px";
		} else {
			width = "";
			height = "";
		}

		if (width != o.width && width != "0px") {
			o.element.css("width", width);
			o.width = width;
		}
		if (height != o.height && height != "0px") {
			o.parent.css("height", height);
			o.height = height;
		}

		if (state != o.state) {
			if (state == "affix-bottom") {
				o.element.css("top", containerRect.bottom - containerRect.top - (rect.bottom - rect.top) + "px");
			} else {
				o.element.css("top", "");
			}
			o.element.removeClass(o.state);
			o.element.addClass(state);
			o.state = state;
		}

	}

	function affixContainer(){
		var i;
		for (i = 0; i < affixJar.length; i++) {
			affix(affixJar[i]);
		}
	}

	angular.element($window).on("resize", affixContainer);
	angular.element($window).on("scroll", affixContainer);

	return {
		affix: function(container, parent, element) {
			affixJar.push({
				element: element,
				container: container,
				parent: parent,
				width: null,
				state: null
			});
		}
	};
}).directive("affix", function(affix){

	return {
		restrict: "C",
		link: function(scope, element){
			var containerElement = element;
			while (!containerElement.hasClass("affix-container") && containerElement[0]) {
				containerElement = containerElement.parent();
			}
			if (!containerElement[0]) {
				throw "Can't find affix-container!";
			}

			var contentElement = angular.element(element[0].querySelector(".affix-content"));
			if (!contentElement[0]) {
				throw "Can't find affix-content!";
			}

			affix.affix(containerElement, element, contentElement);
		}
	};
});
