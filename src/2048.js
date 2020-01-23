var parent = document.getElementById('content');
var canvas = document.createElement('canvas');

canvas.style.width = '100%';
canvas.style.border = "1px solid";

canvas.height = canvas.width;

parent.appendChild(canvas);

let grid;
start();
document.onkeydown = move;


function start() {
    grid = new Array(4);
    for (let i = 0; i < 4; i++) {
        grid[i] = new Array(4);
        for (let j = 0; j < 4; j++) {
            grid[i][j] = 0;
        }
    }
    generateSquare();
    paintAll();
}

function paintAll() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            paint(i, j, grid[i][j]);
        }
    }
}

function move(e) {
    console.log(e);

    if (e.keyCode == 37) { // left
        for (let i = 0; i < 4; i++) grid[i] = moveLeft(grid[i]);
    } else if (e.keyCode == 38) { // up
        rotateClockwise();
        rotateClockwise();
        rotateClockwise();
        for (let i = 0; i < 4; i++) grid[i] = moveLeft(grid[i]);
        rotateClockwise();
    } else if (e.keyCode == 39) { // right
        rotateClockwise();
        rotateClockwise();
        for (let i = 0; i < 4; i++) grid[i] = moveLeft(grid[i]);
        rotateClockwise();
        rotateClockwise();
    } else if (e.keyCode == 40) { // down
        rotateClockwise();
        for (let i = 0; i < 4; i++) grid[i] = moveLeft(grid[i]);
        rotateClockwise();
        rotateClockwise();
        rotateClockwise();
    } else {
        return; // invalid move
    }

    generateSquare();
    paintAll();
}

function rotateClockwise() {
    newgrid = new Array(4);
    for (let i = 0; i < 4; i++) {
        newgrid[i] = new Array(4);
        for (let j = 0; j < 4; j++) {
            newgrid[i][j] = grid[3-j][i];
        }
    }
    grid = newgrid;
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

    let next = Math.floor(Math.random() * pos.length);
    let nextNumber = Math.random() < 0.75 ? 2 : 4;

    grid[Math.floor(pos[next] / 4)][pos[next] % 4] = nextNumber;;
}

// moves it towards the front
function moveLeft(row) {
    // everything gets moved along to the left
    let left = [];
    let canMerge = false;
    for (let i = 0; i < 4; i++) {
        if (row[i] != 0) {
            if (left.length > 0 && row[i] == left[left.length - 1] && canMerge == true) {
                left[left.length - 1] *= 2;
                canMerge = false;
            } else {
                left.push(row[i]);
                canMerge = true;
            }
        }
    }

    while (left.length < 4) left.push(0);
    return left;
}

function paint(i, j, number) {
    map = new Map();
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
    let ctx = canvas.getContext("2d");
    let width = canvas.width;

	ctx.fillStyle = map.get(number);
    ctx.fillRect(width/4 * j + 5, width/4 * i + 5, width/4 - 10, width/4 - 10);
    
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(number, width/4 * j + width/8, width/4 * i + width/8);
}
