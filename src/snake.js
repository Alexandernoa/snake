import Core from './core';

class Snake extends Core {
    constructor () {
        super();
        this.canvas = document.getElementById('snake');
        this.canvas.setAttribute('width', this.canvasWidth + 1 + 'px');
        this.canvas.setAttribute('height', this.canvasHeight + 1 + 'px');
        this.ctx = this.canvas.getContext('2d');
    }
}

export default Snake;