var parent = document.getElementById('content');
var canvas = document.createElement('canvas');
var slider = document.getElementById('mySlider');

canvas.style.width = '100%';

canvas.height = canvas.width;

parent.appendChild(canvas);

let n = 20;
let margin = 1;

let defaultColor = "#BAD7F2";
let wallColor = "#000000";
let goodColor = "#FFE7C4";
let onStackColor = "#F2BAC9";

let adjlist; // make an adjlist for dfs later
let visited; // for the dfs later
let prev; // parent of each node
let state; // 0 : nothing, 1: running, 2: no animate
let animate;

init();

canvas.onclick = go;
slider.oninput = init;


function init() {
    n = slider.value;
    state = 0;
    animate = true;

    adjlist = new Array(n*n); // make an adjlist for dfs later
    visited = new Array(n*n); // for the dfs later
    prev = new Array(n*n); // parent of each node
    prev[0] = -1;
    for (let i = 0; i < n*n; i++) {
        adjlist[i] = [];
        visited[i] = false;
    }
    
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = wallColor;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {            
            drawSquare(i*n+j, defaultColor);
        }
    }
}

function hashcode(i, j) {
    return i*n+j;
}

async function go() {
    if (state == 0) {
        state = 1;
        slider.disabled = true;
        await wilson();
        //await dfs(0);
        slider.disabled = false;
    } else if (state == 1) {
        state = 2;
        animate = false;
    } else {
        // do nothing
    }
}

async function wilson() {
    let isgood = new Array(n*n);
    for (let i = 0; i < n*n; i++) {
        isgood[i] = false;
    }
    
    let first = Math.floor(Math.random() * n*n);
    
    drawSquare(first, goodColor);
    isgood[first] = true;
    
    while (true) {
        let left = [];
        for (let i = 0; i < n*n; i++) {
            if (isgood[i] == false) left.push(i);
        }
        
        if (left.length == 0) break;
        
        let start = left[Math.floor(Math.random() * left.length)]; 
        
        // do a dfs, loopless walk
        let stack = [];
        let onstack = new Array(n*n);
        for (let i = 0; i < n*n; i++) {
            onstack[i] = false;
        }
        
        let at = start;
        stack.push(at);
        onstack[at] = true;
        while (true) {
            if (animate == true) await sleep(1);
            // move towards some random direction
            let i = Math.floor(at/n);
            let j = at%n;
            let di = [0,0,1,-1];
            let dj = [1,-1,0,0];
            let x = Math.floor(Math.random() * 4);
            let nexti = i + di[x];
            let nextj = j + dj[x];
            if (nexti < 0 || nexti >= n || nextj < 0 || nextj >= n) continue;
            
            let next = nexti * n + nextj;
            
            if (isgood[next]) {
                // make everything on the current stack good!
                for (let i = 0; i < stack.length - 1; i++) {
                    onstack[stack[i]] = false;
                    isgood[stack[i]] = true;
                    drawJoin(stack[i], stack[i+1], goodColor);
                }
                onstack[stack[stack.length - 1]] = false;
                isgood[stack[stack.length - 1]] = true;
                drawJoin(stack[stack.length - 1], next, goodColor);
                
                stack = [];
                
                break;
            }
            
            while (onstack[next] == true) {
                onstack[stack[stack.length - 1]] = false;
                drawSquare(stack[stack.length - 1], defaultColor);
                stack.pop();
            }
            
            stack.push(next);
            drawSquare(next, onStackColor);
            onstack[next] = true;
            
            at = next;
        }
    }
}

async function sleep(ms) {
    await new Promise(r => setTimeout(r, ms));
}

function drawSquare(code, style) {
    let i = Math.floor(code/n);
    let j = code%n;
    let x = canvas.width / n * i;
    let y = canvas.width / n * j;
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = style;
    ctx.fillRect(x+margin,y+margin,canvas.width/n-2*margin,canvas.height/n-2*margin);
}

function drawJoin(code1, code2, style) {
    let ctx = canvas.getContext("2d");
    let i1 = Math.floor(code1 / n);
    let j1 = code1 % n;
    let i2 = Math.floor(code2 / n);
    let j2 = code2 % n;
    
    let x = canvas.width / n * Math.min(i1, i2);
    let y = canvas.width / n * Math.min(j1, j2);
    let width = i1 != i2 ? canvas.width/n * 2 : canvas.width/n;
    let height = i1 != i2 ? canvas.height/n : canvas.height/n * 2;
    ctx.fillStyle = style;
    ctx.fillRect(x+margin,y+margin,width-2*margin,height-2*margin);
}