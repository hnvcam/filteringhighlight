/**
 * Filtering HighLight jQuery plugin 1.0
 * 
 * Copyright (c) 2014, AIWSolutions
 * License: GPL2
 * Project Website: http://wiki.aiwsolutions.net/jquery-plugins/
 **/

jQuery.fn.filteringHighlight = function(rootElement, highlightClass, timeout) {
	var root = jQuery(rootElement)[0];
	var input = this;
	var keyTimeout;
	var lastFilter = '';
	
	if (timeout === undefined) {
		timeout = 200;
	}
	
	function highlight(node, filterValue) {
		if (node.nodeType == 3) {
			var pos = node.data.toLowerCase().indexOf(filterValue);
			if (pos >= 0) {
				var parentNode = node.parentNode;
				if (parentNode.className !== highlightClass) {
					var replacedNode = node.splitText(pos);
					var trailingNode = replacedNode.splitText(filterValue.length);
					var highlightedNode = document.createElement('span');
					highlightedNode.innerHTML = replacedNode.data;
					highlightedNode.className = highlightClass;
				
					parentNode.replaceChild(highlightedNode, replacedNode);
				}
			}
		} else if (node.nodeType == 1 && node.childNodes &&
			!/(script|style)/i.test(node.tagName)) {
			for (var i = 0; i < node.childNodes.length; i++) {
				highlight(node.childNodes[i], filterValue);
			}			
		}
	}
	
	function clearHighlight() {
		$(rootElement).find("span." + highlightClass).each(function() {
			var newChild = this.firstChild;
			this.parentNode.replaceChild(this.firstChild, this);
			newChild.parentNode.normalize();
		});
	}
		
	input.change(function() {
		var filter = input.val().toLowerCase();
		
		clearHighlight();
		
		//var startTime = new Date().getTime();
		if (filter.length > 0) {
			highlight(root, filter);
		}
		//var endTime = new Date().getTime();
		//console.log('Highlight for ' + filter + ' took: ' + (endTime - startTime) + 'ms');
		return false;
	}).keydown(function() {
		clearTimeout(keyTimeout);
		keyTimeout = setTimeout(function() {
			if( input.val() === lastFilter ) return;
			lastFilter = input.val();
			input.change();
		}, timeout);
	});
	return this;
}

