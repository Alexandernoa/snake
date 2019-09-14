import Core from './core';

/**
 * Snake class is responsible for draw and manipulate of snake object
 */
class Snake extends Core {
    constructor () {
        super();
        this.canvas = document.getElementById('snake');
        this.canvas.setAttribute('width', this.canvasWidth + 1 + 'px');
        this.canvas.setAttribute('height', this.canvasHeight + 1 + 'px');
        this.ctx = this.canvas.getContext('2d');

        this.direction = 'up';
        this.chunks = [];
        this.speed = 5;
        this.color = 'rgba(121, 169, 26, .7)';

        this.targetColor = 'rgba(82, 113, 20, 0.7)';
        this.targetPosition = { x: 0, y: 0 };

        this.getRandomDirection();

        this.createChunks(2);

        this.initEvents();
    }

    /**
     * Render snake
     * Before each render, clearing last chunk of snake on canvas and update array with all chunks
     */
    drawSnake () {
        const length = this.chunks.length - 1;
        const clearChunk = this.chunks[length];
        const clearSize = this.gridSize + 0.5;
        this.ctx.clearRect(clearChunk.x - 0.2, clearChunk.y - 0.2, clearSize, clearSize);

        this.updateChunks();

        for (let i = 0; i < this.chunks.length; i++) {
            const chunk = this.chunks[i];
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(chunk.x, chunk.y, this.gridSize, this.gridSize);
        }
    }

    /**
     * Creating array which contain an objects with position of each chunk
     * Get snake position with offset of 5 squares from border
     * Determine the current moving direction
     * @param chunksLength {Number} - default snake length
     */
    createChunks (chunksLength) {
        const position = this.getStartPosition(5);
        const verticalDirection = this.isVerticalDirection();
        for (let i = 0; i < chunksLength; i++) {
            let x = position.x;
            let y = position.y;
            if (verticalDirection) {
                y -= i * this.gridSize;
            } else {
                x -= i * this.gridSize;
            }
            this.chunks.push({ x: x, y: y })
        }
    }

    /**
     * Updating chunks position
     * All chunks are depends of first chunk which is a snake's head,
     * so we increment the X or Y position of first chunk, and override positions of others
     */
    updateChunks () {
        let head = { ...this.chunks[0] };
        head = this.newChunkPosition(head);
        let chunks = [head];

        const chunkLength = this.chunks.length;
        for (let i = 1; i < chunkLength; i++) {
            chunks.push(this.chunks[i-1]);
        }

        this.chunks = chunks;
    }

    /**
     * Getting new chunk position, which depends of snake direction
     * @param head {Number}
     * @returns {Number}
     */
    newChunkPosition (head) {
        const verticalDirection = this.isVerticalDirection();

        if (verticalDirection) {
            if (['up', 'left'].indexOf(this.direction) >= 0)  head.y -= this.gridSize;
            else head.y += this.gridSize;
        } else {
            if (['up', 'left'].indexOf(this.direction) >= 0)  head.x -= this.gridSize;
            else head.x += this.gridSize;
        }

        return head;
    }

    /**
     * Getting random direction of moving snake
     */
    getRandomDirection () {
        const directions = ['up', 'down', 'left', 'right'];
        const index = Math.floor(Math.random() * directions.length);
        this.direction = directions[index];
    }

    /**
     * Determining, did we caught the target or not
     * If we did:
     * - add new chunk to snake's tail
     * - draw new target
     * - increment snake speed
     * @returns {boolean}
     */
    searchTarget () {
        const head = this.chunks[0];
        if (head.x !== this.targetPosition.x || head.y !== this.targetPosition.y) {
            return false;
        }

        this.addChunk();
        this.drawTarget();
        this.incrementSpeed();

        return true;
    }

    /**
     * Add new chunk to snake tail in right direct
     * To do this, we need to know in what direction we moving and comparing the position of last and penultimate chunk
     */
    addChunk () {
        const preLastChunk = this.chunks[this.chunks.length - 2];
        const lastChunk = this.chunks[this.chunks.length - 1];
        const newChunk = Object.assign({}, lastChunk);

        const verticalDirection = this.isVerticalDirection();

        if (verticalDirection) {
            if (this.direction === 'right') {
                if (lastChunk.x !== preLastChunk.x) { newChunk.x -= this.gridSize; }
            } else if (this.direction === 'left') {
                if (lastChunk.x !== preLastChunk.x) { newChunk.x += this.gridSize; }
            } else if (this.direction === 'up') {
                if (lastChunk.y !== preLastChunk.y) { newChunk.y += this.gridSize; }
            } else if (this.direction === 'down') {
                if (lastChunk.y !== preLastChunk.y) { newChunk.y -= this.gridSize; }
            }
        } else {
            if (this.direction === 'right') {
                if (lastChunk.x !== preLastChunk.x) { newChunk.x -= this.gridSize; }
            } else if (this.direction === 'left') {
                if (lastChunk.x !== preLastChunk.x) { newChunk.x += this.gridSize; }
            } else if (this.direction === 'up') {
                if (lastChunk.y !== preLastChunk.y) { newChunk.y -= this.gridSize; }
            } else if (this.direction === 'down') {
                if (lastChunk.y !== preLastChunk.y) { newChunk.y += this.gridSize; }
            }
        }

        this.chunks.push(newChunk);
    }

