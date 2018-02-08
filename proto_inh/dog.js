var Animal = require("./animal.js");

function Dog(name) {
  this.name = name;
};

// var Surrogate = function(){};
// Surrogate.prototype = Animal.prototype;

Dog.prototype = Animal.prototype;
Dog.prototype.woof = function() {
  console.log("woof, I am. " + this.name);
};

module.exports = Dog;

d = new Dog('fido');
// console.log(d.__proto__.__proto__.hasOwnProperty("eat"));
console.log(Animal.prototype.hasOwnProperty("woof"));