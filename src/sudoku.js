var parent = document.getElementById('content');
var canvas = document.createElement('canvas');
var slider = document.getElementById('mySlider');

canvas.style.width = '100%';
canvas.height = canvas.width;

canvas.style.border = "1px solid";

parent.appendChild(canvas);

let grid;


canvas.onclick = click;
document.onkeypress = type;

let clickedI = -1;
let clickedJ = -1;
let state; // 0 - nothing, 1 - animating, 2 - going


init();

function click(e) {
    let i = Math.floor(e.offsetY * 9 / canvas.offsetHeight);
    let j = Math.floor(e.offsetX * 9 / canvas.offsetWidth);
    clickedI = i;
    clickedJ = j;
}



async function type(e) {
    if (e.key == "Enter") {
        if (state == 0) {
            state++;
            grid = await solve(grid, 0, 0);
            drawGrid(grid);
            state = 0;
        } else if (state == 1) {
            state++;
        } else {

        }
        return;
    }

    if (clickedI == -1) return;
    if (e.key >= 1 && e.key <= 9) {
        grid[clickedI][clickedJ] = e.key;
        drawGrid(grid);
    } else {
        grid[clickedI][clickedJ] = 0;
        drawGrid(grid);
    }
}

function init() {
    state = 0;
    let width = canvas.width / 9;
    for (let i = 1; i < 9; i++) {
        let margin = i % 3 == 0 ? 2 : 1;
        drawLine(0,i*width,canvas.width,i*width, margin);
        drawLine(i*width,0,i*width,canvas.width, margin);
    }

    grid = new Array(9);
    for (let i = 0; i < 9; i++) {
        grid[i] = new Array(9);
        for (let j = 0; j < 9; j++) {
            grid[i][j] = 0;
        }
    }
    drawGrid(grid);
}

async function go() {
    let solved = await solve(grid,0,0);
    drawGrid(solved);
    await sleep(10);
}

function drawLine(x1,y1,x2,y2,width) {
    let ctx = canvas.getContext("2d");
    ctx.lineWidth = width;
    ctx.beginPath();       // Start a new path
    ctx.moveTo(x1, y1);    // Move the pen to (30, 50)
    ctx.lineTo(x2, y2);  // Draw a line to (150, 100)
    ctx.stroke();
}

let rate = 10;
let r = 0;
// solves the grid. returns a grid if completed, otherwise, returns null
async function solve(grid, i, j) {
    drawGrid(grid);
    if (state == 1 && r == 0) await sleep(1);
    r = (r + 1) % rate;

    if (checkValid(grid) == false) return null;
    if (i == 9 && j == 0) return grid;

    let nexti = i, nextj = j+1;
    if (nextj == 9) {
        nexti++;
        nextj = 0;
    }

    if (grid[i][j] != 0) return solve(grid, nexti, nextj);

    let numbers = [];
    for (let num = 1; num <= 9; num++) numbers.push(num);

    numbers.sort(function() {return Math.random() - 0.5});

    for (let x = 0; x < 9; x++) {
        let copy = JSON.parse(JSON.stringify(grid));
        copy[i][j] = numbers[x];
        let result = await solve(copy, nexti, nextj);
        if (result != null) return result;
    }
    return null;
}

function checkValid(grid) {
    // check every row
    for (let i = 0; i < 9; i++) {
        let freq = new Array(10);
        for (let j = 0; j < 10; j++) freq[j] = 0;

        for (let j = 0; j < 9; j++) {
            if (grid[i][j] == 0) continue;
            freq[grid[i][j]]++;
            if (freq[grid[i][j]] == 2) return false;
        }
    }
    // check every col
    for (let i = 0; i < 9; i++) {
        let freq = new Array(10);
        for (let j = 0; j < 10; j++) freq[j] = 0;

        for (let j = 0; j < 9; j++) {
            if (grid[j][i] == 0) continue;
            freq[grid[j][i]]++;
            if (freq[grid[j][i]] == 2) return false;
        }
    }

    // check every square
    for (let i = 0; i < 9; i++) {
        let freq = new Array(10);
        for (let j = 0; j < 10; j++) freq[j] = 0;

        for (let j = 0; j < 9; j++) {
            let ii = Math.floor(i/3) * 3 + Math.floor(j/3);
            let jj = (i%3) * 3 + j % 3;
            if (grid[ii][jj] == 0) continue;
            freq[grid[ii][jj]]++;
            if (freq[grid[ii][jj]] == 2) return false;
        }
    }
    return true;
}

function drawGrid(grid) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            drawNumber(grid[i][j], i, j);
        }
    }
}

function drawNumber(number, i, j) {
    var ctx = canvas.getContext("2d");

    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    let x = canvas.width / 9 * j + canvas.width / 18;
    let y = canvas.width / 9 * i + canvas.width / 18;

    ctx.clearRect(x-10,y-10,20,20);
   
    if (number == 0) return;
    ctx.fillText(number, x, y);
}

async function sleep(ms) {
    await new Promise(r => setTimeout(r, ms));
}