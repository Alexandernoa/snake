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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

function App() {
  this.initApp();
  this.drawCanvasGrid();
  this.getRandomDirection();
  var position = this.getStartPosition(5);
  this.createChunks(position);
  this.move();
  this.drawLostChunk();
}

App.prototype.initApp = function () {
  this.initSettings();
  this.initEvents();
  this.initCanvas();
  this.initSnake();
  this.initTarget();
  this.initToolbar();
};

App.prototype.initSettings = function () {
  this.canvas = document.getElementById('canvas');
  this.snake = document.getElementById('snake');
  this.target = document.getElementById('target');
  this.scoreElement = document.getElementById('score');
  this.settings = {
    canvasWidth: 400,
    canvasHeight: 400,
    borderColor: 'rgb(156, 156, 156)',
    gridColor: 'rgba(0, 0, 0, .4)',
    gridSize: 20,
    steps: [],
    snake: {
      direction: 'up',
      chunks: [],
      speed: 5,
      color: 'rgba(121, 169, 26, .7)'
    },
    lostChunk: {
      position: {
        x: 0,
        y: 0
      },
      color: 'rgba(82, 113, 20, 0.7)'
    }
  };
};

App.prototype.initCanvas = function () {
  this.canvas.setAttribute('width', this.settings.canvasWidth + 1 + 'px');
  this.canvas.setAttribute('height', this.settings.canvasHeight + 1 + 'px');

  if (!this.canvas.getContext) {
    alert('Canvas is not supported');
    return false;
  }

  this.ctx = this.canvas.getContext('2d');
};

App.prototype.initSnake = function () {
  this.snake.setAttribute('width', this.settings.canvasWidth + 1 + 'px');
  this.snake.setAttribute('height', this.settings.canvasHeight + 1 + 'px');
  this.snakeCtx = this.snake.getContext('2d');
};

App.prototype.initTarget = function () {
  this.target.setAttribute('width', this.settings.canvasWidth + 1 + 'px');
  this.target.setAttribute('height', this.settings.canvasHeight + 1 + 'px');
  this.targetCtx = this.snake.getContext('2d');
};

App.prototype.initToolbar = function () {
  this.scoreElement.innerHTML = 0;
};

App.prototype.incrementScore = function () {
  var score = parseInt(this.scoreElement.innerHTML) + 1;
  this.scoreElement.innerHTML = score;
};

App.prototype.incrementSpeed = function () {
  this.settings.snake.speed += 0.5;
};

App.prototype.initEvents = function () {
  window.addEventListener('keydown', this.keyDownListener.bind(this));
};

App.prototype.keyDownListener = function (e) {
  switch (e.keyCode) {
    case 37:
      if (this.settings.snake.direction === 'right') return false;
      this.settings.snake.direction = 'left';
      break;

    case 38:
      if (this.settings.snake.direction === 'down') return false;
      this.settings.snake.direction = 'up';
      break;

    case 39:
      if (this.settings.snake.direction === 'left') return false;
      this.settings.snake.direction = 'right';
      break;

    case 40:
      if (this.settings.snake.direction === 'up') return false;
      this.settings.snake.direction = 'down';
      break;
  }
};

App.prototype.drawCanvasGrid = function () {
  function drawVerticalLine(x) {
    this.ctx.moveTo(x, 0);
    this.ctx.lineTo(x, this.settings.canvasHeight + 0.5);
  }

  function drawHorizontalLine(y) {
    this.ctx.moveTo(0, y);
    this.ctx.lineTo(this.settings.canvasWidth + 0.5, y);
  }

  var iEqual = this.settings.canvasWidth - this.settings.gridSize;

  for (var i = this.settings.gridSize; i <= iEqual; i += this.settings.gridSize) {
    drawVerticalLine.call(this, i + 0.5);
    drawHorizontalLine.call(this, i + 0.5);
    this.ctx.strokeStyle = this.settings.gridColor;
    this.ctx.stroke();
  }
};

App.prototype.createChunks = function (position) {
  var verticalDirection = this.isVerticalDirection();

  for (var i = 0; i < 2; i++) {
    var x = position.x;
    var y = position.y;

    if (verticalDirection) {
      y -= i * this.settings.gridSize;
    } else {
      x -= i * this.settings.gridSize;
    }

    this.settings.snake.chunks.push({
      x: x,
      y: y
    });
  }
};

App.prototype.updateChunks = function () {
  var head = Object.assign({}, this.settings.snake.chunks[0]);
  head = this.chunkPosition(head);
  this.isGameOver(head);
  var chunks = [head];
  var chunkLength = this.settings.snake.chunks.length;

  for (var i = 1; i < chunkLength; i++) {
    chunks.push(this.settings.snake.chunks[i - 1]);
  }

  this.settings.snake.chunks = chunks;
};

