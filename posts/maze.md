---
layout: post
title: maze generation - wilson's algorithm
src: ../src/maze.js
---


<input type="range" min="10" max="75" step="5" value="30" class="slider" id="mySlider" style="width:100%;">


### how to use
click once to see wilson's algorithm in action - click again to skip to the end! 
adjust the slider to change the grid size!

### description
this maze is generated with wilson's algorithm - i had a little dig around wikipedia to implement this! 

in the algorithm, the maze is initially a single point, in orange. another random point, in red, is chosen, and it randomly walks until it reaches an orange point. in the case that it walks on itself, the loop is 'erased'. continue to draw lines until the whole grid is filled!

apparently, wilson's algorithm produces an unbiased maze and is a better algorithm for generating mazes than using prim's or kruskal's! i'm not really sure how myself though!