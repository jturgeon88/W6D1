/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

const Util = {
  inherits(childClass, parentClass) {
    childClass.prototype = Object.create(parentClass.prototype);
    childClass.prototype.constructor = childClass;
  }, 

  dist(pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
    );
  },

  randomVec(length) {
    const deg = 2 * Math.PI * Math.random();
    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
  },

  scale(vec, m) {
    return [vec[0] * m, vec[1] * m];
  },

  wrap(coord, max) {
    if (coord < 0) {
      return max - (coord % max);
    } else if (coord > max) {
      return coord % max;
    } else {
      return coord;
    }
  },

  // finds the length of the vector
  norm(vec) {
    return Util.dist([0, 0], vec);
  },

  // Normalizes the length of the vector to 1, while
  // maintaining the direction:
  dir(vec) {
    const norm = Util.norm(vec);
    return Util.scale(vec, 1/norm);
  }
};

module.exports = Util;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);


function MovingObject (options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
  this.game = options.game;
}

MovingObject.prototype.collideWith = function collideWith(otherObje) {
  //default do nothing
}

MovingObject.prototype.draw = function draw(ctx) {
  ctx.fillStyle = this.color;

  ctx.beginPath();
  ctx.arc(
    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
  );
  ctx.fill();
};

MovingObject.prototype.isCollidedWith = function isCollidedWith(otherObje) {
  let minDist = this.radius + otherObje.radius;
  let distance = Util.dist(this.pos, otherObje.pos);

  return distance < minDist;
};

MovingObject.prototype.isWrappable = true;

MovingObject.prototype.move = function move() {

  const offsetX = this.vel[0];
  const offsetY = this.vel[1];

  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
  
  if (this.game.isOutOfBounds(this.pos)) {
    if (this.isWrappable) {
      this.pos = this.game.wrap(this.pos);
    } else {
      this.remove();
    }
  }
};

MovingObject.prototype.remove = function remove() {
  this.game.remove(this);
};


module.exports = MovingObject;



/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const MovingObject = __webpack_require__(1);
const Bullet = __webpack_require__(7);


const SHIP = {
  COLOR: "purple",
  RADIUS: 7,
  VELOCITY: [0,0]
};

function Ship (options) {
  options.radius = Ship.RADIUS;
  options.vel = options.vel || SHIP.VELOCITY;
  options.color = SHIP.COLOR;

  MovingObject.call(this, options);
}

Ship.RADIUS = 15;

Util.inherits(Ship, MovingObject);

Ship.prototype.relocate = function relocate() {
  this.pos = this.game.randomPosition();
  this.vel = SHIP.VELOCITY;
};

Ship.prototype.power = function power(impulse) {
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];
};

Ship.prototype.fireBullet = function fireBullet() {
  // This ensures that you can't fire bullets if you're not moving - That would be too easy!!
  if (this.vel === [0, 0]) {
    return;
  } 

  //This is the normalized direction of the current Ship's velocity
  const dir = Util.dir(this.vel);

  // This is the relative velocity of the bullet
  const relVel = Util.scale(dir, Bullet.SPEED);

  // This adds the relative velocity of the bullet to the velocity of the ship;
  const bulletVel = [
    relVel[0] + this.vel[0],
    relVel[1] + this.vel[1]
  ];

  // create new Bullet
  const bullet = new Bullet({ 
    pos: this.pos, 
    vel: bulletVel, 
    color: this.color, 
    game: this.game 
  });

  //add bullet to an array of Game bullets:
  this.game.add(bullet);

}



module.exports = Ship;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(4);
const GameView = __webpack_require__(6);


document.addEventListener("DOMContentLoaded", function () {
  const canvasEl = document.getElementById("game-canvas");
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  const ctx = canvasEl.getContext("2d");
  const game = new Game();
  new GameView(game, ctx).start();
});








/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const Asteroid = __webpack_require__(5);
const Util = __webpack_require__(0);
const Ship = __webpack_require__(2);
const Bullet = __webpack_require__(7);

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





/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const MovingObject = __webpack_require__(1);
const Ship = __webpack_require__(2);
const Bullet = __webpack_require__(7);


const DEFAULTS = {
  COLOR: "gray",
  RADIUS: 25,
  SPEED: 5
};

function Asteroid(options) {
  options = options || {};
  options.color = DEFAULTS.COLOR;
  options.pos = options.pos || options.game.randomPosition();
  options.radius = DEFAULTS.RADIUS;
  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);

  MovingObject.call(this, options);
};

// Must inherit before adding functions
Util.inherits(Asteroid, MovingObject);


Asteroid.prototype.collideWith = function collideWith(otherObject) {
  if (otherObject instanceof Ship) {
    otherObject.relocate();
    return true;
  } else if (otherObject instanceof Bullet) {
    this.game.remove(otherObject);
    this.game.remove(this);
  }

  return false;
};

module.exports = Asteroid;

/***/ }),
/* 6 */
/***/ (function(module, exports) {


// This file will be in charge of:
  // 1) Keeping track of the Canvas context (ctx), the game, and the ship
  // 2) Setting an interval to animate your game
  // 3) Eventually, bind key handlers to the ship so we can move it around


function GameView(game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.ship = this.game.addShip();
};

GameView.MOVES = {
  w: [0, -1],
  a: [-1, 0],
  s: [0, 1],
  d: [1, 0]
};

GameView.prototype.bindKeyHandlers = function bindKeyHandlers() {
  const ship = this.ship;


  // Iterate through the array of keys in the MOVES key-value pairs:
  Object.keys(GameView.MOVES).forEach((k) => {
    // declare const that is a 2 el array to pass to Ship.prototype.power
    const move = GameView.MOVES[k];

    // Define key shortcut from global method "key"
    key(k, function () { ship.power(move); });
  });

  key("space", function () { ship.fireBullet(); });

}

GameView.prototype.start = function start() {
  this.bindKeyHandlers();
  setInterval(this.game.step.bind(this.game), 20);
  setInterval(() => this.game.draw(this.ctx), 20);
}


module.exports = GameView;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const MovingObject = __webpack_require__(1);

function Bullet(options) {
  options.radius = Bullet.RADIUS;

  MovingObject.call(this, options);
}

Bullet.RADIUS = 20;
Bullet.SPEED = 15;

Util.inherits(Bullet, MovingObject);


Bullet.prototype.collideWith = function collideWith(otherObject) {
  //default do nothing
}

Bullet.prototype.isWrappable = false;

module.exports = Bullet;

/***/ })
/******/ ]);