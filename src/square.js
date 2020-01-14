var canvas = document.createElement('canvas');
var parent = document.getElementsByTagName("section")[0];

canvas.id = "CursorLayer";
canvas.width = parent.offsetWidth;
canvas.height = parent.offsetWidth;
canvas.style.zIndex = 8;
canvas.style.position = "absolute";
canvas.style.border = "1px solid";

// canvas.ondrag = drawSquare;
canvas.onmousemove = drawSquare;

parent.appendChild(canvas);

cursorLayer = document.getElementById("CursorLayer");

console.log(cursorLayer);

// below is optional

var ctx = canvas.getContext("2d");

function drawSquare(a) {
	var x = Math.random();

	if (x < 0.33) ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
	else if (x < 0.66) ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
	else ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
	
	ctx.fillRect(a.offsetX - 50, a.offsetY - 50, 100, 100);
}

