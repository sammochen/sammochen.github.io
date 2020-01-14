below should be a square!

<script>
var canvas = document.createElement('canvas');
var parent = document.getElementsByTagName("section")[0];

canvas.id = "CursorLayer";
canvas.width = parent.width;
canvas.height = parent.width;
canvas.style.zIndex = 8;
canvas.style.position = "absolute";
canvas.style.border = "1px solid";


var section = document.getElementsByTagName("section")[0];
section.appendChild(canvas);

cursorLayer = document.getElementById("CursorLayer");

console.log(cursorLayer);

// below is optional

var ctx = canvas.getContext("2d");
ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
ctx.fillRect(100, 100, 200, 200);
ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
ctx.fillRect(150, 150, 200, 200);
ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
ctx.fillRect(200, 50, 200, 200);
</script>

the square should be above me
