let ws;
let test = 0;
$(function() {
	setSectionHeight();
	$(window).on('resize', setSectionHeight);

	$("section div").css("opacity", 0);
	$("#init").css("opacity", 1);

	let host = window.document.location.host.replace(/:.*/, '');
	console.log(host);

	ws = new WebSocket('ws://' + host + ':8000');

	ws.onmessage = function(event) {
		let data = JSON.parse(event.data)
		console.log(data);
		setDisplay(data);
	}
});

function setSectionHeight() {
	let height = $(window).height();
	$("section").css("height", height + "px");
}

function send() {
    ws.send(test);
    if (test == 0){
    	test = 2;
    } else if (test == 5) {
    	test = 1;
    } else {
   		test++;
    }
}

function setDisplay(id) {
	let idData = id - 0;
	console.log(idData);
	$("section div").removeClass().css("opacity", 0);
	switch(idData) {
		case 0:
			$("#init").addClass('fadeoutAction');
			$("#pic1").addClass('fadeinAction');
			break;
		case 1:
			$("#pic5").addClass('fadeoutAction');
			$("#pic1").addClass('fadeinAction');
			break;
		case 2:
			$("#pic1").addClass('fadeoutAction');
			$("#pic2").addClass('fadeinAction');
			break;
		case 3:
			$("#pic2").addClass('fadeoutAction');
			$("#pic3").addClass('fadeinAction');
			break;
		case 4:
			$("#pic3").addClass('fadeoutAction');
			$("#pic4").addClass('fadeinAction');
			break;
		case 5:
			$("#pic4").addClass('fadeoutAction');
			$("#pic5").addClass('fadeinAction');
			break;
		default:
			console.log("default");
			break;
	}
}
        