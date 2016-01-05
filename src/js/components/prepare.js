
angular.module("end2end").factory("prepare", function($q, $timeout, $filter){
	var prepare, thread;

	thread = {
		que: [],
		running: false,
		start: function(){
			if (thread.running) {
				return;
			}
			thread.running = true;
			setTimeout(thread.process);
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

			done = $filter("orderBy")(done, "priority", true);

			for (i = 0; i < done.length; i++) {
				//			for (i = done.length - 1; i >= 0; i--) {
				done[i].deferred.resolve();
			}
			for (i = 0; i < rejected.length; i++) {
				rejected[i].deferred.reject();
			}

			if (thread.que.length) {
				setTimeout(thread.process, 300);
			} else {
				thread.running = false;
			}
		}
	};

	prepare = function(element, priority) {
		var q = {
			element: element,
			deferred: $q.defer(),
			priority: priority || 0
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

});
