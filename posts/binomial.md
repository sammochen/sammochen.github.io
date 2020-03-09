---
layout: post
title: binomial distribution
src: ../src/binomial.js
---

### how to use
click to let the balls cascade through the circular obstacles, and click again to stop. the balls will automatically stop once it reaches a certain height to prevent overflow.

### description
this visualisation provides an intuitive way of understanding the binomial curve.
at each level, the ball has a ~50/50 choice of going left or right, which results in an approximate binomial distribution at the bottom! 

regarding the physics of the simulation, the balls do not interact with each other and collide only with the obstacles. the balls feel a repulsive force from the obstacles, and they stop reacting to forces once it settles at the bottom.