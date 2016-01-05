angular.module("end2end").factory("dialog", function(modal, $q){
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
});
