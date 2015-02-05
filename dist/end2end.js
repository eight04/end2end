
(function(){

"use strict";

angular.module(
	"end2end", []
).directive("navbar", function($animate){
	return {
		restrict: "C",
		controller: function() {
			var collapse = null;

			this.addCollapse = function(c){
				collapse = c;
			};

			this.toggle = function(){
				if (!collapse) {
					return;
				}

				if (!collapse.show) {
					$animate.addClass(collapse.element, "active");
				} else {
					$animate.removeClass(collapse.element, "active");
				}
				collapse.show = !collapse.show;
			};
		}
	};
}).directive("navbarToggle", function(){
	return {
		restrict: "C",
		require: "?^navbar",
		link: function(scope, element, attrs, nbCtrl) {
			if (!nbCtrl) {
				return;
			}
			element.on("click", function(){
				nbCtrl.toggle();
			});
		}
	};
}).directive("navbarCollapse", function(){
	return {
		restrict: "C",
		require: "?^navbar",
		link: function(scope, element, attrs, nbCtrl) {
			var collapse = {
				element: element,
				show: element.hasClass("active")
			};

			nbCtrl.addCollapse(collapse);
		}
	};
}).animation(".ani-collapse", function($timeout, prepare, watch){
	function beforeCollapse(element, done){

		// display: none
		if (!prepare.test(element)) {
			if (done) {
				done();
			}
			return;
		}

//		if (element[0].offsetHeight > 10000) {
//			// weird height?
////			console.log('Weird offsetHeight?', element[0], element[0].offsetHeight);
//			var i, children = element.children(), weird;
//			for (i = 0; i < children.length; i++) {
//				console.log(children[i], children[i].offsetHeight);
//			}
//			done();
//			return;
//		}

		// Start collapsing
		if (!element.hasClass("collapsing")) {
			element.css("height", element[0].scrollHeight + "px");
			element.addClass("collapsing");
		}

		// Render
		void(element[0].offsetHeight);
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
				$timeout(active);
				return;
			}
			element.css("height", "0");
		}
		$timeout(active);

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
		void(element[0].offsetHeight);
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
}).directive("checkPass", function(){
	var passJar = {};

	function validate(id){
		if (!passJar[id]) {
			return;
		}

		var i, key = passJar[id][0].$modelValue, eq = true;
		for (i = 1; i < passJar[id].length; i++) {
			if (passJar[id][i].$modelValue != key) {
				eq = false;
				break;
			}
		}

		for (i = 0; i < passJar[id].length; i++) {
			passJar[id][i].$setValidity("checkPass", eq);
		}
	}

	return {
		restrict: "A",
		require: "ngModel",
		link: function(scope, element, attrs, ngModel){
			var id = null;

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
}).directive("sidebar", function(){
	return {
		restrict: "C",
		controller: function($element, $animate){
			var controller = this;

			controller.toggle = function(){
				if (!$element.hasClass("active")) {
					$animate.addClass($element, "active");
					$element.on("click", controller.toggle);
				} else {
					$animate.removeClass($element, "active");
					$element.off("click", controller.toggle);
				}
			};
		}
	};
}).directive("sidebarToggle", function(){
	return {
		restrict: "C",
		require: "^sidebar",
		link: function(scope, element, attrs, controller){
			element.on("click", function(e){
				controller.toggle();
				e.stopPropagation();
			});
		}
	};
}).factory("scrollspy", function($window){
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
}).directive("modalStack", function(){
	return {
		restrict: "C",
		templateUrl: "templates/modalStack.html",
		scope: true,
		controller: function($scope){
			this.modals = $scope.modals = [];

			this.add = function(modal){
				$scope.modals.push(modal);
			};

			this.remove = function(modal){
				var i;
				for (i = 0; i < $scope.modals.length; i++) {
					if ($scope.modals[i] == modal) {
						break;
					}
				}
				if (i < $scope.modals.length) {
					$scope.modals.splice(i, 1);
				}
			};

			this.top = function(){
				return this.modals.length > 0 && this.modals[this.modals.length - 1] || null;
			};
		}
	};
}).directive("e2eModal", function($compile, $http, $templateCache, $timeout){
	return {
		restrict: "A",
		link: function(scope, element) {
			var key, modal = scope.modal;

			if (modal.scope) {
				for (key in modal.scope) {
					scope[key] = modal.scope[key];
				}
			}

			// Compile template
			if (modal.templateUrl) {
				$http({
					method: "GET",
					url: modal.templateUrl,
					cache: $templateCache
				}).success(function(result){
					element.append(result);
					$compile(element.contents())(scope);
				});
			} else {
				element.append(modal.template);
				$compile(element.contents())(scope);
			}

			modal.element = element;
			modal.focusElement = document.activeElement;

			$timeout(function(){
				var input = element[0].querySelector("[autofocus]");
				if (input) {
					input.focus();
				}
				if (document.activeElement == modal.focusElement) {
					element[0].focus();
				}
			});

			element.on("click", function(e){
				if (e.target != element[0] || !modal.backdropToggle) {
					return;
				}
				scope.$apply(function(){
					if (modal.onbackdrop) {
						modal.onbackdrop(e);
					}
					if (!e.defaultPrevented) {
						modal.close();
					}
				});
			});
		}
	};
}).factory("modal", function($animate, $q, $compile, $rootScope, $timeout, $document){
	var modalStack, modalStackElement;

	modalStackElement = $compile("<div class='modal-stack'></div>")($rootScope);
	$document.find("body").append(modalStackElement);

	$timeout(function(){
		modalStack = modalStackElement.controller("modalStack");
	});

	$document.on("keydown", function(e){
		var modal, inputs, dirty, next, i, t;
		if (!modalStack || !(modal = modalStack.top()) || e.ctrlKey || e.altKey) {
			return;
		}

		if (e.keyCode == 27 && !e.shiftKey && modal.escToggle) {
			$rootScope.$apply(function(){
				if (modal.onesc) {
					modal.onesc(e);
				}

				if (!e.defaultPrevented) {
					$timeout(function(){
						modal.close();
					});
				}
			});
		}

		if (e.keyCode == 9) {
			inputs = modal.element[0].querySelectorAll("input, select, button, textarea, a, [tabindex]");
			t = [];
			for (i = 0; i < inputs.length; i++) {
				if (!inputs[i].disabled) {
					t.push(inputs[i]);
				}
			}
			inputs = t;
			for (i = 0; i < inputs.length; i++) {
				if (inputs[i] == document.activeElement) {
					if (!e.shiftKey) {
						next = (i + 1) % inputs.length;
					} else {
						next = (i - 1 + inputs.length) % inputs.length;
					}
					inputs[next].focus();
					dirty = true;
					break;
				}
			}
			if (!dirty && inputs.length) {
				inputs[0].focus();
			}
			e.preventDefault();
		}
	});

	return {
		open: function(modal){
			if (!modal.template && !modal.templateUrl) {
				throw "template and templateUrl are undefined.";
			}
			if (modal.escToggle === undefined) {
				modal.escToggle = true;
			}
			if (modal.backdropToggle === undefined) {
				modal.backdropToggle = true;
			}

			var deferred = $q.defer();

			modal.then = function(success, fail, notify){
				return deferred.promise.then(success, fail, notify);
			};

			modal.close = function(value){
				if (modal.onclose) {
					modal.onclose(value);
				}
				modalStack.remove(modal);
				deferred.resolve(value);
				modal.focusElement.focus();
			};

			modal.on = function(event, callback) {
				modal["on" + event] = callback;
				return modal;
			};

			modalStack.add(modal);

			return modal;
		}
	};
}).factory("dialog", function(modal, $q){
	var types = {
		create: {
			title: "Dialog",
			btns: [
				{
					label: "OK",
					value: true,
					submit: true
				},
				{
					label: "Cancel",
					value: false
				}
			],
			brand: "primary"
		},
		show: {
			title: "Message",
			btns: [
				{
					label: "OK",
					value: true,
					submit: true
				}
			],
			brand: "info"
		},
		error: {
			title: "Error",
			btns: [
				{
					label: "OK",
					value: true
				}
			],
			brand: "danger"
		},
		confirm: {
			title: "Confirm",
			btns: [
				{
					label: "OK",
					value: true,
					submit: true
				},
				{
					label: "Cancel",
					value: false
				}
			],
			brand: "warning"
		},
		yesno: {
			title: "Question",
			btns: [
				{
					label: "Yes",
					value: true,
					submit: true
				},
				{
					label: "No",
					value: false
				},
				{
					label: "Cancel",
					value: null
				}
			],
			brand: "warning"
		}
	};

	function createDialog(msg, title, type){
		var dialog = angular.copy(types[type]);

		if (typeof msg == "object") {
			angular.extend(dialog, msg);
		} else {
			dialog.msg = String(msg);
			dialog.title = title || dialog.title;
		}
		if (dialog.backdropToggle === undefined) {
			dialog.backdropToggle = false;
		}

		dialog.deferred = $q.defer();

		dialog.modal = modal.open({
			templateUrl: "templates/dialog.html",
			scope: {
				dialog: dialog
			},
			escToggle: dialog.escToggle,
			backdropToggle: dialog.backdropToggle
		}).on("backdrop", function(e){
			e.preventDefault();
			if (dialog.onbackdrop) {
				dialog.onbackdrop();
			}
		}).on("esc", function(e){
			e.preventDefault();
			if (dialog.onesc) {
				dialog.onesc();
			}
			if (dialog.btns.length <= 2) {
				dialog.cancel();
			} else if (dialog.btns.length >= 3) {
				dialog.dismiss();
			}
		}).on("close", function(value){
			if (dialog.onclose) {
				dialog.onclose(value);
			}
		});

		dialog.submit = function(value) {
			if (dialog.btns.length <= 1 || value) {
				dialog.ok(value);
			} else if (dialog.btns.length <= 2 || (dialog.btns.length >= 3 && value != null)) {
				dialog.cancel(value);
			} else {
				dialog.dismiss(value);
			}
		};

		dialog.ok = function(value) {
			dialog.close(value, "ok");
			dialog.deferred.resolve(value);
		};

		dialog.cancel = function(value) {
			dialog.close(value, "cancel");
			if (dialog.btns.length <= 2) {
				dialog.deferred.reject(value);
			} else {
				dialog.deferred.resolve(value);
			}
		};

		dialog.dismiss = function(value) {
			dialog.close(value, "dismiss");
			if (dialog.btns.length >= 3) {
				dialog.deferred.reject(value);
			}
		};

		dialog.close = function(value, method){
			if (dialog.fakeBinding) {
				dialog.fakeBinding();
			}
			if (dialog.result) {
				value = dialog.result(value);
			}
			if (dialog["on" + method]) {
				dialog["on" + method](value);
			}
			dialog.modal.close(value);
		};

		dialog.on = function(event, callback) {
			dialog["on" + event] = callback;
			return dialog;
		};

		dialog.then = function(success, fail) {
			dialog.deferred.promise.then(success, fail);
			return dialog;
		};

		dialog["catch"] = function(callback) {
			dialog.deferred.promise["catch"](callback);
		};

		return dialog;
	}

	return {
		show: function(msg, title){
			return createDialog(msg, title, "show");
		},
		error: function(msg, title){
			return createDialog(msg, title, "error");
		},
		confirm: function(msg, title){
			return createDialog(msg, title, "confirm");
		},
		yesno: function(msg, title){
			return createDialog(msg, title, "yesno");
		},
		create: function(msg, title){
			return createDialog(msg, title, "create");
		}
	};
}).directive("e2eDialog", function($templateCache, $http, $compile, $controller){
	return {
		restrict: "A",
		link: function(scope, element){
			var dialog = scope.dialog, key;

			// Put scope things into $scope
			for (key in dialog.scope) {
				scope[key] = dialog.scope[key];
			}

			// FakeBinding, put $scope things back to scope, will be called after dialog closed.
			dialog.fakeBinding = function(){
				var key;
				for (key in dialog.scope) {
					dialog.scope[key] = scope[key];
				}
			};

			// Create controller
			if (dialog.controller) {
				dialog.ctrlInstance = $controller(dialog.controller, {
					"$scope": scope,
					"dialogInstance": dialog
				});
			}

			// Include template
			$http({
				method: "GET",
				url: dialog.templateUrl,
				cache: $templateCache
			}).success(function(result){
				dialog.templateLoaded = true;
				element.append(result);
				$compile(element.contents())(scope);
			});
		}
	};
}).factory("togglerHelper", function($animate, prepare){
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
}).directive("tableFixed", function($timeout, $parse, affix, scrollsync, prepare){

	function calcBounds(f, trs, fixedLength, vbounds) {
		var bounds = [],
			rowspans = [],
			i, j, k,
			td, colspan, rowspan, end, len, rect, vend;

		// Get first cell rect
		if (f == "left") {
			bounds[0] = trs[0].children[0].getBoundingClientRect().left;
		} else {
			len = trs[0].children.length;
			bounds[0] = trs[0].children[len - 1].getBoundingClientRect().right;
		}

		// Claculate horizontal bounds and save result to element.offset
		for (i = 0; i < trs.length; i++) {
			len = trs[i].children.length;
			for (j = 0; j < fixedLength; j++) {
				for (k = 0; k < rowspans.length; k++) {
					if (rowspans[k].start == j) {
						if (j == 0) {
							trs[i].className += " table-fixed-inner-row";
						}
						j = rowspans[k].end + 1;
					}
				}
				if (j >= fixedLength) {
					continue;
				}

				if (f == "left") {
					td = trs[i].children[j];
				} else {
					td = trs[i].children[len - j - 1];
				}

				rect = td.getBoundingClientRect();

				colspan = td.getAttribute("colspan");
				rowspan = td.getAttribute("rowspan");

				if (colspan && +colspan > 0) {
					end = j + +colspan - 1;
				} else {
					end = j;
				}

				if (!bounds[end + 1]) {
					if (f == "left") {
						bounds[end + 1] = rect.right;
					} else {
						bounds[end + 1] = rect.left;
					}
				}

				if (rowspan && +rowspan > 0) {
					vend = i + +rowspan - 1;
				} else {
					vend = i;
				}

				if (td.getAttribute("fixed-span") == null) {
					td.className += " table-fixed-" + f + "-calc";
					td.tableFixed = {
						offset: Math.abs(bounds[j] - bounds[0]),
						width: Math.abs(bounds[j] - bounds[end + 1]),
						height: vbounds[vend + 1] - vbounds[i]
					};
				}

				if (rowspan) {
					rowspans.push({
						start: j,
						end: end,
						rows: +rowspan
					});
				}
			}
			for (k = 0; k < rowspans.length; k++) {
				rowspans[k].rows--;
				if (!rowspans[k].rows) {
					rowspans.splice(k, 1);
					k--;
				}
			}
		}
		return Math.abs(bounds[0] - bounds[fixedLength]);
	}

	function calcSpans(table) {
		var tds = table[0].querySelectorAll("[fixed-span]");
//		var tds = table[0].querySelectorAll("[colspan='0']");

		var i, rect;
		for (i = 0; i < tds.length; i++) {
			rect = tds[i].getBoundingClientRect();
			tds[i].tableFixed = {
				height: rect.bottom - rect.top
			};
			tds[i].className += " table-fixed-span-calc";
		}
	}

	function setOffset(table, leftLength, rightLength){
		var vbounds = [], i, rect, trs, theadRect,
			sumLeft, sumRight, tableRect;

		trs = table.find("tr");

		// Calculate vertical bounds
		for (i = 0; i < trs.length; i++) {
			rect = trs[i].getBoundingClientRect();
			vbounds[i] = rect.top;
		}
		vbounds[i] = rect.bottom;

		// Set tr height
		for (i = 0; i < trs.length; i++) {
			trs[i].style.height = vbounds[i + 1] - vbounds[i] + "px";
		}

		// Calculate thead, tbody
		theadRect = table.find("thead")[0].getBoundingClientRect();
		tableRect = table[0].getBoundingClientRect();

		sumLeft = calcBounds("left", trs, leftLength, vbounds);
		sumRight = calcBounds("right", trs, rightLength, vbounds);

		calcSpans(table);

		return {
			left: sumLeft,
			right: sumRight,
			theadHeight: theadRect.bottom - theadRect.top,
			tbodyHeight: tableRect.bottom - theadRect.bottom
		};
	}

	return {
		restrict: "C",
		templateUrl: "templates/tableFixed.html",
		transclude: true,
		link: function(scope, element, attrs) {
			var fixedLeft = +attrs.fixedLeft || 0,
				fixedRight = +attrs.fixedRight || 0,
				setter, table, tableFixedHead, tableFixedTable, headContainer, affixWrapper;

			tableFixedHead = angular.element(element[0].querySelector(".table-fixed-head"));
			tableFixedTable = angular.element(element[0].querySelector(".table-fixed-table"));

			headContainer = tableFixedHead.children();
			table = tableFixedTable.find("table");

			affixWrapper = angular.element(element[0].querySelector(".affix-wrapper"));

			affix.affix(element, affixWrapper, affixWrapper.children());
			scrollsync.create(headContainer, table.parent());

			function redraw(){

//				console.log("redraw");
				var i, td, sum, thead, tds;

				thead = table.find("thead");

				table.css("width", "");
				table.css("height", "");
				table.css("margin-top", "");

				table.find("tr").css("height", "");

				tds = angular.element(table[0].querySelectorAll(".table-fixed-cell"));
				tds.removeClass("table-fixed-cell");
				tds.css("width", "");
				tds.css("height", "");

				thead.css("display", "");

//				console.log("setOffset");

				sum = setOffset(table, fixedLeft, fixedRight);

//				console.log("setOffset done");

				tds = table[0].querySelectorAll(".table-fixed-left-calc");
				for (i = 0; i < tds.length; i++) {
					td = angular.element(tds[i]);
					td.css("left", td[0].tableFixed.offset + "px");
					td.css("width", td[0].tableFixed.width + "px");
					td.css("height", td[0].tableFixed.height + "px");
					td.addClass("table-fixed-cell table-fixed-left");
					td.removeClass("table-fixed-left-calc");
				}

				tds = table[0].querySelectorAll(".table-fixed-right-calc");
				for (i = 0; i < tds.length; i++) {
					td = angular.element(tds[i]);
					td.css("right", td[0].tableFixed.offset + "px");
					td.css("width", td[0].tableFixed.width + "px");
					td.css("height", td[0].tableFixed.height + "px");
					td.addClass("table-fixed-cell table-fixed-right");
					td.removeClass("table-fixed-left-calc");
				}

//				console.log("table-fixed-span-calc");

				tds = table[0].querySelectorAll(".table-fixed-span-calc");
				for (i = 0; i < tds.length; i++) {
					td = angular.element(tds[i]);
					td.css("height", td[0].tableFixed.height + "px");
					td.addClass("table-fixed-cell table-fixed-span");
					td.removeClass("table-fixed-span-calc");
				}

				tableFixedHead.css("padding-left", sum.left + "px");
				tableFixedHead.css("padding-right", sum.right + "px");
				tableFixedTable.css("padding-left", sum.left + "px");
				tableFixedTable.css("padding-Right", sum.right + "px");

				// Stupid chrome hack
				table.css("display", "none");
				void(table[0].offsetWidth);
				table.css("display", "");

//				console.log("Make fixed header");

				// Make fixed header
				var clone = table.clone();
				var theadRect = table.find("thead")[0].getBoundingClientRect();
				var theadHeight = theadRect.bottom - theadRect.top;
//				console.log(theadHeight);
				clone.css("margin-bottom", "-" + sum.tbodyHeight + "px");
				table.css("margin-top", "-" + theadHeight + "px");
				// What the hack? use empty will break two-way binding in IE8
//				headContainer.empty().append(clone);
				headContainer[0].innerHTML = "";
				headContainer.append(clone);

				// Hide scrollbar at the bottom
				tableFixedTable.css("height", sum.tbodyHeight + "px");

//				console.log("redraw done");
			}

			var process = null;
			function render(){
				if (process) {
					process.cancel();
				}
				process = prepare(element).then(redraw);
//				console.log("render");
			}

			if (attrs.name) {
				setter = $parse(attrs.name).assign;
				setter(scope, {
					render: render
				});
			}

			render();
		}
	};
}).factory("affix", function($window){
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
}).factory("loader", function(modal){
	var m = null;
	return {
		start: function(){
			if (m) {
				this.stop();
			}
			m = modal.open({
				template: "Loading...",
				escToggle: false,
				backdropToggle: false
			});
		},
		stop: function(){
			if (!m) {
				return;
			}
			m.close();
			m = null;
		}
	};
}).factory("autonav", function(){
	var targetElement, navElement, idPrefix = "nav";

	function getParent(index, spec) {
		var i;
		for (i = spec - 1; i >= 0; i--) {
			if (index[i]) {
				return index[i];
			}
		}
	}

	function cleanIndex(index, spec) {
		var i;
		for (i = +spec; i <= 6; i++) {
			index[i] = null;
		}
	}

	function buildNavTree(nodes) {
		var i, ul, li;
		ul = angular.element("<ul class='nav-tree'></ul>");
		for (i = 0; i < nodes.length; i++) {
			li = angular.element("<li><a href='#" + idPrefix + nodes[i].id + "'>" + nodes[i].title + "</a></li>");
			if (nodes[i].children.length) {
				li.append(buildNavTree(nodes[i].children));
			}
			ul.append(li);
		}
		ul.addClass("ani-collapse ng-hide");
		return ul;
	}

	function init(){
		if (!targetElement || !navElement) {
			return;
		}
		var hs, hIndex, i, spec, parent, node, navtree;
		hs = targetElement[0].querySelectorAll("h1, h2, h3, h4, h5, h6");

		// Build hs tree
		hIndex = {
			0: {
				children: []
			}
		};
		for (i = 0; i < hs.length; i++) {
			spec = hs[i].nodeName.substr(1);
			parent = getParent(hIndex, spec);
			cleanIndex(hIndex, spec);
			node = {
				id: (parent.id ? (parent.id + ".") : "") + (parent.children.length + 1),
				title: hs[i].textContent || hs[i].innerText,
				element: hs[i],
				spec: spec,
				children: []
			};
			parent.children.push(node);
			hIndex[spec] = node;
			hs[i].id = idPrefix + node.id;
		}

		// Build nav tree
		navtree = buildNavTree(hIndex[0].children);
		navtree.removeClass("ng-hide");
		navElement.append(navtree);
	}

	return {
		setTarget: function(element){
			targetElement = element;
			init();
		},
		setNav: function(element){
			navElement = element;
			init();
		}
	};
}).directive("autonavTarget", function(autonav){
	return {
		restrict: "A",
		link: function(scope, element){
			autonav.setTarget(element);
		}
	};
}).directive("autonavNav", function(autonav){
	return {
		restrict: "A",
		link: function(scope, element) {
			autonav.setNav(element);
		}
	};
}).factory("scrollsync", function(){

	function registEvent(nodes, node) {
		var timeout = null;
		function calc(){
			if (node.triggered) {
				node.triggered = false;
				return;
			}
			var percentage = node.element[0].scrollLeft / (node.element[0].scrollWidth - node.element[0].clientWidth), i;

			for (i = 0; i < nodes.length; i++) {
				if (nodes[i] != node) {
					nodes[i].triggered = true;
					nodes[i].element[0].scrollLeft = percentage * (nodes[i].element[0].scrollWidth - nodes[i].element[0].clientWidth);
				}
			}
		}
		function scrollEnd(){
			calc();
		}
		node.element.on("scroll", function (){
			calc();
			clearTimeout(timeout);
			timeout = setTimeout(scrollEnd, 10);
		});
	}

	return {
		create: function(){
			var i, nodes;
			if (arguments.length > 1) {
				nodes = [];
				for (i = 0; i < arguments.length; i++) {
					nodes.push({
						element: arguments[i],
						triggered: false
					});
				}
			} else {
				for (i = 0; i < arguments[0].length; i++) {
					nodes.push({
						element: arguments[0][i],
						triggered: false
					});
				}
			}

			for (i = 0; i < nodes.length; i++) {
				registEvent(nodes, nodes[i]);
			}
		}
	};
}).factory("debug", function($log){
	var timers = {};
	return {
		start: function(id){
			id = id || "default";
			timers[id] = [new Date()];
			$log.log(id + " timer started");
		},
		elapse: function(id){
			id = id || "default";
			timers[id].push(new Date());
			var len = timers[id].length;
			$log.log(id + " elapsed: " + (timers[id][len - 1] - timers[id][len - 2]));

		},
		sum: function(id){
			id = id || "default";
			timers[id].push(new Date());
			var len = timers[id].length;
			$log.log(id + " elapsed: " + (timers[id][len - 1] - timers[id][len - 2]));
			$log.log(id + " sum: " + (timers[id][len - 1] - timers[id][0]));
		},
		log: function(){
			$log.log.apply($log, arguments);
		}
	};
}).directive("noscroll", function(prepare){
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
}).directive("autowrap", function(prepare){
	return {
		restrict: "C",
		link: function(scope, element) {
			prepare(element).then(function(){
//				console.log("wrap");
				var scrollWidth = element[0].scrollWidth,
					offsetWidth = element[0].offsetWidth;

				if (offsetWidth < scrollWidth) {
					element.addClass("wrap");
				}
			});
		}
	};
}).factory("prepare", function($q, $timeout){
	var prepare, thread;

	thread = {
		que: [],
		running: false,
		start: function(){
			if (thread.running) {
				return;
			}
			thread.running = true;
			$timeout(thread.process);
		},
		process: function(){
			var swap = [], done = [], rejected = [], q, i;
			for (i = 0; i < thread.que.length; i++) {
				q = thread.que[i];
				if (q.canceled) {
					rejected.push(q);
				} else if (!prepare.test(q.element)) {
					swap.push(q);
				} else {
					done.push(q);
				}
			}
			thread.que = swap;

			for (i = 0; i < done.length; i++) {
				done[i].deferred.resolve();
			}
			for (i = 0; i < rejected.length; i++) {
				rejected[i].deferred.reject();
			}

			if (thread.que.length) {
				$timeout(thread.process, 300);
			} else {
				thread.running = false;
			}
		}
	};

	prepare = function(element) {
		var q = {
			element: element,
			deferred: $q.defer()
		};
		thread.que.push(q);
		thread.start();
		return {
			then: function(callback){
				q.deferred.promise.then(callback);
			},
			cancel: function(){
				q.canceled = true;
			}
		};
	};

	prepare.test = function(element) {
		return element[0].offsetParent && (element[0].offsetWidth || element[0].offsetHeight);
	};

	return prepare;

}).directive("fillViewHeight", function(){
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
}).factory("watch", function(){
	return function(exp, callback) {
		var hold = null;

		var check = function() {
			var newHold = exp(), digest;
			if (newHold != hold) {
				hold = newHold;
				digest = callback(hold);
			}
			if (digest !== false) {
				setTimeout(check);
			}
		};
		setTimeout(check);
	};
}).directive("modelUpdate", function(){

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
				}
			});
		}
	};
}).directive("number", function(){

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

})();
angular.module('end2end').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/dialog.html',
    "<div class=\"dialog\" ng-class=\"'dialog-' + dialog.brand + ' ' + (dialog.size ? 'dialog-' + dialog.size : '')\"><div class=\"dialog-head\">{{dialog.title}}</div><form class=\"dialog-body\" name=\"form\" ng-submit=\"\"><div class=\"marger pre-wrap\" ng-if=\"!!dialog.msg && !dialog.templateLoaded\">{{dialog.msg}}</div><div ng-if=\"!!dialog.templateUrl\" e2e-dialog></div><div class=\"marger\"><div class=\"row row-inline row-center\"><div class=\"col\" ng-repeat=\"btn in dialog.btns\"><button type=\"{{btn.submit?'submit':'button'}}\" class=\"btn btn-default\" ng-disabled=\"btn.submit && form.$invalid\" ng-click=\"dialog.submit(btn.value)\" autofocus>{{btn.label}}</button></div></div></div></form></div>"
  );


  $templateCache.put('templates/dialogStack.html',
    "<div class=\"modal-backdrop\"></div><div class=\"modal\" ng-repeat=\"dialog in dialogs\" id=\"dialog-{{dialog.id}}\"><div class=\"modal-wrapper\"><div class=\"modal-content\"><div class=\"dialog\"><div class=\"dialog-head\">{{dialog.title || dialog.type}}</div><div class=\"dialog-body\"><div class=\"marger\">{{dialog.msg}}</div><div class=\"marger\"><button class=\"btn-default\" ng-click=\"ok(dialog)\">確認</button> <button class=\"btn-default\" ng-if=\"dialog.type == 'confirm'\" ng-click=\"cancel(dialog)\">取消</button></div></div></div></div></div></div>"
  );


  $templateCache.put('templates/eznavTree.html',
    "<ul class=\"nav-tree\" eznav-tree=\"nodes\"><li ng-repeat=\"node in nodes\" eznav-leaf=\"node\"></li></ul>"
  );


  $templateCache.put('templates/modalStack.html',
    "<div class=\"modal-backdrop active\" ng-if=\"modals.length\" ng-style=\"{'z-index':1399+(modals.length-1)*10}\"></div><div class=\"modal active\" ng-repeat=\"modal in modals\" e2e-modal=\"modal\" tabindex=\"0\" ng-style=\"{'z-index':1400+$index*10}\"></div>"
  );


  $templateCache.put('templates/tableFixed.html',
    "<div class=\"table-fixed-wrapper\"><div class=\"affix-wrapper\"><div class=\"clipper\"><div class=\"table-fixed-head\"><div class=\"table-responsive\"></div></div></div></div><div class=\"clipper\"><div class=\"table-fixed-table\"><div class=\"table-responsive\" ng-transclude></div></div></div></div>"
  );

}]);
