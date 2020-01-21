var canvas = document.createElement('canvas');
var parent = document.getElementById('content');

canvas.width = 500;
canvas.height = 500;
canvas.style.border = "1px solid";

parent.appendChild(canvas);

var ctx = canvas.getContext("2d");
var realgrid = new Array(3);
var startingplayer = 1;
var player;
var playing = 1;
var fullness;
start();

canvas.onclick = update;


function start() {
	fullness = 0;
	player = startingplayer;
	startingplayer = 3 - startingplayer;
	playing = 1;

	for (let i = 0; i < 3; i++) {
		realgrid[i] = new Array(3);
		for (let j = 0; j < 3; j++) {
			realgrid[i][j] = 0;
		}
	}

	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0,0,500,500);

	if (player == 2) {
		let nextmove = getBestMove(realgrid, player, fullness);
		move(nextmove[1][0], nextmove[1][1]);
	}
}

function update(a) {
	let i = Math.floor(a.offsetX / (500 / 3));
	let j = Math.floor(a.offsetY / (500 / 3));

	move(i, j);

	let nextmove = getBestMove(realgrid, player, fullness);
	setTimeout(function(){
		move(nextmove[1][0], nextmove[1][1]);
	}, 200);
}

function move(i, j) {
	if (playing == 0) return;
	if (realgrid[i][j] != 0) return;
	

	realgrid[i][j] = player;
	fullness++;
	if (fullness == 9 || checkgame(realgrid, player, fullness)) {
		playing = 0;
		setTimeout(function(){
			start();
		}, 500);
	}

	if (player == 1) paint("#ED6A5A",i,j);
	else if (player == 2) paint("#36C9C6",i,j);

	player = 3 - player
}

function getBestMove(grid, player, full) {
	if (full == 9) return [0, [-1,-1]];

	let bestOutcome = -1;
	let pos = [];

	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			// illegal move
			if (grid[i][j] != 0) continue;

			// what if:
			let copy = JSON.parse(JSON.stringify(grid));
			copy[i][j] = player;

			// immediate win
			if (checkgame(copy, player) == 1) {
				return [full + 1, [i,j]];
			}

			// otherwise: minimax
			let outcome = getBestMove(copy, 3 - player, full+1);
			// guaranteed win
			if (outcome[0] < 0) {
				// if already winning, update the score
				if (bestOutcome > 0 && -outcome[0] < bestOutcome) {
					bestOutcome = -outcome[0];
					pos = [i, j];
				// otherwise, win is better 
			} else {
				bestOutcome = -outcome[0];
				pos = [i, j];
			}
			// draw at best
		} else if (outcome[0] == 0) {
			if (bestOutcome <= 0) {
				bestOutcome = 0;
				pos = [i, j];
			}
			// gonna lose
		} else {
				// try lose in longer steps
				if (bestOutcome < 0 && -outcome[0] < bestOutcome) {
					bestOutcome = -outcome[0];
					pos = [i, j];
				}
			}
		}
	}

	return [bestOutcome, pos];
}

// check that the game is won
function checkgame(grid, player) {
	let wins = [];
	wins.push([0,1,2]);
	wins.push([3,4,5]);
	wins.push([6,7,8]);
	wins.push([0,3,6]);
	wins.push([1,4,7]);
	wins.push([2,5,8]);
	wins.push([0,4,8]);
	wins.push([2,4,6]);

	for (let i = 0; i < 8; i++) {

		let good = 1;
		for (let j = 0; j < 3; j++) {
			let x = wins[i][j] % 3;
			let y = Math.floor(wins[i][j] / 3);
			if (grid[x][y] != player) good = 0;
		}
		if (good == 1) return 1;
	}
	return 0;
}

function paint(style, i, j) {
	ctx.fillStyle = style;
	ctx.fillRect(500/3 * i + 10, 500/3 * j + 10, 500/3 - 20, 500/3 - 20);
}
