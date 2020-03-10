var parent = document.getElementById('content');
var canvas = document.createElement('canvas');

canvas.style.width = '100%';
canvas.height = canvas.width;

canvas.style.border = "1px solid";

parent.appendChild(canvas);

function norm(a, b) {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

class ball {
    constructor() {
        this.x = canvas.width / 2;
        this.y = -1;
        this.r = 2;
        this.dx = 0.01 * (Math.random() - 0.5);
        this.dy = 0;
        this.ax = 0;
        this.ay = 0;
        this.power = 1;

        this.maxy = canvas.height + 100;
    }

    make(x,y,r,p) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.power = p;
    }

    hit(b) {
        let dist = norm(b.x - this.x, b.y - this.y);
        if (dist < (this.r + b.r)) {
            let dx = (this.x - b.x) / dist;
            let dy = (this.y - b.y) / dist;
            let factor = b.power * 0.1 * (this.r + b.r - dist); 
            
            this.ax += factor * dx;
            this.ay += factor * dy;            
        }
    }
}

balls = [];
hitters = [];
let partitions = 12;
let flow = true;
let canflow = true;

let freq = new Array(partitions+1);
for (let i = 0; i < freq.length; i++) freq[i] = 0;

init();

canvas.onclick=toggle;
function toggle() {
    if (canflow) flow = !flow;
}

// initialise the grid of obstacles
function init() {
    let side = 25;
    for (let i = 0; i < 6; i++) {
        let x = canvas.width/2;
        if (i%2==1) x += side/2;
        while (x > 0) x -= side;
        while (x < canvas.width + side) {
            let b = new ball();
            b.make(x, side * (i+1) * Math.sqrt(3) / 2, 7, 30);
            hitters.push(b);
            x += side;
        }

    }
    paint();
    go();
}

async function go() {
    while (true) {
        if (flow) {
            balls.push(new ball());
        }

        // do forces
        for (let i = 0; i < balls.length; i++) {
            balls[i].ay += 1;
            if (balls[i].maxy < canvas.height) continue;
            for (let j = 0; j < hitters.length; j++) {
                balls[i].hit(hitters[j]);
            }
        }

        // act forces
        for (let i = 0; i < balls.length; i++) {
            // friction
            balls[i].dx *= 0.8;
            balls[i].dy *= 0.9;
            
            // act forces
            balls[i].dx += 0.8 * balls[i].ax;
            balls[i].dy += 0.8 * balls[i].ay;
            balls[i].x += balls[i].dx;
            balls[i].y += balls[i].dy;

            // forces stop
            balls[i].ax = 0;
            balls[i].ay = 0;

            // check out of bounds
            if (balls[i].y + balls[i].r > balls[i].maxy) {
                balls[i].y = balls[i].maxy-balls[i].r;
                balls[i].dy *= -1;
            }

            // add low walls
            if (balls[i].y / canvas.height > 0.46) {
                let index = Math.round(balls[i].x / (canvas.width / partitions));
                balls[i].x = index * canvas.width / partitions;
                balls[i].dx = 0;

                if (balls[i].maxy > canvas.height) {
                    freq[index]++;
                    balls[i].maxy = canvas.height - 0.5*freq[index];

                    if (balls[i].maxy < canvas.height * 0.53) {
                        canflow = false;
                        flow = false;
                    }
                }
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
        draw(balls[i], "#FF8C61");
    }
    for (let i = 0; i < hitters.length; i++) {
        draw(hitters[i], "#EEEEEE");
    }
}

function draw(ball, style) {
    let ctx = canvas.getContext("2d");
    ctx.lineWidth = 0;
    ctx.strokeStyle = style;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
    ctx.stroke();
}

async function sleep(ms) {
    await new Promise(r => setTimeout(r, ms));
}