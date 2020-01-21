var canvas = document.createElement('canvas');
var parent = document.getElementById('content');

console.log(canvas);
console.log(parent);

canvas.width = 500;
canvas.height = 500;
canvas.style.border = "1px solid";

// canvas.ondrag = drawSquare;
canvas.onmousemove = drawSquare;

parent.appendChild(canvas);

// below is optional

var ctx = canvas.getContext("2d");

function drawSquare(a) {
	var x = Math.random();

	if (x < 0.33) ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
	else if (x < 0.66) ctx.fillStyle = "rgba(0, 255, 0, 0.1)";
	else ctx.fillStyle = "rgba(0, 0, 255, 0.1)";
	
	ctx.fillRect(a.offsetX - 50, a.offsetY - 50, 100, 100);
}


