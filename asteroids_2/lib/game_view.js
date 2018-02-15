
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