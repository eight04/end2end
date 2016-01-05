
angular.module("end2end").factory("autonav", function(){
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
});
