const Util = require("./util");


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

