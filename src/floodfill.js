var parent = document.getElementById('content');
var canvas = document.createElement('canvas');

canvas.style.width = '100%';

canvas.height = canvas.width;

parent.appendChild(canvas);

let n = 50;
let margin = 1;

let defaultColor = "#BAD7F2";
let wallColor = "#000000";
let goodColor = "#FFE7C4";
let onStackColor = "#F2BAC9";

let adjlist; // make an adjlist for dfs later
let dist; // for the dfs later

init();
wilson();

canvas.onclick = go;

function init() {
    adjlist = new Array(n*n); // make an adjlist for dfs later
    for (let i = 0; i < n*n; i++) {
        adjlist[i] = [];
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

async function go(e) {
    let i = Math.floor(e.offsetX * n / canvas.offsetWidth)
    let j = Math.floor(e.offsetY * n / canvas.offsetHeight);
    await bfs(hashcode(i, j));
}

async function bfs(s) {
    dist = new Array(n*n);
    for (let i = 0; i < n*n; i++) dist[i] = -1;
    let front = 0;
    let queue = [s];
    dist[s] = 0;
    let fill = -1;
    while (front < queue.length) {
        let at = queue[front];
        drawSquare(at, 'hsl('+ dist[at] * 10 % 360 +',100%,50%)');
        front++;
        
        if (dist[at] > fill) {
            fill = dist[at];
            await sleep(20);
        }
        for (let i = 0; i < adjlist[at].length; i++) {
            let to = adjlist[at][i];
            if (dist[to] == -1) {
                dist[to] = dist[at] + 1;
                queue.push(to);

                drawJoin(at, to, 'hsl('+ (dist[at] * 10 + 5) % 360 +',100%,50%)')
                
            }
        }
        drawSquare(at, 'hsl('+ dist[at] * 10 % 360 +',100%,50%)');
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
                    addEdge(stack[i], stack[i+1]);
                }
                onstack[stack[stack.length - 1]] = false;
                isgood[stack[stack.length - 1]] = true;
                drawJoin(stack[stack.length - 1], next, goodColor);
                addEdge(stack[stack.length - 1], next);
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

function addEdge(a, b) {
    adjlist[a].push(b);
    adjlist[b].push(a);
}