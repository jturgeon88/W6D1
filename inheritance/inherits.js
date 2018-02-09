Function.prototype.inherits1 = function(parent) {
  function Surrogate () {};
  Surrogate.prototype = parent.prototype;

  this.prototype = new Surrogate();
  this.prototype.constructor = this;

}


Function.prototype.inherits2 = function(parent) {

  this.prototype = Object.create(parent.prototype)
  this.prototype.constructor = this;

}

function MovingObject (name) {
  this.name = name;
}

MovingObject.prototype.crash = function () {
  console.log(`${this.name} goes Crrannchhshdhfpwj;sadjk!!`);
}

function Ship (name) {
  this.name = name;

}
Ship.inherits2(MovingObject);

Ship.prototype.wingSound = function () {
  console.log("Wooooshhh!");
}



function Asteroid (name) {
  this.name = name;
}
Asteroid.inherits2(MovingObject);

Asteroid.prototype.tumble = function () {
  console.log("tumble");
}

let shipper = new Ship("shipper");
let Asterid = new Asteroid("Asterid");
let moby = new MovingObject("moby");

shipper.crash();
Asterid.crash();
moby.crash();