App.prototype.addChunk = function () {
  var preLastChunk = this.settings.snake.chunks[this.settings.snake.chunks.length - 2];
  var lastChunk = this.settings.snake.chunks[this.settings.snake.chunks.length - 1];
  var newChunk = Object.assign({}, lastChunk);
  var verticalDirection = this.isVerticalDirection();

  if (verticalDirection) {
    if (this.settings.snake.direction === 'right') {
      if (lastChunk.x !== preLastChunk.x) {
        newChunk.x -= this.settings.gridSize;
      }
    } else if (this.settings.snake.direction === 'left') {
      if (lastChunk.x !== preLastChunk.x) {
        newChunk.x += this.settings.gridSize;
      }
    } else if (this.settings.snake.direction === 'up') {
      if (lastChunk.y !== preLastChunk.y) {
        newChunk.y += this.settings.gridSize;
      }
    } else if (this.settings.snake.direction === 'down') {
      if (lastChunk.y !== preLastChunk.y) {
        newChunk.y -= this.settings.gridSize;
      }
    }
  } else {
    if (this.settings.snake.direction === 'right') {
      if (lastChunk.x !== preLastChunk.x) {
        newChunk.x -= this.settings.gridSize;
      }
    } else if (this.settings.snake.direction === 'left') {
      if (lastChunk.x !== preLastChunk.x) {
        newChunk.x += this.settings.gridSize;
      }
    } else if (this.settings.snake.direction === 'up') {
      if (lastChunk.y !== preLastChunk.y) {
        newChunk.y -= this.settings.gridSize;
      }
    } else if (this.settings.snake.direction === 'down') {
      if (lastChunk.y !== preLastChunk.y) {
        newChunk.y += this.settings.gridSize;
      }
    }
  }

  this.settings.snake.chunks.push(newChunk);
  this.incrementScore();
  this.incrementSpeed();
};

App.prototype.chunkPosition = function (head) {
  var verticalDirection = this.isVerticalDirection();

  if (verticalDirection) {
    if (['up', 'left'].indexOf(this.settings.snake.direction) >= 0) head.y -= this.settings.gridSize;else head.y += this.settings.gridSize;
  } else {
    if (['up', 'left'].indexOf(this.settings.snake.direction) >= 0) head.x -= this.settings.gridSize;else head.x += this.settings.gridSize;
  }

  return head;
};

App.prototype.gameOver = function () {
  document.querySelector('.game-over').classList.add("active");
  window.removeEventListener('keydown', this.keyDownListener);
};

App.prototype.isGameOver = function (head) {
  if (this.wentAbroad(head) || this.runOverHimself(head)) {
    this.gameOver();
  }
};

App.prototype.wentAbroad = function (head) {
  return head.x < 0 || head.y < 0 || head.x > this.settings.canvasWidth || head.y > this.settings.canvasHeight;
};

App.prototype.runOverHimself = function (head) {
  return false; // return this.settings.snake.chunks.some(function (chunk, i) {
  //   return i > 2 && (chunk.x === head.x && chunk.y === head.y);
  // });
};

App.prototype.move = function () {
  var speed = Math.round(1000 / this.settings.snake.speed);
  this.drawSnake();
  this.searchLostChunk();
  setTimeout(function () {
    window.requestAnimationFrame(this.move.bind(this));
  }.bind(this), speed);
};

App.prototype.searchLostChunk = function () {
  var head = this.settings.snake.chunks[0];
  var lostChunk = this.settings.lostChunk.position;

  if (head.x !== lostChunk.x || head.y !== lostChunk.y) {
    return false;
  }

  this.addChunk();
  this.drawLostChunk();
};

App.prototype.drawSnake = function () {
  var length = this.settings.snake.chunks.length - 1;
  var clearChunk = this.settings.snake.chunks[length];
  var clearSize = this.settings.gridSize + 0.5;
  this.snakeCtx.clearRect(clearChunk.x - 0.2, clearChunk.y - 0.2, clearSize, clearSize);
  this.updateChunks();

  for (var i = 0; i < this.settings.snake.chunks.length; i++) {
    var chunk = this.settings.snake.chunks[i];
    this.snakeCtx.fillStyle = this.settings.snake.color;
    this.snakeCtx.fillRect(chunk.x, chunk.y, this.settings.gridSize, this.settings.gridSize);
  }
};

App.prototype.drawLostChunk = function () {
  this.targetCtx.fillStyle = this.settings.lostChunk.color;
  var size = this.settings.gridSize;
  var position = this.getStartPosition();
  this.settings.lostChunk.position = position;
  var duplicateSnakePosition = this.settings.snake.chunks.some(function (chunk) {
    return chunk.x === position.x && chunk.y === position.y;
  });

  if (duplicateSnakePosition) {
    return this.drawLostChunk();
  }

  this.targetCtx.fillRect(position.x, position.y, size, size);
};

App.prototype.getRandomDirection = function () {
  var directions = ['up', 'down', 'left', 'right'];
  var index = Math.floor(Math.random() * directions.length);
  this.settings.snake.direction = directions[index];
};

App.prototype.isVerticalDirection = function () {
  return ['up', 'down'].indexOf(this.settings.snake.direction) >= 0;
};

App.prototype.getStartPosition = function (outPadding) {
  var padding = this.settings.gridSize * (outPadding || 1);
  var randomX = Math.floor(Math.random() * (this.settings.canvasWidth - padding * 2) + padding);
  randomX = randomX - randomX % this.settings.gridSize;
  var randomY = Math.floor(Math.random() * (this.settings.canvasWidth - padding * 2) + padding);
  randomY = randomY - randomY % this.settings.gridSize; // добавляем по + 0.5, чтобы визуально объект не выходил за рамку

  return {
    x: randomX + 0.5,
    y: randomY + 0.5
  };
};

App.prototype.getNewPosition = function () {
  var verticalDirection = this.isVerticalDirection();
};

function initApp() {
  var app = new App();
}

function reStart() {
  initApp();
  document.querySelector('.game-over').classList.remove("active");
}

initApp();

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map