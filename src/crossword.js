var parent = document.getElementById('content');
var canvas = document.createElement('canvas');
var slider = document.getElementById('mySlider');

canvas.style.width = '100%';
canvas.height = canvas.width;

canvas.style.border = "1px solid";

parent.appendChild(canvas);

canvas.onclick = click;
document.onkeypress = type;

let clickedI = -1;
let clickedJ = -1;
let state; // 0 - nothing, 1 - animating, 2 - going

let dictionary = new Map();

let n = 11;
let grid = [
    "### # # # #".split(''),
    "           ".split(''),
    "# # # # # #".split(''),
    "    ##     ".split(''),
    "# ### # # #".split(''),
    "           ".split(''),
    "# # # ### #".split(''),
    "    ###    ".split(''),
    "# # # # # #".split(''),
    "           ".split(''),
    "# # # # ###".split('')
]
init();

function click(e) {
    let i = Math.floor(e.offsetY * n / canvas.offsetHeight);
    let j = Math.floor(e.offsetX * n / canvas.offsetWidth);
    if (grid[i][j] == '#') {
        clickedI = -1;
        clickedJ = -1;
        return;
    }

    clickedI = i;
    clickedJ = j;
}


async function type(e) {
    if (e.key == "Enter") {
        if (state == 0) {
            state++;
            await solve(0, 0);
            drawGrid(grid);
            state = 0;
        } else if (state == 1) {
            state++;
        } else {

        }
        return;
    }

    if (clickedI == -1) return;

    let input = "" + e.key;
    input = input.toUpperCase();

    drawLetter(input, clickedI, clickedJ);
    
    grid[clickedI][clickedJ] = input;
    isGood(clickedI, clickedJ);
}

function init() {
    // load words
    
    state = 0;
    initGrid();
    initWords();
}

function initGrid() {
    let width = canvas.width / n;
    for (let i = 1; i < n; i++) {
        drawLine(0,i*width,canvas.width,i*width, 1);
        drawLine(i*width,0,i*width,canvas.width, 1);
    }
    drawGrid(grid);
}

function str(n, s) {
    return new Array(n + 1).join(s);
}

function initWords() {
    fetch("../src/words.txt").then(response => response.text()).then(text => {
        let words = text.split(/\s*[\s,]\s*/);
        for (let i = 0; i < words.length; i++) {
            let word = words[i];
            for (let a = 0; a < word.length; a++) {
                for (let b = a; b < word.length; b++) {
                    let substring = str(a, ' ') + word.substring(a, b+1) + str(word.length - 1 - b, ' ');
                    dictionary[substring] = true;
                    
                }
            }
        }
    });
}

async function go() {
    await solve(grid,0,0);
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

function getHoriString(i, j) {
    while (j > 0 && grid[i][j-1] != "#") {
        j--;
    }
    let ans = "";
    while (j < n && grid[i][j] != "#") {
        ans += grid[i][j];
        j++;
    }
    return ans;
}

function getVertiString(i, j) {
    while (i > 0 && grid[i-1][j] != "#") {
        i--;
    }
    let ans = "";
    while (i < n && grid[i][j] != "#") {
        ans += grid[i][j];
        i++;
    }
    return ans;
}

function inDictionary(string) {
    let result = dictionary[string];    
    console.log("'" + string + "'", result);
    return result;
}

function isWord(string) {
    // look for streaks of words 
    let streak = "";
    let start = -1;
    for (let i = 0; i < string.length; i++) {
        if (string[i] == " ") {
            if (start == -1) continue;
            let whole = str(start, ' ') + streak + str(string.length - streak.length - start, ' ');
            start = -1;
            streak = "";
            if (!inDictionary(whole)) return false;
        } else {
            if (start == -1) start = i;
            streak += string[i];
        }
    }
    if (start == -1) return true;

    let whole = str(start, ' ') + streak;
    if (!inDictionary(whole)) return false;
    return true;

}

function isGood(i, j) {
    let hori = getHoriString(i, j);
    let verti = getVertiString(i, j);
    
    let good = isWord(hori) && isWord(verti);
    console.log("'" + hori + "'", "'" + verti + "'", isWord(hori), isWord(verti), good);
    return good;
}

let rate = 1;
let r = 0;
// solves the grid. returns a grid if completed, otherwise, returns null
async function solve(i, j) {
    if (state == 1 && r == 0) await sleep(1);
    r = (r + 1) % rate;

    if (i == n && j == 0) return true;

    let nexti = i, nextj = j+1;
    if (nextj == n) {
        nexti++;
        nextj = 0;
    }

    if (grid[i][j] != " ") return await solve(nexti, nextj);

    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

    letters.sort(function() {return Math.random() - 0.5});

    for (let x = 0; x < 26; x++) {
        grid[i][j] = letters[x];
        drawLetter(letters[x], i, j);

        if (isGood(i, j)) {
            let result = await solve(nexti, nextj);
            if (result == true) return true;
        }

        grid[i][j] = " ";
        
    }
    return false;
}

function drawGrid(grid) {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            drawLetter(grid[i][j], i, j);
        }
    }
}

function drawLetter(letter, i, j) {
    var ctx = canvas.getContext("2d");

    if (letter == "#") {
        ctx.fillRect(canvas.width / n * j, canvas.width / n * i, canvas.width / n, canvas.width / n);
        return;
    }

    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    let x = canvas.width / n * j + canvas.width / n / 2;
    let y = canvas.width / n * i + canvas.width / n / 2;

    ctx.clearRect(x-10,y-10,20,20);
   
    ctx.fillText(letter, x, y);
}

async function sleep(ms) {
    await new Promise(r => setTimeout(r, ms));
}