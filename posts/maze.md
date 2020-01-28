---
layout: post
title: maze
src: ../src/maze.js
---


<input type="range" min="5" max="50" value="30" class="slider" id="mySlider" style="width:100%;">


### description
i've always wondered how people make mazes for magazines! this is a random maze generator and is different everytime! 
there are 2 steps: maze creation and path detection.

#### maze creation: disjoint set union (dsu)
the algorithm considers each wall, and 'breaks' the wall ONLY if the two sides were not already connected together. this ensures that there is only ONE path from start to finish. (you can imagine the grid as a tree!)

#### path detection: depth-first search (dfs)
the algorithm randomly chooses a path and explores it to completion (in blue). if it doesn't find the exit, it simply goes back and tries again. it marks squares (in red) that it's done to not double-back on itself. when it has found the exit, it goes back and marks it in green!