
(function(){

"use strict";

function getAniTimeout(element){
	var time, s, ms;
	if (!window.getComputedStyle) {
		return 0;
	}
	time = window.getComputedStyle(element[0] || element).getPropertyValue("transition-duration");
	if (!time) {
		return 0;
	}
	s = time.match(/^([\d.]+)s$/);
	ms = (s && s[1] * 1000) || time.match(/^(\d+)ms$/)[1] * 1;
	return ms;
}

angular.module(
	"end2end", []
).directive("navbar", function(collapse){
		return {
			restrict: "C",
			controller: function() {
				var menus = [];

				this.addCollapse = function(ele){
					menus.push(ele);
				};

				this.toggle = function(){
					var i;

					for (i = 0; i < menus.length; i++) {
						if (menus[i].hasClass("collapse")) {
							collapse.show(menus[i]);
						} else {
							collapse.hide(menus[i]);
						}
					}
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
			nbCtrl.addCollapse(element);
		}
	};
}).factory("collapse", function($animate){
	return {
		show: function(element){
			$animate.removeClass(element, "collapse");
		},
		hide: function(element){
			$animate.addClass(element, "collapse");
		}
	};
}).directive("collapse", function(collapse){
	return {
		restrict: "A",
		link: function(scope, element, attrs){
			scope.$watch(attrs.collapse, function(value){
				if (value) {
					collapse.hide(element);
				} else {
					collapse.show(element);
				}
			});
		}
	};
}).animation(".collapse", function($timeout){
	return {
		beforeAddClass: function(element, cls, done) {
			if (!element.hasClass("collapsing")) {
				element.css("display", "block");
				element.css("height", element[0].scrollHeight + "px");
				element.addClass("collapsing");
			}
			done();
		},
		addClass: function(element, cls, done){
			void(element[0].offsetHeight);
			// Why I have to trigger reflow manually? I thought angular will
			// wait 10ms before addClass().

			element.css("height", "0");
			var promise = $timeout(function(){
				element.css("display", "");
				element.css("height", "");
				element.css("overflow", "");
				element.removeClass("collapsing");
				done();
			}, getAniTimeout(element));

			return function(canceled){
				if (canceled) {
					$timeout.cancel(promise);
					element.css("height", element[0].offsetHeight + "px");
				}
			};
		},
		beforeRemoveClass: function(element, cls, done){
			if (!element.hasClass("collapsing")) {
				element.css("display", "block");
				element.css("height", "0");
				element.addClass("collapsing");
			}
			done();
		},
		removeClass: function(element, cls, done){
			// console.log();
			element.css("height", element[0].scrollHeight + "px");
			var promise = $timeout(function(){
				element.css("display", "");
				element.css("height", "");
				element.css("overflow", "");
				element.removeClass("collapsing");
				done();
			}, getAniTimeout(element));

			return function(canceled){
				if (canceled) {
					$timeout.cancel(promise);
					element.css("height", element[0].offsetHeight + "px");
				}
			};
		}
	};
}).animation(".ani-collapse", function($timeout){
	return {
		beforeAddClass: function(element, cls, done) {
			if (!element.hasClass("collapsing")) {
				element.css("display", "block");
				element.css("height", element[0].scrollHeight + "px");
				element.addClass("collapsing");
			}
			done();
		},
		addClass: function(element, cls, done){
			void(element[0].offsetHeight);
			// Why I have to trigger reflow manually? I thought angular will
			// wait 10ms before addClass().

			element.css("height", "0");
			var promise = $timeout(function(){
				element.css("display", "");
				element.css("height", "");
				element.css("overflow", "");
				element.removeClass("collapsing");
				done();
			}, getAniTimeout(element));

			return function(canceled){
				if (canceled) {
					$timeout.cancel(promise);
					element.css("height", element[0].offsetHeight + "px");
				}
			};
		},
		beforeRemoveClass: function(element, cls, done){
			if (!element.hasClass("collapsing")) {
				element.css("display", "block");
				element.css("height", "0");
				element.addClass("collapsing");
			}
			done();
		},
		removeClass: function(element, cls, done){
			// console.log();
			element.css("height", element[0].scrollHeight + "px");
			var promise = $timeout(function(){
				element.css("display", "");
				element.css("height", "");
				element.css("overflow", "");
				element.removeClass("collapsing");
				done();
			}, getAniTimeout(element));

			return function(canceled){
				if (canceled) {
					$timeout.cancel(promise);
					element.css("height", element[0].offsetHeight + "px");
				}
			};
		},
		enter: function(element, done){
			if (!element.hasClass("collapsing")) {
				element.css("display", "block");
				element.css("height", "0");
				element.css("box-sizing", "border-box");
				element.addClass("collapsing");
			}
			void(element[0].offsetHeight);
			element.css("height", element[0].scrollHeight + "px");
			var promise = $timeout(function(){
				element.css("display", "");
				element.css("height", "");
				element.css("overflow", "");
				element.removeClass("collapsing");
				done();
			}, getAniTimeout(element));

			return function(canceled){
				if (canceled) {
					$timeout.cancel(promise);
					console.log(element[0].offsetHeight);
					element.css("height", element[0].offsetHeight + "px");
				}
			};
		},
		leave: function(element, done){
			if (!element.hasClass("collapsing")) {
				element.css("display", "block");
				element.css("height", element[0].scrollHeight + "px");
				element.addClass("collapsing");
			}
			function active(){
				console.log(element[0].className);
				if (!element.hasClass("ng-leave-active") && element.hasClass("ng-leave")) {
					$timeout(active);
					return;
				}
				element.css("height", "0");
			}
			$timeout(active);

			var promise = $timeout(function(){
				element.css("display", "");
//				element.css("height", "");
				element.css("overflow", "");
				element.removeClass("collapsing");
				done();
			}, getAniTimeout(element));

			return function(canceled){
				if (canceled) {
					$timeout.cancel(promise);
					element.css("height", element[0].offsetHeight + "px");
				}
			};
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
}).factory("eznav", function(){
	return {};
}).directive("eznav", function(eznav){
	return {
		restrict: "C",
		scope: {},
		template: "<ul class='nav-tree' eznav-tree='eznav.data'></ul>",
		link: function(scope){
			scope.eznav = eznav;
		}
	};
}).directive("eznavTarget", function(eznav, $window){
	angular.element($window).on("scroll", function(){
		var i, node, clone;

		for (i = 0; i < eznav.navs.length; i++) {
			eznav.navs[i].rect = eznav.navs[i].element[0].getBoundingClientRect();
		}

		for (i = 0; i < eznav.navs.length - 1; i++) {
			if (eznav.navs[i].rect.top <= 32 && eznav.navs[i + 1].rect.top > 32) {
				clone = eznav.navs[i];
				break;
			}
		}

		if (!clone && eznav.navs[i].rect.top <= 32 && eznav.element[0].getBoundingClientRect().bottom > 32) {
			clone = eznav.navs[i];
		}

		if (eznav.currentView) {
			node = eznav.currentView;
			while(node.parent) {
				node.active = false;
				node.leafElement.removeClass("active");
				node = node.parent;
			}
			eznav.currentView = null;
		}

		if (clone) {
			while (clone.parent) {
				clone.active = true;
				clone.leafElement.addClass("active");
				clone = clone.parent;
			}
			eznav.currentView = eznav.navs[i];
		}
	});

	return {
		restrict: "C",
		link: function(scope, element){
			var navs = element[0].querySelectorAll("h1, h2, h3, h4, h5, h6"),
				i, root = {
					prior: 0,
					parent: null,
					children: []
				}, last = root, navList = [], name, node;

			for (i = 0; i < navs.length; i++) {
				name = navs[i].textContent || navs[i].innerText;
				if (!navs[i].id) {
					navs[i].id = name.replace(/\s+/g, "-");
				}
				node = {
					parent: null,
					prior: navs[i].nodeName.substr(1) * 1,
					name: name,
					url: "#" + navs[i].id,
					children: [],
					element: angular.element(navs[i])
				};

				navList.push(node);

				while (last.prior >= node.prior) {
					last = last.parent;
				}
				node.parent = last;
				last.children.push(node);
				last = node;
			}

			eznav.data = root.children;
			eznav.navs = navList;
			eznav.element = element;
		}
	};
}).directive("eznavTree", function(){
	return {
		restrict: "A",
		template: "<li ng-repeat='node in nodes' eznav-leaf='node'></li>",
		scope: {
			nodes: "=eznavTree"
		}
	};
}).directive("eznavLeaf", function($compile){
	var treeTemplate = angular.element("<ul class='nav-tree' eznav-tree='node.children'></ul>");
	return {
		restrict: "A",
		template: "<a href='{{node.url}}'>{{node.name}}</a>",
		scope: {
			node: "=eznavLeaf"
		},
		link: function(scope, element){
			scope.node.leafElement = element;
			if (scope.node.children && scope.node.children.length) {
				$compile(treeTemplate)(scope, function(cloned){
					element.append(cloned);
				});
			}
		}
	};
//}).directive("tabGroup", function(){
//		return {
//			restrict: "C",
//			templateUrl: "templates/tabGroup.html",
//			transclude: true,
//			scope: {},
//			controller: function($scope) {
//				$scope.current = null;
//				$scope.tabs = [];
//				$scope.addTab = this.addTab = function(tab) {
//					$scope.tabs.push(tab);
//					if ($scope.tabs.length == 1) {
//						$scope.active(tab);
//					}
//				};
//				$scope.active = this.active = function(tab) {
//					if ($scope.current) {
//						$scope.current.active = false;
//					}
//					tab.active = true;
//					$scope.current = tab;
//				};
//			}
//		};
//	})
//	.directive("tab", function(){
//		return {
//			restrict: "C",
//			// template: "<div class='pane' ng-class='{active: active}' ng-transclude></div>",
//			template: "<div class='pane' ng-class='{active: active}'></div>",
//			require: "^tabGroup",
//			transclude: true,
//			replace: true,
//			scope: {
//				title: "@tabHeading"
//			},
//			link: function(scope, element, attrs, controller, transclude){
//				transclude(scope.$parent, function(clone){
//					element.append(clone);
//				});
//				scope.element = element;
//				controller.addTab(scope);
//			}
//		};
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
			var ele, key, modal = scope.modal;

			if (modal.scope) {
				for (key in modal.scope) {
					scope[key] = modal.scope[key];
				}
			}

			if (modal.templateUrl) {
				$http({
					method: "GET",
					url: modal.templateUrl,
					cache: $templateCache
				}).success(function(result){
					ele = $compile(result)(scope);
					element.append(ele);
				});
			} else {
				ele = $compile(modal.template)(scope);
				element.append(ele);
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
				if (e.target != element[0]) {
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

		if (e.keyCode == 27 && !e.shiftKey) {
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

		dialog.deferred = $q.defer();

		dialog.modal = modal.open({
			templateUrl: "templates/dialog.html",
			scope: {
				dialog: dialog
			}
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
}).factory("togglerHelper", function(){
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
		}
	};
}).directive("toggled", function(toggler, togglerHelper) {
	return {
		restrict: "A",
		link: function(scope, element, attrs){
			var tg = toggler.get(attrs.toggled);
			if (!tg) {
				tg = toggler.create(attrs.toggled);
				tg.set(togglerHelper.getStatus(element));
			}
			tg.add({
				element: element
			});
		}
	};
}).directive("toggler", function(toggler, togglerHelper){

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
		restrict: "A",
		link: function(scope, element, attrs){
			var tg = toggler.get(attrs.toggler);
			if (!tg) {
				tg = toggler.create(attrs.toggler);
				tg.set(togglerHelper.getStatus(element));
			}
			tg.add({
				element: element
			});

			element.on("click", function(e){
				if (e.target.nodeName != "A") {
					return;
				}
				var ele = e.target;
				while (ele.parentNode != element[0]) {
					ele = ele.parentNode;
				}
				tg.active(getChildIndex(element, ele));
			});
		}
	};
}).factory("toggler", function($animate){
var togglerJar = {};

function createToggler(id){
	var status = [];
	var toggleJar = [];

	function updateToggle(toggle){
		var i, child = toggle.element.children(), c;

		for (i = 0; i < child.length; i++) {
			c = angular.element(child[i]);
			if (status[i]) {
				$animate.addClass(c, "active");
			} else {
				$animate.removeClass(c, "active");
			}
		}
	}

	function updateToggles(){
		var i;
		for (i = 0; i < toggleJar.length; i++) {
			updateToggle(toggleJar[i]);
		}
	}

	return {
		id: id,
		set: function(sts){
			var i;
			for (i = 0; i < sts.length; i++) {
				status[i] = sts[i];
			}
			updateToggles();
		},
		active: function(index){
			var i;
			for (i = 0; i < status.length; i++) {
				status[i] = index == i;
			}
			updateToggles();
		},
		add: function(toggle){
			toggleJar.push(toggle);
			updateToggle(toggle);
		}
	};
}

return {
	get: function(id){
		return togglerJar[id];
	},
	create: function(id){
		if (togglerJar[id]) {
			throw "Duplicate toggler id!";
		}
		var toggler = createToggler(id);
		togglerJar[id] = toggler;
			return toggler;
		}
	};
}).directive("tableFixed", function($timeout, $parse){
	return {
		restrict: "C",
		link: function(scope, element, attrs) {
			if (!attrs.fixedLeft && !attrs.fixedRight) {
				return;
			}
			var fixedLeft = +attrs.fixedLeft || 0,
				fixedRight = +attrs.fixedRight || 0,
				rendering = false;

			function calc(){
				var trs, j;
				var i, rect, td, eles, height, last,
					widths = {
						left: {
							len: [],
							sum: 0
						},
						right: {
							len: [],
							sum: 0
						}
					};
				eles = element[0].querySelectorAll(".table-fixed-cell");

				if (eles) {
					for (i = 0; i < eles.length; i++) {
						td = angular.element(eles[i]);
						td.css("width", "");
						td.css("height", "");
						td.removeClass("table-fixed-cell");
					}
				}

				trs = element.find("tr");

				for (i = 0; i < trs.length; i++) {
					angular.element(trs[i]).css("height", "");
				}

				for (i = 0; i < fixedLeft; i++) {
					td = trs[0].children[i];
					rect = td.getBoundingClientRect();
					widths.left.len.push({
						offset: widths.left.sum,
						width: rect.right - rect.left
					});
					widths.left.sum += rect.right - rect.left;
				}

				last = trs[0].children.length - 1;
				for (i = 0; i < fixedRight; i++) {
					td = trs[0].children[last - i];
					rect = td.getBoundingClientRect();
					widths.right.len.push({
						offset: widths.right.sum,
						width: rect.right - rect.left
					});
					widths.right.sum += rect.right - rect.left;
				}

				for (j = 0; j < trs.length; j++) {
					rect = trs[j].getBoundingClientRect();
					height = rect.bottom - rect.top;
					angular.element(trs[j]).css("height", height + "px");
					for (i = 0; i < fixedLeft; i++) {
						td = angular.element(trs[j].children[i]);
						td.css("width", widths.left.len[i].width + "px");
						td.css("height", height + "px");
						td.css("left", widths.left.len[i].offset + "px");
						td.addClass("table-fixed-cell table-fixed-left");
					}

					last = trs[j].children.length - 1;
					for (i = 0; i < fixedRight; i++) {
						td = angular.element(trs[j].children[last - i]);
						td.css("width", widths.right.len[i].width + "px");
						td.css("height", height + "px");
						td.css("right", widths.right.len[i].offset + "px");
						td.addClass("table-fixed-cell table-fixed-right");
					}
				}

				element.css("padding-left", widths.left.sum + "px");
				element.css("padding-right", widths.right.sum + "px");
			}

			function calcContainer (){
				if (!element[0].offsetHeight) {
					$timeout(calcContainer, 300);
					return;
				}

				rendering = false;
				calc();
			}

			if (attrs.name) {
				var setter = $parse(attrs.name).assign;
//					console.log(scope);
				setter(scope, {
					render: function(){
						if (!rendering) {
							rendering = true;
							$timeout(calcContainer);
						}
					}
				});
			}

			calcContainer();
		}
	};
}).directive("affix", function(){

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

			var currentState = null;
			var currentWidth = null;

			function affix(){
				var rect = element[0].getBoundingClientRect();
				var containerRect = containerElement[0].getBoundingClientRect();
				var contentRect = contentElement[0].getBoundingClientRect();

				var width = rect.right - rect.left;
				if (width != currentWidth) {
					contentElement.css("width", width + "px");
					currentWidth = width;
				}

				var state;
				if (rect.top >= 0) {
					state = "affix-top";
				} else if (rect.top < 0 && containerRect.bottom - (contentRect.bottom - contentRect.top) <= 0) {
					state = "affix-bottom";
				} else {
					state = "affix-fixed";
				}

				if (state != currentState) {
					if (state == "affix-bottom") {
						contentElement.css("top", containerRect.bottom - containerRect.top - (contentRect.bottom - contentRect.top) + "px");
					} else {
						contentElement.css("top", "");
					}
					element.removeClass(currentState);
					element.addClass(state);
					currentState = state;
				}

			}

			var w = angular.element(window);
			w.on("scroll", affix);
			w.on("resize", affix);
		}
	};
});

})();
angular.module('end2end').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/dialog.html',
    "<div class=\"dialog\" ng-class=\"'dialog-' + dialog.brand + ' ' + (dialog.size ? 'dialog-' + dialog.size : '')\"><div class=\"dialog-header\">{{dialog.title}}</div><form class=\"dialog-body\" name=\"form\" ng-submit=\"\"><div class=\"marger pre-wrap\" ng-if=\"!!dialog.msg && !dialog.templateLoaded\">{{dialog.msg}}</div><div ng-if=\"!!dialog.templateUrl\" e2e-dialog></div><div class=\"marger\"><div class=\"row row-inline row-center\"><div class=\"col\" ng-repeat=\"btn in dialog.btns\"><button type=\"{{btn.submit?'submit':'button'}}\" class=\"btn btn-default\" ng-disabled=\"btn.submit && form.$invalid\" ng-click=\"dialog.submit(btn.value)\" autofocus>{{btn.label}}</button></div></div></div></form></div>"
  );


  $templateCache.put('templates/dialogStack.html',
    "<div class=\"modal-backdrop\"></div><div class=\"modal\" ng-repeat=\"dialog in dialogs\" id=\"dialog-{{dialog.id}}\"><div class=\"modal-wrapper\"><div class=\"modal-content\"><div class=\"dialog\"><div class=\"dialog-header\">{{dialog.title || dialog.type}}</div><div class=\"dialog-body\"><div class=\"marger\">{{dialog.msg}}</div><div class=\"marger\"><button class=\"btn-default\" ng-click=\"ok(dialog)\">確認</button> <button class=\"btn-default\" ng-if=\"dialog.type == 'confirm'\" ng-click=\"cancel(dialog)\">取消</button></div></div></div></div></div></div>"
  );


  $templateCache.put('templates/eznavTree.html',
    "<ul class=\"nav-tree\" eznav-tree=\"nodes\"><li ng-repeat=\"node in nodes\" eznav-leaf=\"node\"></li></ul>"
  );


  $templateCache.put('templates/modalStack.html',
    "<div class=\"modal-backdrop active\" ng-if=\"modals.length\" ng-style=\"{'z-index':1399+(modals.length-1)*10}\"></div><div class=\"modal active\" ng-repeat=\"modal in modals\" e2e-modal=\"modal\" tabindex=\"0\" ng-style=\"{'z-index':1400+$index*10}\"></div>"
  );


  $templateCache.put('templates/tabGroup.html',
    "<div class=\"nav-responsive\"><ul class=\"nav-tab\"><li ng-repeat=\"tab in tabs\" ng-click=\"active(tab)\" ng-class=\"{'active': tab.active}\"><a href=\"\">{{tab.title}}</a></li></ul></div><div class=\"panes\" ng-transclude></div>"
  );

}]);
