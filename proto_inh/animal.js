function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function () {
  console.log("mmmm. food...");
};

module.exports = Animal;