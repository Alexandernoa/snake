import Core from './core';

/**
 * Canvas class creating main canvas
 */
class Canvas extends Core {
    constructor () {
        super();
        this.canvas = document.getElementById('canvas');
        this.canvas.setAttribute('width', this.canvasWidth + 1 + 'px');
        this.canvas.setAttribute('height', this.canvasHeight + 1 + 'px');
        this.ctx = this.canvas.getContext('2d');
    }

    /**
     * Method drawing grid into canvas
     * For each line we should add 0.5 px, it's hack to draw thinner lines
     */
    drawGrid () {
        const drawVerticalLine = x => {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvasHeight + 0.5);
        };

        const drawHorizontalLine = y => {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvasWidth + 0.5, y);
        };

        const iEqual = this.canvasWidth - this.gridSize;
        for (let i = this.gridSize; i <= iEqual; i += this.gridSize) {
            const point = i + 0.5;
            drawVerticalLine(point);
            drawHorizontalLine(point);
            this.ctx.strokeStyle = this.gridColor;
            this.ctx.stroke();
        }
    }

    /**
     * Return, is context of canvas is supported or not
     * @returns {*}
     */
    isCanvasSupported () {
        return this.canvas.getContext;
    }

}

export default Canvas;