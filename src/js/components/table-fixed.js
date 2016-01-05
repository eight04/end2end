
angular.module("end2end").directive("tableFixed", function($parse, affix, scrollsync, prepare){

	function calcBounds(f, trs, fixedLength, vbounds, table) {
		var bounds = [],
			rowspans = [],
			i, j, k,
			td, colspan, rowspan, end, len, rect, vend;

		// Get first cell rect
		if (f == "left") {
			bounds[0] = table[0].getBoundingClientRect().left;
		} else {
			bounds[0] = table[0].getBoundingClientRect().right;
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

		sumLeft = calcBounds("left", trs, leftLength, vbounds, table);
		sumRight = calcBounds("right", trs, rightLength, vbounds, table);

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
		link: function(scope, element, attrs, controller, transclude) {
			var fixedLeft = +attrs.fixedLeft || 0,
				fixedRight = +attrs.fixedRight || 0,
				setter, table, tableh, tableFixedHead, tableFixedTable, headContainer, bodyContainer, affixWrapper;


			tableFixedHead = angular.element(element[0].querySelector(".table-fixed-head"));
			tableFixedTable = angular.element(element[0].querySelector(".table-fixed-table"));

			headContainer = angular.element(element[0].querySelector(".table-fixed-head-inject"));
			bodyContainer = angular.element(element[0].querySelector(".table-fixed-table-inject"));

			transclude(function(cloned){
				headContainer.append(cloned);
			});

			transclude(function(cloned){
				bodyContainer.append(cloned);
			});

			tableh = tableFixedHead.find("table");
			table = tableFixedTable.find("table");

			affixWrapper = angular.element(element[0].querySelector(".affix-wrapper"));

			affix.affix(element, affixWrapper, affixWrapper.children());
			scrollsync.create(headContainer, table.parent());

			function redrawTable(table) {
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

				sum = setOffset(table, fixedLeft, fixedRight);

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
				void table[0].offsetWidth;
				table.css("display", "");
			}

			function redraw(){

				redrawTable(table);
				redrawTable(tableh);

				// Make fixed header
				var theadRect = table.find("thead")[0].getBoundingClientRect();
				var tableRect = table[0].getBoundingClientRect();
				var theadHeight = theadRect.bottom - theadRect.top;
				var tbodyHeight = tableRect.bottom - theadRect.bottom;

				tableh.css("margin-bottom", "-" + tbodyHeight + "px");
				table.css("margin-top", "-" + theadHeight + "px");
				// What the hack? use empty will break two-way binding in IE8
				//				headContainer[0].innerHTML = "";
				//				headContainer.append(clone);

				// Hide scrollbar at the bottom
				tableFixedTable.css("height", tbodyHeight + "px");

				// Stupid chrome hack again
				headContainer.css("webkitAnimationName", "stupid-chrome-hack");
				bodyContainer.css("webkitAnimationName", "stupid-chrome-hack");

				void bodyContainer[0].offsetWidth;

				headContainer.css("webkitAnimationName", "");
				bodyContainer.css("webkitAnimationName", "");
			}

			var process = null;
			function render(){
				if (process) {
					process.cancel();
				}
				process = prepare(element, -1000).then(redraw);
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
});
