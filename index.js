// Welcome to


// 1234567
// qwer
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

import runServer from './server.js';

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info() {
  console.log("INFO");


  // Customize snakes appearence TASOS
  return {
    apiversion: "1",
    author: "",       // TODO: Your Battlesnake Username
    color: "#888888", // TODO: Choose color
    head: "default",  // TODO: Choose head
    tail: "default",  // TODO: Choose tail
  };
}

// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log("GAME START");
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  console.log("GAME OVER\n");
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState) {

  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true
  };

  // We've included code to prevent your Battlesnake from moving backwards
  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];

  if (myNeck.x < myHead.x) {        // Neck is left of head, don't move left
    isMoveSafe.left = false;

  } else if (myNeck.x > myHead.x) { // Neck is right of head, don't move right
    isMoveSafe.right = false;

  } else if (myNeck.y < myHead.y) { // Neck is below head, don't move down
    isMoveSafe.down = false;

  } else if (myNeck.y > myHead.y) { // Neck is above head, don't move up
    isMoveSafe.up = false;
  }

  // TODO: Step 1 - Snake must avoid collision with walls when deciding its next move GIANNIS
   const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;
  if (myHead.x===0){
    isMoveSafe.left=false;
  }
  if (myHead.x=== boardWidth -1 ){
    isMoveSafe.right=false;
  }
  if (myHead.y===0){
    isMoveSafe.down=false;
  }
  if (myHead.y=== boardHeight -1){
    isMoveSafe.up=false;
  }

 
  // TODO: Step 2 - Snake must avoid collision with itself when deciding its next move KOSTIS
 const myBody = gameState.you.body;

  mybody.forEach((b) => {
    if (myHead.x === b.x - 1 && myHead.y === b.y) {
      isMoveSafe.right = false;
    }
    if (myHead.x === b.x + 1 && myHead.y === b.y) {
      isMoveSafe.left = false;
    }
    if (myHead.y === b.y - 1 && myHead.x === b.x) {
      isMoveSafe.up = false;
    }
    if (myHead.y === b.y + 1 && myHead.x === b.x) {
      isMoveSafe.down = false;
    }
  });

  // TODO: Step 3 - Snake must avoid collision with other snakes when deciding its next move ORESTIS
  const snakes = gameState.board.snakes;
  snakes.forEach((snake) => {
    const snakeBody = snake.body;

    snakeBody.forEach((b) => {
      if (myHead.x === b.x - 1 && myHead.y === b.y) {
        isMoveSafe.right = false;
      }
      if (myHead.x === b.x + 1 && myHead.y === b.y) {
        isMoveSafe.left = false;
      }
      if (myHead.y === b.y - 1 && myHead.x === b.x) {
        isMoveSafe.up = false;
      }
      if (myHead.y === b.y + 1 && myHead.x === b.x) {
        isMoveSafe.down = false;
      }
    });
  });

  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter(key => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }

  // Choose a random move from the safe moves
  const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
  // food = gameState.board.food;

  console.log(`MOVE ${gameState.turn}: ${nextMove}`)
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end
});
