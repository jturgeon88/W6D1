// sum

function sum(arg1, arg2) {
  let sum = 0;

  for (let i = 0; i < arguments.length; i++) {
    sum += arguments[i];
  }

  return sum;
}

// console.log(sum(1, 2, 3, 4));
// console.log(sum(1, 2, 3, 4, 5));

function sum2(...nums) {
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
  }

  return sum;
}

// console.log(sum2(1, 2, 3, 4));
// console.log(sum2(1, 2, 3, 4, 5));


// bind with args:

Function.prototype.myBind1 = function (ctx) {
  const fn = this;
  const bindArgs = Array.from(arguments).slice(1);
  return function _boundFn() {
    const callArgs = Array.from(arguments);
    return fn.apply(ctx, bindArgs.concat(callArgs));
  };
};

Function.prototype.myBind2 = function (ctx, ...bindArgs) {
  return (...callArgs) => this.apply(ctx, bindArgs.concat(callArgs));
};

class Cat {
  constructor(name) {
    this.name = name;
  }

  says(sound, person) {
    console.log(`${this.name} says ${sound} to ${person}!`);
    return true;
  }
}

const markov = new Cat("Markov");
const breakfast = new Cat("Breakfast");

// markov.says("meow", "Ned");

markov.says.myBind2(breakfast, "meow", "Kush");



//curriedSum

function curriedSum(numArgs) {
  //define empty array 
  const result = [];

  // define a function _curriedsum 
  function _curriedSum(num) {
    result.push(num)
    if (result.length === numArgs) {
      let total = 0;

      result.forEach((n) => { total += n });

      return total;
    } else {
      return _curriedSum;
    }
  }

  return _curriedSum;
}



let summer = curriedSum(4);



Function.prototype.curry = function(numArgs) {
  const args = [];
  const fn = this;

  function _curriedFn(arg) {
    args.push(arg);

    if (args.length === numArgs) {
      return fn(...args);
    } else {
      return _curriedFn;
    }
  }

  return _curriedFn;
}

Function.prototype.curry1 = function(numArgs) {
  const args = [];
  const fn = this;

  function _curriedFn(arg) {
    args.push(arg);
    if (args.length = numArgs) {
      return fn.apply(null, args);
    } else {
      return _curriedFn;
    }
  }

  return _curriedFn;
}