    /**
     * Draw a target which the snake should catch
     * To do this, create a random position on the canvas
     * And if position of target is not duplicate on of the snake positions, do it.
     * If not, recall method again
     * @returns {*}
     */
    drawTarget () {
        this.targetPosition = this.getStartPosition(1);

        const duplicatePosition = this.chunks.some(chunk => {
            return chunk.x === this.targetPosition.x && chunk.y === this.targetPosition.y;
        });

        if (duplicatePosition) {
            return this.drawTarget();
        }

        this.ctx.fillStyle = this.targetColor;
        this.ctx.fillRect(this.targetPosition.x, this.targetPosition.y, this.gridSize, this.gridSize);
    }

    /**
     * Simplicity in determining the direction
     * @returns {boolean}
     */
    isVerticalDirection () {
        return ['up', 'down'].indexOf(this.direction) >= 0;
    }

    /**
     * Increment speed
     */
    incrementSpeed () {
        this.speed += 0.5;
    }

    /**
     * Creating start position
     * @param outPadding
     * @returns {{x: number, y: number}}
     */
    getStartPosition (outPadding) {
        const padding = this.gridSize * outPadding;
        let randomX = Math.floor(Math.random() * (this.canvasWidth - padding * 2) + padding);
        randomX = randomX - (randomX % this.gridSize);

        let randomY = Math.floor(Math.random() * (this.canvasWidth - padding * 2) + padding);
        randomY = randomY - (randomY % this.gridSize);

        // добавляем по + 0.5, чтобы визуально объект не выходил за рамку
        return {
            x: randomX + 0.5,
            y: randomY + 0.5
        }
    }

    /**
     * Initialize events for desktop and mobile devices
     */
    initEvents () {
        this.keyDownHandler = this.keyDownListener.bind(this);
        document.addEventListener('keydown', this.keyDownHandler);

        if (window.innerWidth) {
            this.btnLeft = document.querySelector('.btn-left');
            this.btnLeftHandler = this.goLeft.bind(this);
            this.btnLeft.addEventListener('click', this.btnLeftHandler);

            this.btnUp = document.querySelector('.btn-up');
            this.btnUpHandler = this.goUp.bind(this);
            this.btnUp.addEventListener('click', this.btnUpHandler);

            this.btnRight = document.querySelector('.btn-right');
            this.btnRightHandler = this.goRight.bind(this);
            this.btnRight.addEventListener('click', this.btnRightHandler);

            this.btnDown = document.querySelector('.btn-down');
            this.btnDownHandler = this.goLeft.bind(this);
            this.btnDown.addEventListener('click', this.btnDownHandler);
        }
    }

    /**
     * Changing direction by press buttons
     * @param e
     * @returns {boolean}
     */
    keyDownListener (e) {
        switch (e.which) {
            case 37: return this.goLeft();
            case 38: return this.goUp();
            case 39: return this.goRight();
            case 40: return this.goDown();
        }
    }

    /**
     * Changing the direction to left
     */
    goLeft () {
        if (this.direction === 'right') return false;
        this.direction = 'left';
    }

    /**
     * Changing the direction to down
     */
    goUp () {
        if (this.direction === 'down') return false;
        this.direction = 'up';
    }

    /**
     * Changing the direction to left
     */
    goRight () {
        if (this.direction === 'left') return false;
        this.direction = 'right';
    }

    /**
     * Changing the direction to up
     */
    goDown () {
        if (this.direction === 'up') return false;
        this.direction = 'down';
    }

    /**
     * Removing all event listeners
     */
    removeEventListeners () {
        document.removeEventListener('keydown', this.keyDownHandler);
        if (window.innerWidth) {
            this.btnLeft.removeEventListener('click', this.btnLeftHandler);
            this.btnUp.removeEventListener('click', this.btnUpHandler);
            this.btnRight.removeEventListener('click', this.btnRightHandler);
            this.btnDown.removeEventListener('click', this.btnDownHandler);
        }
    }
}

export default Snake;