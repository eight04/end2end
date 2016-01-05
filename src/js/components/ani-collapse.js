// This module provide easy to use collpasing animation.

angular.module("end2end").animation(".ani-collapse", function(prepare, watch){
	function beforeCollapse(element, done){

		// display: none
		if (!prepare.test(element)) {
			if (done) {
				done();
			}
			return;
		}

		// Start collapsing
		if (!element.hasClass("collapsing")) {
			element.css("height", element[0].scrollHeight + "px");
			element.addClass("collapsing");
		}

		// Render
		void element[0].offsetHeight;
		if (done) {
			done();
		}
	}
	function collapse(element, done){
		if (!prepare.test(element)) {
			done();
		}

		function active(){
			if (!element.hasClass("ng-leave-active") && element.hasClass("ng-leave")) {
				setTimeout(active);
				return;
			}
			element.css("height", "0");
		}
		setTimeout(active);

		function end(){
			//			console.log("transition end");
			element.off("transitionend", end);
			element.removeClass("collapsing");
			done();
		}
		element.on("transitionend", end);

		return function(canceled){
			if (canceled) {
				element.off("transitionend", end);
				element.css("height", element[0].offsetHeight + "px");
				done();
			}
		};
	}
	function beforeUncollapse(element, done){
		if (!element.hasClass("collapsing")) {
			element.css("height", "0");
			element.addClass("collapsing");
		}
		void element[0].offsetHeight;
		if (done) {
			done();
		}
	}
	function uncollapse(element, done) {

		element.css("height", element[0].scrollHeight + "px");
		function end(){
			element.off("transitionend", end);

			// Removing height cause flickering in Opera?
			// Wait till angular degist stop.
			watch(function(){
				return element[0].className;
			}, function(value){
				if (value.indexOf("ng-hide-remove-active") < 0) {
					// Check if another animation using style.height
					if (value.indexOf("collapsing") < 0) {
						element.css("height", "");
					}
					return false;
				}
			});

			element.removeClass("collapsing");
			done();
		}
		element.on("transitionend", end);

		return function(canceled){
			if (canceled) {
				element.off("transitionend", end);
				element.css("height", element[0].offsetHeight + "px");
				done();
			}
		};
	}

	// Some browsers don't support transition
	if (!window.TransitionEvent && document.documentElement.style.transition === undefined) {
		return {};
	}

	return {
		beforeAddClass: function(element, cls, done) {
			if (cls == "ng-hide") {
				beforeCollapse(element, done);
			} else if (cls == "active") {
				beforeUncollapse(element, done);
			} else {
				done();
			}
		},
		addClass: function(element, cls, done){
			if (cls == "ng-hide") {
				return collapse(element, done);
			} else if (cls == "active") {
				return uncollapse(element, done);
			} else {
				done();
			}
		},
		beforeRemoveClass: function(element, cls, done){
			if (cls == "ng-hide") {
				beforeUncollapse(element, done);
			} else if (cls == "active") {
				beforeCollapse(element, done);
			} else {
				done();
			}
		},
		removeClass: function(element, cls, done){
			if (cls == "ng-hide") {
				return uncollapse(element, done);
			} else if (cls == "active") {
				return collapse(element, done);
			} else {
				done();
			}
		},
		enter: function(element, done){
			beforeUncollapse(element);
			return uncollapse(element, done);
		},
		leave: function(element, done){
			beforeCollapse(element);
			return collapse(element, done);
		}
	};
});
