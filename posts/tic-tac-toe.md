---
layout: post
title: tic tac toe
src: ../src/tic-tac-toe.js
---

### how to play
click on the 3x3 grid above to place a tile. your objective is to get 3 in a row, while preventing the other player from doing so.  
when a player wins, or the board is full, the game will reset shortly with the other person starting.

### description
i have implemented a minimax solver. in summary - the computer chooses the position that is the worst for its opponent.  
the bot is a 'perfect' solver, meaning that the algorithm tries every possibility, to the end of the game. this is not possible for more complex games such as connect-4.