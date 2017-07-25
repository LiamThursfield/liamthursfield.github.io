
/*
* When the window loads, add a keydown listener to focus on the search box
*/
window.onload = function() {
	document.addEventListener("keydown", function() {
		document.getElementsByClassName("search-box")[0].focus();
	})
}