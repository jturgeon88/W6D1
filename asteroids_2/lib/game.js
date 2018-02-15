const Asteroid = require("./asteroid");
const Util = require("./util");
const Ship = require("./ship");
const Bullet = require("./bullet.js");

//This class will be in charge of holding all of our moving objects. 
// It will also contain the logic for iterating through these
// objects and calling their corresponding move methods.

function Game() {
  this.asteroids = [];
  this.ships = [];
  this.bullets = [];

  this.addAsteroids();
  // this.addShip();
};

Game.DIM_X = 1200;
Game.DIM_Y = 800;
Game.NUM_ASTEROIDS = 15;
Game.BG_COLOR = "blue";

Game.prototype.add = function add(object) {
  if (object instanceof Bullet) {
    this.bullets.push(object);
  } else if (object instanceof Asteroid) {
    this.asteroids.push(object);
  } else if (object instanceof Ship) {
    this.ships.push(object);
  } else {
    throw new Error("unkown type of object");
  }
};

Game.prototype.addAsteroids = function addAsteroids() {
  // need to randomly place the asteroids within the dimensions of the game grid.
  for (let i = 0; i < Game.NUM_ASTEROIDS; i++) {
    this.add(new Asteroid( { game : this }));
  }
}

Game.prototype.addShip = function addShip() {
  const ship = new Ship({
    pos: this.randomPosition(),
    game: this
  });

  this.add(ship);

  return ship;        //why do we return the ship?
};

Game.prototype.allObjects = function allObjects() {
  return [].concat(this.ships, this.asteroids, this.bullets);
};

Game.prototype.checkCollisions = function checkCollisions() {
  // Iterate through asteroids array and check each pair of asteroids for collisions:
  const allObjects = this.allObjects();
  console.log(allObjects);
  for (let i = 0; i < allObjects.length; i++) {
    for (let j = 0; j < allObjects.length; j++) {
      const obj1 = allObjects[i];
      const obj2 = allObjects[j];

      if (obj1.isCollidedWith(obj2)) {
        const collision = obj1.collideWith(obj2);
        if (collision) return;
      }
    }
  }
};

// Game.prototype.checkCollisions = function checkCollisions() {
//   // Iterate through asteroids array and check each pair of asteroids for collisions:

//   for (let i = 0; i < this.asteroids.length; i++) {
//     for (let j = i + 1; j < this.asteroids.length; j++) {
//       if (this.allObjects()[i].isCollidedWith(this.allObjects()[j])) {
//         this.allObjects()[i].collideWith(this.allObjects()[j]);
//       };
//     };
//   };
// }

Game.prototype.draw = function draw(ctx) {
  // wipe the entire space:
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  this.allObjects().forEach((object) => {
    object.draw(ctx);
  });
}

Game.prototype.moveObjects = function moveObjects() {
  // should call move on each of the asteroids:
  this.allObjects().forEach((object) => {
    object.move();
  });
};

Game.prototype.randomPosition = function randomPosition() {
  return [
    Game.DIM_X * Math.random(),
    Game.DIM_Y * Math.random()
  ];
};

Game.prototype.remove = function remove(object) {
  if (object instanceof Asteroid) {
    this.asteroids.splice(this.asteroids.indexOf(object), 1);
  } else if (object instanceof Ship) {
    this.ships.splice(this.ships.indexOf(object), 1);
  } else if (object instanceof Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
  } else {
    throw new Error("unknown type of object");
  }
};

Game.prototype.step = function step () {
  this.moveObjects();
  this.checkCollisions();
};

Game.prototype.isOutOfBounds = function isOutOfBounds(pos) {
  return ((pos[0] < 0 || pos[1] < 0) || (pos[0] > Game.DIM_X || pos[1] > Game.DIM_Y));
}

Game.prototype.wrap = function (pos) {
  // return a wrapped position
  return [
    Util.wrap(pos[0], Game.DIM_X),
    Util.wrap(pos[1], Game.DIM_Y)
  ];
};

module.exports = Game;



