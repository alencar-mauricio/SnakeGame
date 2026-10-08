import { Application, Container, Graphics } from "pixi.js";
import { Sound } from "@pixi/sound";
enum Direction {
  Up,
  Down,
  Left,
  Right 
}


type Coordinate = { // Coordinate object to represent the position of snake's body parts
  x: number;
  y: number;
}

type Snake = {
  head: Coordinate; // Snake head is a coordinate
  body: Array<Coordinate>; // Snake body is an array of coordinates
  direction: Direction; // Direction enum 
}

(async () => {
  const gridSize = 20; // Default unitary size of the snake and apple 
  const snake : Snake = { // Snake object declared
    head: { x: 100, y: 100 }, // Snake head initialized on the canvas position
    body: [], // Snake starts with no body parts and only the head
    direction: Direction.Down // Snake starts moving downwards
  };

  let apple: Coordinate = { x: 200, y: 200 };

  window.addEventListener("keydown", (keypress) => {  // Event listener to allow player to control the snake with the arrow keys
    switch (keypress.key) { // Switch structure to match the key pressed with the corresponding direction of the snake
      case "ArrowUp":
        snake.direction = Direction.Up; 
        break;
      case "ArrowDown":
        snake.direction = Direction.Down;
        break;
      case "ArrowLeft":
        snake.direction = Direction.Left;
        break;
      case "ArrowRight":
        snake.direction = Direction.Right;
        break;
    }
  });

  const app = new Application();

  await app.init({ background: "black", width: 800, height: 600, }); // Initializes the PixiJS application with a black background and a canvas size of 800x600 pixels

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const snakeHead = new Graphics().rect(0, 0, gridSize, gridSize).beginFill("green").endFill(); // Creates a green square to represent the snake head
  const appleIcon = new Graphics().rect(0, 0, gridSize, gridSize).fill("red");; // Creates a red square to represent the apple
  const snakeContainer = new Container(); // Container to hold body parts of the snake, which will be updated as the snake eats apples
  const eatSound = await Sound.from({ url: "assets/eat.mp3" });

  app.stage.addChild(snakeHead); // Adds snake head to the screen
  app.stage.addChild(appleIcon); // Adds apple to the screen
  app.stage.addChild(snakeContainer); // Adds snake body to the screen, which will be updated based on apples eaten

  app.ticker.maxFPS = 10; // maximum amount of times PixiJS calls the function passed to ticker.add() per second
  // Listen for animate update
  app.ticker.add(() => {
    if (snake.head.x === apple.x && snake.head.y === apple.y) { // If the snake head is on the same position as the apple...  
      eatSound.play(); // a sound is played whenever the snake eats an apple
      apple.x = Math.floor(Math.random() * (app.screen.width / gridSize)) * gridSize; //... the apple is moved to a random position on the X axis...
      apple.y = Math.floor(Math.random() * (app.screen.height / gridSize)) * gridSize; //... and on the Y axis
      snake.body.push({ x: snake.head.x, y: snake.head.y }); //... and the snake grows by adding a new body part at the position of the head
    }

    snake.body.unshift({ x: snake.head.x, y: snake.head.y }); // The current position of the head is added to the body array
    snake.body.pop(); // The last element of the body array is removed, so the snake doesn't grow indefinitely

    //Logic for the behaviour of the snake, allowing it to move in the direction it is facing according to the axis X and Y:
    if (snake.direction === Direction.Right) { // If the direction is right...
      snake.head.x += gridSize; //... it moves on the X axis by 'gridSize units; (hard coded to 20px)
    } else if (snake.direction === Direction.Left) { // If the direction is lefts...
      snake.head.x -= gridSize; //... it moves on the X axis by DECREASING 'gridSize' units (hard coded to 20px)
    } else if (snake.direction === Direction.Up) { // If the direction is up...
      snake.head.y -= gridSize; //... it moves on the Y axis by DECREASING 'gridSize' units (hard coded to 20px)
    } else if (snake.direction === Direction.Down) { // Finally, if the direction is down...
      snake.head.y += gridSize; // ... it moves on the Y axis by INCREASING 'gridSize' units (hard coded to 20px)
    } // The logic is "inverted" for the Y axis because the Y axis is oriented downwards in computer graphics

    //Rendering the snake
    snakeHead.position.set(snake.head.x, snake.head.y);
    appleIcon.position.set(apple.x, apple.y);

    snakeContainer.removeChildren();
    for (const bodyPart of snake.body) {
      const snakeBodyGraphics = new Graphics().rect(bodyPart.x, bodyPart.y, gridSize, gridSize).beginFill("lightgreen").endFill();
      snakeContainer.addChild(snakeBodyGraphics);
    }
  });
})();
