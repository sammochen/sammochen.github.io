var parent = document.getElementById('content');
var canvas = document.createElement('canvas');

canvas.style.width = '100%';
canvas.style.border = "1px solid";

canvas.height = canvas.width;

parent.appendChild(canvas);

let grid; // holds numbers
let rowId; // holds real row number
let colId; // holds real col number

let map = new Map();
map.set(0, "#FFFFFF");
map.set(2, "#ADD2C2");
map.set(4, "#A7D3A6");
map.set(8, "#CFE795");
map.set(16, "#F7EF81");
map.set(32, "#D4C685");
map.set(64, "#FF7FAC");
map.set(128, "#EF64AE");
map.set(256, "#914873");
map.set(512, "#595959");
map.set(1024, "#CACFD6")
map.set(2048, "#9FD8CB");

start();
document.onkeydown = handle;


function start() {
    grid = new Array(4);
    rowId = new Array(4);
    colId = new Array(4);
    for (let i = 0; i < 4; i++) {
        grid[i] = new Array(4);
        rowId[i] = new Array(4);
        colId[i] = new Array(4);
        for (let j = 0; j < 4; j++) {
            grid[i][j] = 0;
            rowId[i][j] = i;
            colId[i][j] = j;
        }
    }
    generateSquare();
}

function handle(e) {
    if (moving != 0) return;
    let changed = false;
    
    if (e.keyCode == 37) { // left
        if (moveLeft()) changed = true;
    } else if (e.keyCode == 38) { // up
        rotateAll(1);
        if (moveLeft()) changed = true;
        rotateAll(3);
    } else if (e.keyCode == 39) { // right
        rotateAll(2);
        if (moveLeft()) changed = true;
        rotateAll(2);
    } else if (e.keyCode == 40) {
        rotateAll(3);
        if (moveLeft()) changed = true;
        rotateAll(1);
    }
    if (!changed) throw "Not moved!";
}

function rotateAll(times) {
    for (let i = 0; i < times; i++) {
        rotate(grid);
        rotate(rowId);
        rotate(colId);
    }
}

function rotate(g) {
    let copy = new Array(4);
    for (let i = 0; i < 4; i++) {
        copy[i] = new Array(4);
        for (let j = 0; j < 4; j++) {
            copy[i][j] = g[i][j];
        }
    }
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            g[i][j] = copy[j][3-i];
        }
    }
}

// moves it towards the front
function moveLeft() {
    let changed = false;
    for (let row = 0; row < 4; row++) {
        let left = [];
        let canMerge = false;
        for (let col = 0; col < 4; col++) {
            if (grid[row][col] == 0) continue;
            
            if (canMerge == true && left.length > 0 && grid[row][col] == left[left.length - 1]) {
                left[left.length - 1] *= 2;
                canMerge = false;
                animate(rowId[row][col], colId[row][col], rowId[row][left.length - 1], colId[row][left.length - 1], grid[row][col], grid[row][col] * 2);
            } else {
                left.push(grid[row][col]);
                canMerge = true;
                animate(rowId[row][col], colId[row][col], rowId[row][left.length - 1], colId[row][left.length - 1], grid[row][col], grid[row][col]);
            }
        }
        
        while (left.length < 4) left.push(0);
        
        for (let col = 0; col < 4; col++) {
            if (grid[row][col] != left[col]) {
                changed = true;
            }
            grid[row][col] = left[col];
        }
    }
    return changed;
}

function generateSquare() {
    let pos = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] == 0) {
                pos.push(i*4 + j);
            }
        }
    }
    
    if (pos.length == 0) {
        return -1;
    }
    
    let next = Math.floor(Math.random() * pos.length);
    let nextNumber = Math.random() < 0.75 ? 2 : 4;
    
    let row = Math.floor(pos[next] / 4);
    let col = pos[next] % 4;
    grid[row][col] = nextNumber;
    
    drawOne(row, col);
}

function scale(x) {
    let width = canvas.width;
    return width/4 * x + width/8;
}

let moving = 0;
function animate(i1, j1, i2, j2, num1, num2) {
    moving++;
    let x1 = scale(j1);
    let y1 = scale(i1);
    let x2 = scale(j2);
    let y2 = scale(i2);
    
    let ctx = canvas.getContext("2d");
    let side = canvas.width/4 - 10;    
    
    window.requestAnimationFrame(nest);
    
    function nest() {
        if (Math.abs(x1-x2) < 5 && Math.abs(y1-y2) < 5) {
            ctx.clearRect(x1-side/2 - 2, y1-side/2 - 2, side + 4, side + 4);
            drawOne(i2, j2);
            moving--;
            if (moving == 0) {
                generateSquare();
            }
            
        } else {
            ctx.clearRect(x1-side/2 - 2, y1-side/2 - 2, side + 4, side + 4);
            
            x1 += (x2 - x1) / 3;
            y1 += (y2 - y1) / 3;
            ctx.fillStyle = map.get(num1);
            ctx.fillRect(x1-side/2, y1-side/2, side, side);
            
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(num1, x1, y1);
            window.requestAnimationFrame(nest);
        }
    }
}

function drawOne(i, j) {
    let ctx = canvas.getContext("2d");
    let side = canvas.width/4 - 10;    
    
    let x = scale(j);
    let y = scale(i);
    ctx.fillStyle = map.get(grid[i][j]);
    ctx.fillRect(x - side/2, y - side/2, side, side);
    
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(grid[i][j], x, y);
}