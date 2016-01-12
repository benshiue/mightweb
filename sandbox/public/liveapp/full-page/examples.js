$(document).ready(function() {
	$('#fullpage').fullpage();

	//- $(document).on('touchstart scroll click', function() {
	//- 	if (screenfull.enabled) {
	//- 	    screenfull.request(document.getElementById("fullpage"));
	//- 	}
	//- });
});

$('.btn-slideshow').click(function () {
	screenfull.request($('#workspace')[0]);
	// does not require jQuery, can be used like this too:
	// screenfull.request(document.getElementById('container'));
});