var parent = document.getElementById('content');
var canvas = document.createElement('canvas');

canvas.style.width = '100%';
canvas.height = canvas.width;

canvas.style.border = "1px solid";

parent.appendChild(canvas);

let pointx = [10,20,30];
let pointy = [10,20,30];
let dragged = -1;

paint();

canvas.onmousedown=mousedown;
canvas.onmousemove=move;
canvas.onmouseup=mouseup;

function norm(a, b) {
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

function mousedown(e) {
    let x = e.offsetX / canvas.offsetWidth * canvas.width;
    let y = e.offsetY / canvas.offsetHeight * canvas.height;
    for (let i = 0; i < 3; i++) {
        if (norm(pointx[i]-x, pointy[i]-y) < 5) {
            dragged = i;
        }
    }
}

function move(e) {
    if (dragged == -1) return;
    let x = e.offsetX / canvas.offsetWidth * canvas.width;
    let y = e.offsetY / canvas.offsetHeight * canvas.height;
    let ok = true;

    for (let i = 0; i < 3; i++) {
        if (i == dragged) continue;
        if (norm(pointx[i]-x, pointy[i]-y) < 11) ok = false;
    }

    if (ok) {
        pointx[dragged] = x;
        pointy[dragged] = y; 
    } 
    
    paint();  
}

function mouseup(e) {
    dragged = -1;
}

function paint() {
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // draw the circles
    for (let i = 0; i < 3; i++) {
        drawCircle(pointx[i], pointy[i], 5, "#662E9B");
    }

    // draw the lines in between the circle
    for (let i = 0; i < 3; i++) {
        drawLine(pointx[(i+1)%3], pointy[(i+1)%3], pointx[i], pointy[i], "#EA3546");
    }

    // perpendicular lines
    let linex = [0,0,0];
    let liney = [0,0,0];
    let linec = [0,0,0];
    for (let i = 0; i < 3; i++) {
        let midx = (pointx[i] + pointx[(i+1)%3])/2;
        let midy = (pointy[i] + pointy[(i+1)%3])/2;
        
        linex[i] = pointx[(i+1)%3] - pointx[i];
        liney[i] = pointy[(i+1)%3] - pointy[i];
        linec[i] = linex[i] * midx + liney[i] * midy;

        drawLine(midx + liney[i] * 100, midy - linex[i] * 100, midx - liney[i]*100, midy + linex[i]*100, "#F86624");
        drawCircle(midx, midy, 2, "#000000");
        drawCircle(midx, midy, 1, "#000000");
    }

    // center of the circle
    let ry = (linec[0]*linex[1] - linex[0]*linec[1]) / (liney[0]*linex[1] - linex[0]*liney[1]);
    let rx = (linec[0] - liney[0]*ry) / linex[0];
    drawCircle(rx, ry, norm(pointx[0]-rx, pointy[0]-ry), "#43BCCD");
    drawCircle(rx, ry, 1, "#43BCCD");
    drawCircle(rx, ry, 2, "#43BCCD");
    drawCircle(rx, ry, 3, "#43BCCD");
}

function drawCircle(x,y,r,style) {
    let ctx = canvas.getContext("2d");
    ctx.lineWidth = 0;
    ctx.strokeStyle = style;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawLine(x1,y1,x2,y2,style) {
    let ctx = canvas.getContext("2d");
    ctx.lineWidth = 1;
    ctx.strokeStyle = style;
    ctx.beginPath();       // Start a new path
    ctx.moveTo(x1, y1);    // Move the pen to (30, 50)
    ctx.lineTo(x2, y2);  // Draw a line to (150, 100)
    ctx.stroke();
}

async function sleep(ms) {
    await new Promise(r => setTimeout(r, ms));
}