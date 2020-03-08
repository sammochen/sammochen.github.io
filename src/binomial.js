var parent = document.getElementById('content');
var canvas = document.createElement('canvas');

canvas.style.width = '100%';
canvas.height = canvas.width;

canvas.style.border = "1px solid";

parent.appendChild(canvas);

class ball {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.dx = (Math.random() - 0.5) * 5;
        this.dy = (Math.random() - 0.5) * 5;
        this.ax = 0;
        this.ay = 0;

        this.oldx = this.x;
        this.oldy = this.y;
    }
}

balls = [];
init();
go();

function init() {
    for (let i = 0; i < 15; i++) {
        balls.push(new ball());
    }
    paint();
}

async function go() {
    let wait = 0;
    while (true) {
        if (wait == 40) {
            balls.push(new ball());
            wait = 0;
        }
        wait++;

        // do forces
        for (let i = 0; i < balls.length; i++) {
            balls[i].ay += 0.5
        }

        // act forces
        for (let i = 0; i < balls.length; i++) {
            balls[i].oldx = balls[i].x;
            balls[i].oldy = balls[i].y;

            balls[i].dx += balls[i].ax;
            balls[i].dy += balls[i].ay;
            balls[i].x += balls[i].dx;
            balls[i].y += balls[i].dy;

            // friction
            balls[i].dx *= 0.999;
            balls[i].dy *= 0.999;
            // forces stop
            balls[i].ax = 0;
            balls[i].ay = 0;

            // check out of bounds
            if (balls[i].y > canvas.height) {
                balls[i].y = canvas.height;
                balls[i].dy *= -1;
            }

            // check out of bounds
            if (balls[i].x > canvas.width) {
                balls[i].x = canvas.width;
                balls[i].dx *= -1;
            }

            // check out of bounds
            if (balls[i].x < 0) {
                balls[i].x = 1;
                balls[i].dx *= -1;
            }
        }

        paint();
        await sleep(20);
    }
}

function paint() {
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (let i = 0; i < balls.length; i++) {
        drawCircle(balls[i].x, balls[i].y);
    }
}

function drawCircle(x,y) {
    let ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#6457A6";
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, 2 * Math.PI);
    ctx.stroke();
}

async function sleep(ms) {
    await new Promise(r => setTimeout(r, ms));
}