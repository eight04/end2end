
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

angular.module("end2end", ["ngAnimate"])
	.directive("navbar", function(collapse){
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
	})
	.directive("navbarToggle", function(){
		return {
			restrict: "C",
			require: "^navbar",
			link: function(scope, element, attrs, nbCtrl) {
				element.on("click", function(){
					nbCtrl.toggle();
				});
			}
		};
	})
	.directive("navbarCollapse", function(){
		return {
			restrict: "C",
			require: "^navbar",
			scope: {},
			link: function(scope, element, attrs, nbCtrl) {
				nbCtrl.addCollapse(element);
			}
		};
	})
	.factory("collapse", function($animate){
		return {
			show: function(element){
				$animate.removeClass(element, "collapse");
			},
			hide: function(element){
				$animate.addClass(element, "collapse");
			}
		};
	})
	.directive("collapse", function(collapse){
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
	})
	.animation(".collapse", function($timeout){
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
	})
	.animation(".ani-collapse", function($timeout){
		return {
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
				void(element[0].offsetHeight);
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
			}
		};
	})
	.directive("checkPass", function(){
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
	})
	.directive("sidebar", function(){
		var sidebarJar = [];
		
		function moveSidebar(){
			var i, sidebar, state;
			var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
			// console.log(sidebarJar);
			for(i = 0; i < sidebarJar.length; i++) {
				sidebar = sidebarJar[i];
				
				if (sidebar.top >= scrollY - sidebar.elementContent[0].scrollTop) {
					// top
					state = "sidebar-top";
				} else if (scrollY - sidebar.elementContent[0].scrollTop + sidebar.height >= sidebar.rowBottom) {
					// bottom
					state = "sidebar-bottom";
				} else {
					// fixed
					state = "sidebar-fixed";
				}
				
				if (sidebar.state == state) {
					return;
				}
				
				sidebar.element.removeClass("sidebar-top sidebar-bottom sidebar-fixed");
				sidebar.element.addClass(state);
				sidebar.state = state;
			}
		}
		
		function calc(sidebar){
			var rect = sidebar.element[0].getBoundingClientRect();
			var row = sidebar.element;
			while(!row.hasClass("row")) {
				row = row.parent();
			}
			var rowRect = row[0].getBoundingClientRect();
			var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
			
			sidebar.top = rect.top + scrollY;
			sidebar.width = rect.right - rect.left;
			sidebar.rowBottom = rowRect.bottom + scrollY;
			sidebar.elementContent.css("width", sidebar.width + "px");
			sidebar.height = sidebar.elementContent[0].scrollHeight;
			// console.log(sidebar);
		}
		
		function calcSidebar(){
			var i;
			for (i = 0; i < sidebarJar.length; i++) {
				calc(sidebarJar[i]);
			}
			moveSidebar();
		}
		
		var w = angular.element(window);
		w.on("scroll", moveSidebar);
		w.on("resize", calcSidebar);
		
		return {
			restrict: "C",
			controller: function($element, $animate, $timeout){
				var controller = this;
				
				controller.toggle = function(){
					if (!$element.hasClass("expand")) {
						$animate.addClass($element, "expand");
						$element.on("click", controller.toggle);
					} else {
						$animate.removeClass($element, "expand");
						$element.off("click", controller.toggle);
					}
				};
				
				// Affix
				var sidebar = {
					element: $element,
					elementContent: angular.element($element[0].querySelector(".sidebar-content"))
				};
				
				// IE8 issue with respond?
				$timeout(function(){
					calc(sidebar);
				});
				sidebarJar.push(sidebar);
			}
		};
	})
	.directive("sidebarToggle", function(){
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
	})
	.factory("eznav", function(){
		return {};
	})
	.directive("eznav", function(eznav){
		return {
			restrict: "C",
			scope: {},
			template: "<ul class='nav-tree' eznav-tree='eznav.data'></ul>",
			link: function(scope){
				scope.eznav = eznav;
			}
		};
	})
	.directive("eznavTarget", function(eznav, $window){
		var doc = $window.document,
			trackScroll = {
				direction: 0,
				lastScrollTop: 0,
				currentScrollTop: 0,
				track: function(){
					this.lastScrollTop = this.currentScrollTop;
					this.currentScrollTop = doc.documentElement.scrollTop || doc.body.scrollTop;
					if (this.currentScrollTop > this.lastScrollTop) {
						this.direction = 1;
					} else if (this.currentScrollTop < this.lastScrollTop) {
						this.direction = -1;
					} else {
						this.direction = 0;
					}
				}
			};
		
		// function inView(nav) {
			// var rect = nav.element[0].getBoundingClientRect();
			// if (trackScroll.direction >= 0 && rect.top >= $window.innerHeight / 2 && rect.bottom <= $window.innerHeight) {
				// return true;
			// }
			// if (trackScroll.direction < 0 && rect.top > 0 && rect.bottom <= $window.innerHeight / 2) {
				// return true;
			// }
			// return false;
		// }
		
		angular.element($window).on("scroll", function(){
			var i, node, clone;
			
			trackScroll.track();
			
			for (i = 0; i < eznav.navs.length; i++) {
				eznav.navs[i].rect = eznav.navs[i].element[0].getBoundingClientRect();
			}
			
			for (i = 0; i < eznav.navs.length; i++) {
				if (eznav.navs[i].rect.top <= $window.innerHeight / 2 && eznav.navs[i + 1].rect.top > $window.innerHeight / 2) {
					clone = eznav.navs[i];
					break;
				}
			}
			
			if (!clone) {
				return;
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
			
			while (clone.parent) {
				clone.active = true;
				clone.leafElement.addClass("active");
				clone = clone.parent;
			}
			eznav.currentView = eznav.navs[i];
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
			}
		};
	})
	.directive("eznavTree", function(){
		return {
			restrict: "A",
			template: "<li ng-repeat='node in nodes' eznav-leaf='node'></li>",
			scope: {
				nodes: "=eznavTree"
			}
		};
	})
	.directive("eznavLeaf", function($compile){
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
	});

})();
