angular.module("end2end").factory("scrollspy", function($window){
	var target, nav;
	angular.element($window).on("scroll", function(){
		if (!target || !nav) {
			return;
		}
		var id = target.getActiveId();
		nav.active(id);
	});
	return {
		registerTarget: function(e){
			target = e;
		},
		registerNav: function(e){
			nav = e;
		}
	};
}).directive("scrollspyTarget", function(scrollspy){
	return {
		restrict: "A",
		link: function(scope, element){
			scrollspy.registerTarget({
				element: element,
				getActiveId: function(){
					var eles = element[0].querySelectorAll("h1, h2, h3, h4, h5, h6"),
						i, navs = [];
					for (i = 0; i < eles.length; i++) {
						if (!eles[i].id) {
							continue;
						}
						navs.push({
							element: eles[i],
							rect: eles[i].getBoundingClientRect()
						});
					}
					for (i = 0; i < navs.length; i++) {
						// Use 1 instead of 0 to match sub-pixel
						if (navs[i].rect.top <= 1 &&
							(navs[i + 1] && navs[i + 1].rect.top > 1 ||
							 !navs[i + 1] && element[0].getBoundingClientRect().bottom > 1)) {
							return navs[i].element.id;
						}
					}
					return null;
				}
			});
		}
	};
}).directive("scrollspyNav", function(scrollspy, $animate, togglerHelper){
	return {
		restrict: "A",
		link: function(scope, element) {
			var activated = [];

			function notIn(element, nodes) {
				var i;
				for (i = 0; i < nodes.length; i++) {
					if (nodes[i][0] == element[0]) {
						return false;
					}
				}
				return true;
			}

			scrollspy.registerNav({
				element: element,
				active: function(id){
					var ele, toActive, i;

					toActive = [];

					if (id) {
						ele = element[0].querySelector("[href='#" + id + "']");
						if (ele) {
							ele = angular.element(ele);
							while (ele[0] != element[0]) {
								if (ele[0].nodeName == "LI") {
									toActive.push(ele);
								}
								ele = ele.parent();
							}
						}
					}

					for (i = 0; i < activated.length; i++) {
						if (notIn(activated[i], toActive)) {
							togglerHelper.deactive(activated[i]);
						}
					}

					for (i = toActive.length - 1; i >= 0; i--) {
						if (notIn(toActive[i], activated)) {
							togglerHelper.active(toActive[i]);
						}
					}

					activated = toActive;
				}
			});
		}
	};
})
;
