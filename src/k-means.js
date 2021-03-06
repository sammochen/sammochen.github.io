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
let processed = false;

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

let kvalue;
let rgba;
let kvalues;
let iterations = 0;

function process() {
	if (processed) return;
	processed = true;
	iterations = 0;

	kvalue = document.getElementById("kvalue").value;
	rgba = getRGBA();
	kvalues = generateRandomKValues(rgba, kvalue);
	window.requestAnimationFrame(draw);
}

function draw() {
	iterations++;
	if (iterations > 30) return;

	let newkvalues = iterate(rgba, kvalues, kvalue);
	let same = true;
	for (let cluster = 0; cluster < kvalue; cluster++) {
		for (let color = 0; color < 4; color++) {
			if (kvalues[cluster][color] != newkvalues[cluster][color]) {
				same = false;
			}
		}
	}
	if (same == true) return;
	kvalues = newkvalues;
	let newrgba = generateArrayFromKMeans(rgba, kvalues, kvalue);
	let processedImageData = setRGBA(newrgba);
	
	ctx.putImageData(processedImageData, 0, 0);
	window.requestAnimationFrame(draw);
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

function generateRandomKValues(rgba, k) {	
	// choose k random values from (width, height)
	let randomk = [];
	while (randomk.length < k) {
		let x = Math.floor(Math.random() * height * width);
		if (randomk.indexOf(x) == -1) randomk.push(x);
	}
	// array of colours that are the middles. initially random colours from the image.
	let kmeans = new Array(k);
	for (let i = 0; i < k; i++) {
		kmeans[i] = new Array(4);
		let randomcolor = rgba[Math.floor(randomk[i] / width)][randomk[i] % width];
		
		for (let color = 0; color < 4; color++) {
			kmeans[i][color] = randomcolor[color];
		}
		
	}
	return kmeans;
}

function iterate(rgba, kvalues, k) {
	// iterate!
	let clusterColorSum = new Array(k);
	let clusterCount = new Array(k);
	
	for (let cluster = 0; cluster < k; cluster++) {
		clusterCount[cluster] = 0;
		
		clusterColorSum[cluster] = new Array(4);
		for (let color = 0; color < 4; color++) {
			clusterColorSum[cluster][color] = 0;
		}
	}
	
	// assign each i,j to the closest cluster, and mark it
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			let dist = 1e18;
			let bestcluster = -1;
			
			for (let cluster = 0; cluster < k; cluster++) {
				let thisdist = colorDist(rgba[i][j], kvalues[cluster]);
				if (thisdist < dist) {
					dist = thisdist;
					bestcluster = cluster;
				}
			}
			
			// add information to the clusters
			
			clusterCount[bestcluster]++;
			for (let color = 0; color < 4; color++) {
				clusterColorSum[bestcluster][color] += rgba[i][j][color];
			}
			
		}
	}

	let newkvalues = new Array(k);
	
	// find the average of each cluster, and set that to be the new kmeans
	for (let cluster = 0; cluster < k; cluster++) {
		newkvalues[cluster] = new Array(4);
		for (let color = 0; color < 4; color++) {
			newkvalues[cluster][color] = Math.floor(clusterColorSum[cluster][color] / clusterCount[cluster]);
		}
	}
	
	return newkvalues;
}

function generateArrayFromKMeans(rgba, kmeans, k) {
	// assign the colors back to the image!
	let processedArray = new Array(height);
	for (let i = 0; i < height; i++) {
		processedArray[i] = new Array(width);
		for (let j = 0; j < width; j++) {
			processedArray[i][j] = new Array(4);
			
			// find closest!
			let dist = 1e18;
			let bestcluster = -1;
			
			for (let cluster = 0; cluster < k; cluster++) {
				let thisdist = colorDist(rgba[i][j], kmeans[cluster]);
				if (thisdist < dist) {
					dist = thisdist;
					bestcluster = cluster;
				}
			}
			
			for (let color = 0; color < 4; color++) {
				processedArray[i][j][color] = kmeans[bestcluster][color];
			}
		}
	}
	
	return processedArray;
}