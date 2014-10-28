
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

angular.module("bootstrap-port", ["ngAnimate"])
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
			hide: function(element, callback){
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
					if (passJar[id]){
						for (var i = 0; i < passJar[id].length; i++) {
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
				}, function(value){
					validate(id);
				});
			}
		};
	})
	.directive("sidebar", function(){
		return {
			restrict: "C",
			controller: function($element, $animate, $window){
				var controller = this;
				
				controller.toggle = function(){
					if (!$element.hasClass("expand")) {
						$animate.addClass($element, "expand");
						$element.on("click", controller.toggle);
					} else {
						$animate.removeClass($element, "expand");
						$element.off("click", controller.toggle);
					}
				}
				
				// Affix
				$element.top();
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
	});
