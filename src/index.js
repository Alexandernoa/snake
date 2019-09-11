import Snake from './snake';

class App {
    constructor () {
        this.initApp();

        this.drawCanvasGrid();

        this.getRandomDirection();
        const position = this.getStartPosition(5);

        this.createChunks(position);
        this.move();

        this.drawLostChunk();
    }

    initApp () {
        this.initSettings();
        this.initEvents();
        this.initCanvas();
        this.snake = new Snake();
        this.initToolbar();
    }

    initSettings () {
        this.canvas = document.getElementById('canvas');
        this.scoreElement = document.getElementById('score');

        this.settings = {
            canvasWidth: 400,
            canvasHeight: 400,
            borderColor: 'rgb(156, 156, 156)',
            gridColor: 'rgba(0, 0, 0, .4)',
            gridSize: 20,
            steps: [],
            raf: false,
            snake: {
                direction: 'up',
                chunks: [],
                speed: 5,
                color: 'rgba(121, 169, 26, .7)'
            },
            lostChunk: {
                position: { x: 0, y: 0 },
                color: 'rgba(82, 113, 20, 0.7)'
            }
        };
    }

    initCanvas () {
        this.canvas.setAttribute('width', this.settings.canvasWidth + 1 + 'px');
        this.canvas.setAttribute('height', this.settings.canvasHeight + 1 + 'px');

        if (!this.canvas.getContext) {
            alert('Canvas is not supported');
            return false;
        }

        this.ctx = this.canvas.getContext('2d');
    }

    initToolbar () {
        this.scoreElement.innerHTML = 0;
    }

    incrementScore () {
        this.scoreElement.innerHTML = parseInt(this.scoreElement.innerText) + 1;
    }

    incrementSpeed () {
        this.settings.snake.speed += 0.5;
    }

    initEvents () {
        window.addEventListener('keydown', this.keyDownListener.bind(this));
    }

    keyDownListener (e) {
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
    }

