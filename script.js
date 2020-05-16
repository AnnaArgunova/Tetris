
const scoreElem = document.querySelector("#score");
const levelElem = document.querySelector("#level");
let main = document.querySelector(".main");
let nextTetroElem = document.querySelector('.next_tetro');
let start = document.querySelector('#start');
let pause = document.querySelector('#pause');
let gameOver = document.querySelector('.game_over');

//let playfield = Array(20).fill(Array(10).fill(0));
let playfield = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]
console.log(playfield);

let score = 0;
let gameTimerID;

let currentLevel = 1;
let isPause = true;
let possibleLevels = {
    1: {
        scorePerLine: 10,
        speed: 400,
        nextLevelScore: 20,
    },
    2: {
        scorePerLine: 50,
        speed: 300,
        nextLevelScore: 500,
    },
    3: {
        scorePerLine: 150,
        speed: 250,
        nextLevelScore: 1000,
    },
    4: {
        scorePerLine: 250,
        speed: 200,
        nextLevelScore: 200,
    },
    5: {
        scorePerLine: 350,
        speed: 150,
        nextLevelScore: Infinity,
    },
};


figures = {
    O: [
        [1, 1],
        [1, 1],
    ],
    I: [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    L: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    J: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    T: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
    ]
}

let activeTetro = getNewTetro();
let nextTetro = getNewTetro();

function draw() {
    let mainInnerHtml = '';
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                mainInnerHtml += '<div class = "cell moving_cell"></div>';
            } else if (playfield[y][x] === 2) {
                mainInnerHtml += '<div class = "cell fix_cell"></div>';
            } else {
                mainInnerHtml += '<div class = "cell"></div>'
            }
        }
    }
    main.innerHTML = mainInnerHtml;
}

function drawNextTetro() {
    let nextTetroInnerHtml = '';
    for (let y = 0; y < nextTetro.shape.length; y++) {
        for (let x = 0; x < nextTetro.shape[y].length; x++) {
            if (nextTetro.shape[y][x] === 1) {
                nextTetroInnerHtml += '<div class = "cell moving_cell"></div>';
            } else if (nextTetro.shape[y][x] === 0) {
                nextTetroInnerHtml += '<div></div>'
            }

        }
        nextTetroInnerHtml += '<br/>'
    }
    nextTetroElem.innerHTML = nextTetroInnerHtml;
}

function removePrevActiveTetro() {
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                playfield[y][x] = 0;
            }
        }
    }
}

function updateActiveTetro() {
    removePrevActiveTetro();
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if (activeTetro.shape[y][x]) {
                playfield[activeTetro.y + y][activeTetro.x + x] = activeTetro.shape[y][x];
            }
        }
    }
}

function hasCollisions() {
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if (activeTetro.shape[y][x] &&
                (playfield[activeTetro.y + y] === undefined ||
                    playfield[activeTetro.y + y][activeTetro.x + x] === undefined ||
                    playfield[activeTetro.y + y][activeTetro.x + x] === 2)) {
                return true;
            }
        }
    }
    return false;
}

function rotateTetro() {
    const prevTetroSate = activeTetro.shape;
    activeTetro.shape = activeTetro.shape[0].map((val, index) =>
        activeTetro.shape.map((row) => row[index]).reverse()
    );
    if (hasCollisions()) {
        activeTetro.shape = prevTetroSate;
    }
}

function getNewTetro() {
    const possibleFigures = 'IOLJTSZ';
    const random = Math.floor(Math.random() * 7);
    const newTetro = figures[possibleFigures[random]];
    // return figures[possibleFigures[random]];
    return {
        x: Math.floor((10 - newTetro[0].length) / 2),
        y: 0,
        shape: newTetro,
    }
}

//remove full line

function deleteFullLine() {
    let canDeleteFullLine = true,
        filledLines = 0;
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] !== 2) {
                canDeleteFullLine = false;
                break;
            }
        }
        if (canDeleteFullLine) {
            playfield.splice(y, 1);
            playfield.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            filledLines += 1;
        }
        canDeleteFullLine = true;
    }
    switch (filledLines) {
        case 1:
            score += possibleLevels[currentLevel].scorePerLine;
            break;
        case 2:
            score += possibleLevels[currentLevel].scorePerLine * 3;
            break;
        case 3:
            score += possibleLevels[currentLevel].scorePerLine * 6;
            break;
        case 4:
            score += possibleLevels[currentLevel].scorePerLine * 12;
            break;

        default:
            break;
    }
    scoreElem.innerHTML = score;
    if (score >= possibleLevels[currentLevel].nextLevelScore) {
        currentLevel++;
        levelElem.innerHTML = currentLevel;
    }
}
deleteFullLine();

//fixed tetro

function fixTetro() {
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                playfield[y][x] = 2;
            }
        }
    }
}

function moveTetroDown() {
    if (!isPause) {
        activeTetro.y += 1;
        if (hasCollisions()) {
            activeTetro.y -= 1;
            fixTetro();
            deleteFullLine();
            activeTetro = nextTetro;
            if (hasCollisions()) {
                reset();
            }
            nextTetro = getNewTetro();
        }
    }

}

function reset(){
    isPause = true;
    clearTimeout(gameTimerID);
     playfield = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
    draw();
    gameOver.style.display = 'block';
}

function dropTetro() {
    for (let y = activeTetro.y; y < playfield.length; y++) {
        activeTetro.y += 1;
        if (hasCollisions()) {
            activeTetro.y -= 1;
            break;
        }
    }
}

document.onkeydown = function (e) {
    if (!isPause) {
        if (e.keyCode === 39) {
            activeTetro.x += 1;
            if (hasCollisions()) {
                activeTetro.x -= 1;
            }
        } else if (e.keyCode === 37) {
            activeTetro.x -= 1;
            if (hasCollisions()) {
                activeTetro.x += 1;
            }
        } else if (e.keyCode === 40) {
            moveTetroDown();
        } else if (e.keyCode === 38) {
            rotateTetro();
        } else if (e.keyCode === 32) {
            dropTetro();
        }

       updateGameStart();
    }
};

function updateGameStart(){
    if(!isPause){
    updateActiveTetro();
    draw();
    drawNextTetro();
    }
}

pause.addEventListener('click', (e) => {
    if (e.target.innerHTML === 'Pause') {
        e.target.innerHTML = 'Play';
clearTimeout(gameTimerID);
    } else {
        e.target.innerHTML = 'Pause';

    }
    isPause = !isPause;

});

start.addEventListener('click', (e)=>{
    e.target.innerHTML = 'Start Again';
    isPause = false;
gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed);
gameOver.style.display = 'none';

});


 draw();
drawNextTetro();

function startGame() {
   
    moveTetroDown();
    if(!isPause){
    updateGameStart();
    
   gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed);
}
}


