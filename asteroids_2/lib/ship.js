const Util = require("./util");
const MovingObject = require("./moving_object");
const Bullet = require("./bullet.js");


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