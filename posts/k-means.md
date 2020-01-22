---
layout: post
title: k-means clustering
src: ../src/k-means.js
---

<p><input type="file"  accept="image/*" name="image" id="file"  onchange="loadFile(event)" style="display: none;"></p>
<div width="100%" style="text-align:center"><label for="file" style="cursor: pointer;">upload file here!</label></div>

### description
the processed image only has k = 5 colours! the algorithm chooses k colours, and sets every pixel to one of the colour clusters. the clusters are then readjusted to better represent those pixels - over and over until the optimal colour clusters are chosen.
