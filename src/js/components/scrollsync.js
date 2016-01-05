
angular.module("end2end").factory("scrollsync", function(){

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
});
