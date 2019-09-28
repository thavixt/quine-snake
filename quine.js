(function main() {
    const W = 70;
    const SRC = `(${main.toString()}());`.replace(/(\r\n|\n|\r|\t)/gm, '').replace(/\s\s+/g, ' ');
    const SRC_ARR = (() => SRC.match(new RegExp(`.{1,${W}}`, 'g')).map(line => {
        const chars = line.split('').map(char => {
            const span = document.createElement('pre');
            span.appendChild(document.createTextNode(char));
            return span;
        });
        const codeLine = document.createElement('code');
        chars.forEach(char => codeLine.appendChild(char));
        return codeLine;
    }))();

    let APPLE = randomPos();
    const SNAKE = randomPos();
    SNAKE.xVel = 1;
    SNAKE.yVel = 0;
    const SNAKE_HISTORY = [SNAKE];
    const ROOT = document.createElement('div');
    ROOT.classList.add('quine');
    document.body.appendChild(ROOT);

    document.onkeydown = function(e) {
        e = e || window.event;
        SRC_ARR[SNAKE.y].children[SNAKE.x].classList.remove('snake');
        switch (e.keyCode) {
            case 37: case 65:
                SNAKE.xVel = -1;
                SNAKE.yVel = 0;
                break;
            case 38: case 87:
                SNAKE.xVel = 0;
                SNAKE.yVel = -1;
                break;
            case 39: case 68:
                SNAKE.xVel = 1;
                SNAKE.yVel = 0;
                break;
            case 40: case 83:
                SNAKE.xVel = 0;
                SNAKE.yVel = 1;
                break;
            default:
                return;
        }
    };

    function randomPos() {
        return {
            x: (Math.random() * (W - 1)) | 0,
            y: (Math.random() * (SRC_ARR.length - 1)) | 0,
        };
    };

    function setColors() {
        SNAKE_HISTORY.forEach(snake => SRC_ARR[snake.y].children[snake.x].classList.add('snake'));
        SRC_ARR[SNAKE.y].children[SNAKE.x].classList.add('snake');
        SRC_ARR[APPLE.y].children[APPLE.x].classList.add('apple');
    }

    function setSnakeHistory(x, y, pop = true) {
        SNAKE_HISTORY.push({ x, y });
        SNAKE_HISTORY.forEach(snake => SRC_ARR[snake.y].children[snake.x].classList.remove('snake'))
        !pop && SNAKE_HISTORY.shift();
    }

    function loop() {
        ROOT.innerHTML = '';
        SRC_ARR.forEach(line => ROOT.appendChild(line));

        SNAKE.x += SNAKE.xVel;
        SNAKE.y += SNAKE.yVel;

        let hit = SNAKE.x === APPLE.x && SNAKE.y === APPLE.y;
        if (hit) {
            SRC_ARR[APPLE.y].children[APPLE.x].classList.remove('apple');
            APPLE = randomPos();
        }
        setSnakeHistory(SNAKE.x, SNAKE.y, hit);
        setColors();

        window.requestAnimationFrame(loop);
    }

    loop();

    // a padding comment
}());
