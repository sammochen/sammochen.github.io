var parent = document.getElementById('content');
var canvas = document.createElement('canvas');
var image = document.createElement('img');
image.src = "/img/image.jpg";

canvas.style.width = '100%';
canvas.style.border = "1px solid";

parent.appendChild(canvas);

let width = canvas.width;
let height = 0;
let ctx = canvas.getContext("2d");

image.onload = function(){
    height = Math.floor(canvas.width / image.width * image.height);
    canvas.height = height;
    processed = false;
    
    ctx.drawImage(image, 0, 0, width, height);
}

var loadFile = function(event) {
    image.src = URL.createObjectURL(event.target.files[0]);
};

canvas.onclick = process
let queue = [];
let animation = false;
let rgba;

function process(e) {
    rgba = getRGBA();
    let x = Math.floor(e.offsetX / canvas.offsetWidth * rgba[0].length);
    let y = Math.floor(e.offsetY / canvas.offsetHeight * rgba.length);
    
    queue.push([y, x]);
    
    bfs();
}

function bfs() {
    while (queue.length != 0) {
        let front = queue.shift();
        let x = front[0];
        let y = front[1];
        
        rgba[x][y] = [0,0,0,255];
        
        let dx = [0,0,1,-1];
        let dy = [1,-1,0,0];
        
        for (let dd = 0; dd < 4; dd++) {
            let xx = x + dx[dd];
            let yy = y + dy[dd];
            if (xx >= 0 && xx < rgba.length && yy >= 0 && yy < rgba[0].length) {
                if (colorDist(rgba[x][y], rgba[xx][yy]) > 2000) {
                    continue;
                } else {
                    queue.push([xx, yy]);
                    rgba[xx][yy] = [0,0,0,255];
                }
            }
        }
        draw();
    }
    
}

function draw() {
    console.log("Draw");
    let processedImageData = setRGBA(rgba);
    ctx.putImageData(processedImageData, 0, 0);
       
}

function equals(arr1, arr2) {
    if (arr1.length != arr2.length) return false;
    
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i]) return false;
    }
    return true;
}

function index(i, j, color) {
    return i*width*4 + j*4 + color;
}

function getRGBA() {
    let imageData = ctx.getImageData(0, 0, width, height);
    let rgba = new Array(height);
    
    //initialise
    for (let i = 0; i < height; i++) {
        rgba[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            rgba[i][j] = new Array(4);
            for (let color = 0; color < 4; color++) {
                rgba[i][j][color] = imageData.data[index(i,j,color)];
            }
        }
    }
    return rgba;
}

function setRGBA(processedArray) {
    let height = processedArray.length;
    let width = processedArray[0].length;
    
    let imageData = ctx.createImageData(width, height);
    
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            for (let color = 0; color < 4; color++) {
                imageData.data[index(i, j, color)] = processedArray[i][j][color];
            }
        }
    }
    return imageData;
}

function colorDist(color1, color2) {
    let rdash = (color1[0] + color2[0]) / 2;
    let dr = color1[0] - color2[0];
    let dg = color1[1] - color2[1];
    let db = color1[2] - color2[2];
    // source: https://www.compuphase.com/cmetric.htm
    let dist = Math.sqrt((2 + rdash/256)*dr*dr + 4*dg*dg + (2 + (255-rdash) / 256)*db*db);
    return dist;
}