    drawCanvasGrid () {
        function drawVerticalLine (x) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.settings.canvasHeight + 0.5);
        }

        function drawHorizontalLine (y) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.settings.canvasWidth + 0.5, y);
        }

        const iEqual = this.settings.canvasWidth - this.settings.gridSize
        for (let i = this.settings.gridSize; i <= iEqual; i += this.settings.gridSize) {
            drawVerticalLine.call(this, i + 0.5);
            drawHorizontalLine.call(this, i + 0.5);
            this.ctx.strokeStyle = this.settings.gridColor;
            this.ctx.stroke();
        }
    }

    createChunks (position) {
        const verticalDirection = this.isVerticalDirection();
        for (let i = 0; i < 2; i++) {
            let x = position.x;
            let y = position.y;
            if (verticalDirection) {
                y -= i * this.settings.gridSize;
            } else {
                x -= i * this.settings.gridSize;
            }
            this.settings.snake.chunks.push({ x: x, y: y })
        }
    }

    updateChunks () {
        let head = { ...this.settings.snake.chunks[0] };
        head = this.chunkPosition(head);
        let chunks = [head];

        const chunkLength = this.settings.snake.chunks.length;
        for (let i = 1; i < chunkLength; i++) {
            chunks.push(this.settings.snake.chunks[i-1]);
        }

        this.settings.snake.chunks = chunks;
    }

    addChunk () {
        const preLastChunk = this.settings.snake.chunks[this.settings.snake.chunks.length - 2];
        const lastChunk = this.settings.snake.chunks[this.settings.snake.chunks.length - 1];
        const newChunk = Object.assign({}, lastChunk);

        const verticalDirection = this.isVerticalDirection();

        if (verticalDirection) {
            if (this.settings.snake.direction === 'right') {
                if (lastChunk.x !== preLastChunk.x) { newChunk.x -= this.settings.gridSize; }
            } else if (this.settings.snake.direction === 'left') {
                if (lastChunk.x !== preLastChunk.x) { newChunk.x += this.settings.gridSize; }
            } else if (this.settings.snake.direction === 'up') {
                if (lastChunk.y !== preLastChunk.y) { newChunk.y += this.settings.gridSize; }
            } else if (this.settings.snake.direction === 'down') {
                if (lastChunk.y !== preLastChunk.y) { newChunk.y -= this.settings.gridSize; }
            }
        } else {
            if (this.settings.snake.direction === 'right') {
                if (lastChunk.x !== preLastChunk.x) { newChunk.x -= this.settings.gridSize; }
            } else if (this.settings.snake.direction === 'left') {
                if (lastChunk.x !== preLastChunk.x) { newChunk.x += this.settings.gridSize; }
            } else if (this.settings.snake.direction === 'up') {
                if (lastChunk.y !== preLastChunk.y) { newChunk.y -= this.settings.gridSize; }
            } else if (this.settings.snake.direction === 'down') {
                if (lastChunk.y !== preLastChunk.y) { newChunk.y += this.settings.gridSize; }
            }
        }

        this.settings.snake.chunks.push(newChunk);
        this.incrementScore();
        this.incrementSpeed();
    }

    chunkPosition (head) {
        const verticalDirection = this.isVerticalDirection();

        if (verticalDirection) {
            if (['up', 'left'].indexOf(this.settings.snake.direction) >= 0)  head.y -= this.settings.gridSize;
            else head.y += this.settings.gridSize;
        } else {
            if (['up', 'left'].indexOf(this.settings.snake.direction) >= 0)  head.x -= this.settings.gridSize;
            else head.x += this.settings.gridSize;
        }

        return head;
    }

    drawSnake () {
        const length = this.settings.snake.chunks.length - 1;
        const clearChunk = this.settings.snake.chunks[length];
        const clearSize = this.settings.gridSize + 0.5;
        this.snake.ctx.clearRect(clearChunk.x - 0.2, clearChunk.y - 0.2, clearSize, clearSize);

        this.updateChunks();

        for (let i = 0; i < this.settings.snake.chunks.length; i++) {
            const chunk = this.settings.snake.chunks[i];
            this.snake.ctx.fillStyle = this.settings.snake.color;
            this.snake.ctx.fillRect(chunk.x, chunk.y, this.settings.gridSize, this.settings.gridSize);
        }
    }

    drawLostChunk () {
        this.snake.ctx.fillStyle = this.settings.lostChunk.color;
        const size = this.settings.gridSize;
        const position = this.getStartPosition();
        this.settings.lostChunk.position = position;

        const duplicateSnakePosition = this.settings.snake.chunks.some(function (chunk) {
            return chunk.x === position.x && chunk.y === position.y;
        });

        if (duplicateSnakePosition) {
            return this.drawLostChunk();
        }

        this.snake.ctx.fillRect(position.x, position.y, size, size);
    }

    move () {
        if (this.isGameOver()) return false;

        this.drawSnake();
        this.searchLostChunk();

        const speed = 1000 / this.settings.snake.speed;

        setTimeout((function() {
            this.settings.raf = window.requestAnimationFrame(this.move.bind(this));
        }).bind(this), speed);
    }

    searchLostChunk () {
        const head = this.settings.snake.chunks[0];
        const lostChunk = this.settings.lostChunk.position;
        if (head.x !== lostChunk.x || head.y !== lostChunk.y) {
            return false;
        }
        this.addChunk();
        this.drawLostChunk();
    }

    getRandomDirection () {        const directions = ['up', 'down', 'left', 'right'];
        const index = Math.floor(Math.random() * directions.length);
        this.settings.snake.direction = directions[index]
    }

    isVerticalDirection () {
        return ['up', 'down'].indexOf(this.settings.snake.direction) >= 0;
    }

    getStartPosition (outPadding) {
        const padding = this.settings.gridSize * (outPadding || 1);
        let randomX = Math.floor(Math.random() * (this.settings.canvasWidth - padding * 2) + padding);
        randomX = randomX - (randomX % this.settings.gridSize);

        let randomY = Math.floor(Math.random() * (this.settings.canvasWidth - padding * 2) + padding);
        randomY = randomY - (randomY % this.settings.gridSize);

        // добавляем по + 0.5, чтобы визуально объект не выходил за рамку
        return {
            x: randomX + 0.5,
            y: randomY + 0.5
        }
    }

    gameOver () {
        document.querySelector('.game-over').classList.add("active");
        window.removeEventListener('keydown', this.keyDownListener);
        window.cancelAnimationFrame(this.settings.raf);
    }

    isGameOver () {
        const head = this.settings.snake.chunks[0];
        if (this.wentAbroad(head) || this.runOverHimself(head)) {
            this.gameOver();
            return true;
        }
    }

    wentAbroad (head) {
        return head.x < 0 || head.y < 0 || head.x > this.settings.canvasWidth || head.y > this.settings.canvasHeight;
    }

    runOverHimself (head) {
        return false;
        // return this.settings.snake.chunks.some(function (chunk, i) {
        //   return i > 2 && (chunk.x === head.x && chunk.y === head.y);
        // });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let app;

    const gameStart = document.querySelector('.game-start');
    gameStart.addEventListener('click',() => {
        gameStart.classList.add("hide");
        app = new App();
    });

    const gameOver = document.querySelector('.game-over');
    gameOver.addEventListener('click',() => {
        gameOver.classList.remove("active");
        gameStart.click();
    });
});
