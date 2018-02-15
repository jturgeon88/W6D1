const Util = require("./util");
const MovingObject = require("./moving_object");

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