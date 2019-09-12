/**
 * Toolbar should edit the score
 */
class Toolbar {
    constructor () {
        this.scoreElement = document.getElementById('score');
        this.scoreElement.innerHTML = '0';
    }

    incrementScore () {
        this.scoreElement.innerHTML = parseInt(this.scoreElement.innerText) + 1;
    }
}

export default Toolbar;