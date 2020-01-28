var parent = document.getElementById('content');
var canvas = document.createElement('canvas');

canvas.style.width = '100%';

canvas.height = canvas.width;

parent.appendChild(canvas);

console.log(canvas.height);

let n = 30;
let margin = 1;
let frame = 3;

let defaultColor = "#FFF9CC";
let wallColor = "#000000";
let trialColor = "#7EE8FA"
let visitedColor = "#FFD2CC"
let finalColor = "#80FF72";

let adjlist = new Array(n*n); // make an adjlist for dfs later
let visited = new Array(n*n); // for the dfs later
let prev = new Array(n*n); // parent of each node
prev[0] = -1;
for (let i = 0; i < n*n; i++) {
    adjlist[i] = [];
    visited[i] = false;
}

init();
go();

function init() {
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
    await join();
    await dfs(0);
}

async function join() {
    let root = new Array(n*n);
    for (let i = 0; i < n*n; i++) root[i] = i;
    
    // functions that help with disjoint set union
    function p(x) {
        if (x == root[x]) return x;
        root[x] = p(root[x]);
        return root[x];
    }
    
    function merge(x, y) {
        root[p(x)] = p(y);
    }
    
    function same(x, y) {
        return p(x) == p(y) ? true : false;
    }
    
    // initialise all the edges
    let edges = [];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i+1<n) edges.push([hashcode(i,j), hashcode(i+1,j)]);
            if (j+1<n) edges.push([hashcode(i,j), hashcode(i,j+1)]);
        }
    }
    
    edges.sort(() => Math.random() - 0.5);
    
    // join them if they were not already joined
    for (let ind = 0; ind < edges.length; ind++) {
        let edge = edges[ind];
        if (same(edge[0], edge[1])) continue;
        
        merge(edge[0], edge[1]);
        
        // draw the rectangle 
        drawJoin(edge[0], edge[1], defaultColor);
        
        // update adjlist
        adjlist[edge[0]].push(edge[1]);
        adjlist[edge[1]].push(edge[0]);
        
        // wait
        await sleep(3);
    }
}

async function dfs(at) {
    visited[at] = true;
    drawSquare(at, trialColor)
    // wait
    await sleep(3);

    if (at == n*n-1) return true;


    for (let i = 0; i < adjlist[at].length; i++) {
        let to = adjlist[at][i];
        prev[to] = at;
        if (!visited[to]) {
            if (await dfs(to)) {
                drawJoin(at, to, finalColor);
                await sleep(10);
                return true;
            }
        }
    }

    drawSquare(at, visitedColor);
    await sleep(3);

    return false;
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