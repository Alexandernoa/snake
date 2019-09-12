import Core from "./core";

/**
 * GameOver class is determining methods which contains validation, is game over
 */
class GameOver extends Core {
    /**
     * Check all possible loose events
     * @param head {Object} - first snake's chunk, which contain current position
     * @returns {*|boolean}
     */
    isGameOver (head) {
        return this.wentAbroad(head) || this.runOverHimself(head)
    }

    /**
     * If the snake's head has crossed the border
     * @param head
     * @returns {boolean}
     */
    wentAbroad (head) {
        return head.x < 0 || head.y < 0 || head.x > this.canvasWidth || head.y > this.canvasHeight;
    }

    /**
     * If the snake move over herself
     * @param head
     * @returns {boolean}
     */
    runOverHimself (head) {
        return false;
        // return this.snake.chunks.some(function (chunk, i) {
        //   return i > 2 && (chunk.x === head.x && chunk.y === head.y);
        // });
    }

}

export default GameOver;