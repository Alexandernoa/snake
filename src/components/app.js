import Core from './core';
import Canvas from "./canvas";
import Snake from './snake';
import Toolbar from './toolbar';
import GameOver from './game-over';

class App extends Core {
    constructor () {
        super();
        this.init();
    }

    /**
     * Initialize general components
     */
    init () {
        this.canvas = new Canvas();
        const isSupported = this.canvas.isCanvasSupported();
        if (!isSupported) {
            return alert('Canvas is not supported');
        }

        this.canvas.drawGrid();

        this.toolbar = new Toolbar();
        this.gameOver = new GameOver();

        this.snake = new Snake();
        this.snake.drawSnake();
        this.snake.drawTarget();
        this.move();
    }

    /**
     * Method invoked for move snake on a grid
     * Every step we must:
     * Check, if current position is successful or not
     * Check, did we found a target
     * Call next render
     * @returns {boolean}
     */
    move () {
        this.snake.drawSnake();

        const isGameOver = this.gameOver.isGameOver(this.snake.chunks[0])
        if (isGameOver) {
            this.wasted();
            return false;
        }

        const foundTarget = this.snake.searchTarget();
        if (foundTarget) {
            this.toolbar.incrementScore();
        }

        setTimeout(() => {
            this.raf = window.requestAnimationFrame(this.move.bind(this));
        }, (1000 / this.snake.speed));
    }

    /**
     * Method invoked when game is over
     * Show game over label
     * Delete existing listeners
     * Cancel from animation loop
     */
    wasted () {
        document.querySelector('.game-over').classList.add("active");
        this.snake.removeEventListeners();
        window.cancelAnimationFrame(this.raf);
    }
}

export default App;