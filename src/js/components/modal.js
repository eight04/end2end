angular.module("end2end").directive("modalStack", function(){
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
}).directive("e2eModal", function($compile, $http, $templateCache){
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

			setTimeout(function(){
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

	setTimeout(function(){
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
});
