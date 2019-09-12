import App from './components/app';

document.addEventListener("DOMContentLoaded", () => {
    let app;

    // Add event listener to "start" button
    const gameStart = document.querySelector('.game-start');
    gameStart.addEventListener('click',() => {
        gameStart.classList.add("hide");
        app = new App();
    });

    // Add event listener to "game over" button
    const gameOver = document.querySelector('.game-over');
    gameOver.addEventListener('click',() => {
        gameOver.classList.remove("active");
        gameStart.click();
    });
});
