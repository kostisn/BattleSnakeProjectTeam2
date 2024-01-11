// Welcome to
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
import ngrok from 'ngrok';
import runServer from "./server.js";

// info is called when you create your Battlesnake on play.battlesnake.comsdds
// and controls your Battlesnake's appearanceddd
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info() {
  console.log("INFO");

  // Customize snakes appearence TASOSs
  return {
  head :  "sd",
    apiversion: "1",
    author: "",         
    color: "#cc0066", // Choose color
    head: "snow-worm",  // Choose head
    tail: "block-bum",  // Choose tail
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
    right: true,
  };

  // We've included code to prevent your Battlesnake from moving backwards
  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];

  if (myNeck.x < myHead.x) {
    // Neck is left of head, don't move left
    isMoveSafe.left = false;
  } else if (myNeck.x > myHead.x) {
    // Neck is right of head, don't move right
    isMoveSafe.right = false;
  } else if (myNeck.y < myHead.y) {
    // Neck is below head, don't move down
    isMoveSafe.down = false;
  } else if (myNeck.y > myHead.y) {
    // Neck is above head, don't move up
    isMoveSafe.up = false;
  }

  // TODO: Step 1 - Snake must avoid collision with walls when deciding its next move GIANNIS
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;
  if (myHead.x === 0) {
    isMoveSafe.left = false;
  }
  if (myHead.x === boardWidth - 1) {
    isMoveSafe.right = false;
  }
  if (myHead.y === 0) {
    isMoveSafe.down = false;
  }
  if (myHead.y === boardHeight - 1) {
    isMoveSafe.up = false;
  }

  // TODO: Step 2 - Snake must avoid collision with itself when deciding its next move KOSTIS
  const myBody = gameState.you.body;

  myBody.forEach((b) => {
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
  const safeMoves = Object.keys(isMoveSafe).filter((key) => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }

  // Choose a random move from the safe moves
  const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer GIANNIS

  const food = gameState.board.food;

  let closestFood = null;
  let minDistance = Infinity;

  food.forEach((f) => {
    const distance = Math.abs(myHead.x - f.x) + Math.abs(myHead.y - f.y);

    if (distance < minDistance) {
      minDistance = distance;
      closestFood = f;
    }
  });

  if (closestFood) {
    // Determine the direction to move towards the closest food
    const xDiff = myHead.x - closestFood.x;
    const yDiff = myHead.y - closestFood.y;

    if (xDiff > 0 && isMoveSafe.left) {
      return { move: "left" };
    } else if (xDiff < 0 && isMoveSafe.right) {
      return { move: "right" };
    } else if (yDiff > 0 && isMoveSafe.down) {
      return { move: "down" };
    } else if (yDiff < 0 && isMoveSafe.up) {
      return { move: "up" };
    }
  }

  // If no food is found or it's not safe to move towards food, choose a random safe move
  const safeMoves1 = Object.keys(isMoveSafe).filter((key) => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }

  const nextMove1 = safeMoves[Math.floor(Math.random() * safeMoves.length)];

  otherSnakes.forEach(snake => {
    const snakeTail = snake.body[snake.body.length - 1]; // Get the tail of the snake
    const tailDiffX = myHead.x - snakeTail.x;
    const tailDiffY = myHead.y - snakeTail.y;

    if (Math.abs(tailDiffX) <= 1 && Math.abs(tailDiffY) <= 1) {
      const willSnakeEatNextTurn = snake.length < gameState.you.length;

      if (tailDiffX > 0 && isMoveSafe.right && !willSnakeEatNextTurn) {
        isMoveSafe.right = false;
      } else if (tailDiffX < 0 && isMoveSafe.left && !willSnakeEatNextTurn) {
        isMoveSafe.left = false;
      } else if (tailDiffY > 0 && isMoveSafe.down && !willSnakeEatNextTurn) {
        isMoveSafe.down = false;
      } else if (tailDiffY < 0 && isMoveSafe.up && !willSnakeEatNextTurn) {
        isMoveSafe.up = false;
      }
    }
  });
  
    // Avoid collision with other snakes' heads
  const otherSnakes = gameState.board.snakes.filter(snake => snake.id !== gameState.you.id);

  otherSnakes.forEach(snake => {
    const snakeHead = snake.body[0];
    const headDiffX = myHead.x - snakeHead.x;
    const headDiffY = myHead.y - snakeHead.y;

    if (Math.abs(headDiffX) <= 1 && Math.abs(headDiffY) <= 1) {
      if (headDiffX > 0 && isMoveSafe.right) {
        isMoveSafe.right = false;
      } else if (headDiffX < 0 && isMoveSafe.left) {
        isMoveSafe.left = false;
      } else if (headDiffY > 0 && isMoveSafe.down) {
        isMoveSafe.down = false;
      } else if (headDiffY < 0 && isMoveSafe.up) {
        isMoveSafe.up = false;
      }
    }
  });

  otherSnakes.forEach(snake => {
    const snakeHead = snake.body[0];
    const headDiffX = myHead.x - snakeHead.x;
    const headDiffY = myHead.y - snakeHead.y;

    if (Math.abs(headDiffX) <= 1 && Math.abs(headDiffY) <= 1) {
      const willSnakeEatNextTurn = snake.length < gameState.you.length;

      // Adjusting for the bottom left point (0,0)
      const tailX = snake.body[snake.body.length - 1].x;
      const tailY = snake.body[snake.body.length - 1].y;

      if (headDiffX > 0 && isMoveSafe.right && !willSnakeEatNextTurn && myHead.x > tailX) {
        isMoveSafe.right = false;
      } else if (headDiffX < 0 && isMoveSafe.left && !willSnakeEatNextTurn && myHead.x < tailX) {
        isMoveSafe.left = false;
      } else if (headDiffY > 0 && isMoveSafe.down && !willSnakeEatNextTurn && myHead.y > tailY) {
        isMoveSafe.down = false;
      } else if (headDiffY < 0 && isMoveSafe.up && !willSnakeEatNextTurn && myHead.y < tailY) {
        isMoveSafe.up = false;
      }
    }
  });

  // Helper function to perform a simple flood-fill algorithm
function floodFill(board, start) {
  const visited = Array.from({ length: board.height }, () => Array(board.width).fill(false));
  const queue = [{ x: start.x, y: start.y, distance: 0 }];

  while (queue.length > 0) {
    const { x, y, distance } = queue.shift();

    if (x >= 0 && x < board.width && y >= 0 && y < board.height && !visited[y][x]) {
      visited[y][x] = true;

      // Use the distance information as needed (for example, store it in a data structure)
      // In this example, I'm updating a board with the distance from the starting point
      board[y][x] = distance;

      // Add neighboring cells to the queue
      queue.push({ x: x + 1, y, distance: distance + 1 });
      queue.push({ x: x - 1, y, distance: distance + 1 });
      queue.push({ x, y: y + 1, distance: distance + 1 });
      queue.push({ x, y: y - 1, distance: distance + 1 });
    }
  }
}

function move(gameState) {
  // ...

  // TODO: Step 6 - Implement flood-fill algorithm
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;

  // Initialize a 2D array to represent the board, marking obstacles with -1
  const board = Array.from({ length: boardHeight }, () => Array(boardWidth).fill(0));

  // Mark obstacles (other snakes, walls) with -1
  gameState.board.snakes.forEach(snake => {
    snake.body.forEach(segment => {
      board[segment.y][segment.x] = -1;
    });
  });

  // Perform flood-fill starting from the snake's head
  floodFill(board, myHead);

  // Now you have a board with distances from the snake's head to every reachable point
  // Use this information to make a more informed decision about the next move

  // Example: Move towards the neighboring cell with the maximum distance
  const maxDistance = Math.max(
    board[myHead.y + 1][myHead.x],
    board[myHead.y - 1][myHead.x],
    board[myHead.y][myHead.x + 1],
    board[myHead.y][myHead.x - 1]
  );

  if (maxDistance === board[myHead.y + 1][myHead.x] && isMoveSafe.down) {
    return { move: "down" };
  } else if (maxDistance === board[myHead.y - 1][myHead.x] && isMoveSafe.up) {
    return { move: "up" };
  } else if (maxDistance === board[myHead.y][myHead.x + 1] && isMoveSafe.right) {
    return { move: "right" };
  } else if (maxDistance === board[myHead.y][myHead.x - 1] && isMoveSafe.left) {
    return { move: "left" };
  }}

  console.log(`MOVE ${gameState.turn}: ${nextMove}`);
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end,
});
