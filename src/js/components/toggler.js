angular.module("end2end").factory("togglerHelper", function($animate, prepare){
	return {
		getStatus: function(element) {
			var status = [], i, child = element.children();
			for (i = 0; i < child.length; i++) {
				if (child[i].className.match(/\bactive\b/)) {
					status.push(true);
				} else {
					status.push(false);
				}
			}
			return status;
		},
		active: function(element) {
			//			console.log("active", element);
			var child = angular.element(element[0].children[1]);
			$animate.addClass(element, "active");
			//			element.addClass("active");
			if (!child[0] || element[0].nodeName != "LI") {
				return;
			}
			if (!prepare.test(child)) {
				child.addClass("ng-hide");
				//				console.log('prepare failed');
			}
			$animate.removeClass(child, "ng-hide");
			//			child.removeClass("ng-hide");
		},
		deactive: function(element) {
			//			console.log("deactive", element);
			var child = angular.element(element[0].children[1]);
			$animate.removeClass(element, "active");
			if (!child[0] || element[0].nodeName != "LI") {
				return;
			}
			$animate.addClass(child, "ng-hide");
		}
	};
}).directive("toggled", function(toggler) {
	return {
		restrict: "AC",
		link: function(scope, element, attrs){
			var id = attrs.toggled;
			toggler(id).add(element);
		}
	};
}).directive("toggler", function(toggler){

	function getChildIndex(element, child) {
		var cs = element.children(), i;
		for (i = 0; i < cs.length; i++) {
			if (cs[i] == child) {
				return i;
			}
		}
		throw "Not children";
	}

	return {
		restrict: "AC",
		link: function(scope, element, attrs){
			var id = attrs.toggler,
				multiple = attrs.multiple != null;

			toggler(id).add(element);

			element.on("click", function(e){
				var t = e.target;

				// Check whether is clicking on <a>
				while (t && t.nodeName != "A" && t.parentNode != element[0]) {
					t = t.parentNode;
				}
				if (!t || t.nodeName != "A") {
					return;
				}

				// Only trigger on toggler>li>a
				var li = t.parentNode;
				if (li.parentNode != element[0]) {
					return;
				}

				if (!multiple) {
					toggler(id).active(getChildIndex(element, li));
				} else {
					toggler(id).toggle(getChildIndex(element, li));
				}
			});
		}
	};
}).factory("toggler", function(togglerHelper){
	var jar = {};

	function setStatus(element, status) {
		var lis = element.children(), j;

		for (j = 0; j < lis.length; j++) {
			if (status[j]) {
				togglerHelper.active(angular.element(lis[j]));
			} else {
				togglerHelper.deactive(angular.element(lis[j]));
			}
		}
	}

	return function(id) {
		if (!jar[id]) {
			var o = jar[id] = {
				elements: [],
				status: [],
				add: function(element) {
					o.elements.push(element);

					var i, child = element.children();
					for (i = 0; i < child.length; i++) {
						if (/\bactive\b/.test(child[i].className) && !o.status[i]) {
							o.toggle(i);
						}
					}
					setStatus(element, o.status);
				},
				active: function(index) {
					var i;

					if (o.status.length <= index) {
						o.status.length = index + 1;
					}

					for (i = 0; i < o.status.length; i++) {
						o.status[i] = i == index;
					}

					for (i = 0; i < o.elements.length; i++) {
						setStatus(o.elements[i], o.status);
					}
				},
				toggle: function(index) {
					var i;

					o.status[index] = !o.status[index];

					for (i = 0; i < o.elements.length; i++) {
						setStatus(o.elements[i], o.status);
					}
				}
			};
		}
		return jar[id];
	};
});
