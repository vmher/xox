
(function() {
    document.querySelector('.theme').addEventListener('click', e => Game.toggleTheme());
    document.querySelector('.restart').addEventListener('click', e => location.reload());

    document.querySelector('.start').addEventListener('click', e => {
        e.target.classList.add('hide');
        Game.drawTable(9);
        Game.activeCell = document.querySelector('#cell5');
        Game.handlePlayerClick();
    });

    window.addEventListener("keyup", function(event) {
        switch(event.code) {
            case "KeyS":
            case "ArrowDown":
                Game.handleKeyUp('Down');
                break;
            case "KeyW":
            case "ArrowUp":
                Game.handleKeyUp('Up');
                break;
            case "KeyA":
            case "ArrowLeft":
                Game.handleKeyUp('Left');
                break;
            case "KeyD":
            case "ArrowRight":
                Game.handleKeyUp('Right');
                break;
            case "Space":
                Game.handleKeyUp('Space');
                break;
            }
    }, true);

})();

class Game {
    constructor(){}
    activeCell;
    activePlayer;
    static drawTable(dimension) {
        var mainGame = document.getElementById('main-game');
        for (let x = 1; x <= dimension; x++) {
            var cell = document.createElement('div');
            cell.setAttribute('id','cell' + x);
            cell.setAttribute('class','cell');
            mainGame.appendChild(cell);
        }
    }
    static toggleTheme(){
        var root = document.documentElement;
        var lightMain = '#FCECC9';
        var lightSecondary = '#F93943';
        var lightShadowBig = '27px 27px 62px #b0a58d, -27px -27px 62px #fffaef';
        var lightShadowSmall = 'inset 9px 9px 25px #d6c9ab, inset -9px -9px 25px #ffffe7';
        var darkMain = '#2D0320';
        var darkSecondary = '#99D5C9';
        var darkShadowBig = '27px 27px 62px #200216, -27px -27px 62px #3b042a';
        var darkshadowSmall = 'inset 9px 9px 25px #26031b, inset -9px -9px 25px #340325';
        function getColor() {
            var currentColor = window.getComputedStyle(root).getPropertyValue('--main');
            return currentColor;
        }
        function setColor(main, secondary, shadowBig, shadowSmall) {
            root.style.setProperty('--main', main);
            root.style.setProperty('--secondary', secondary);
            root.style.setProperty('--shadowBig', shadowBig);
            root.style.setProperty('--shadowSmall', shadowSmall);
        }
        if (getColor() === darkMain) {
            setColor(lightMain, lightSecondary, lightShadowBig, lightShadowSmall);
        } else {
            setColor(darkMain, darkSecondary, darkShadowBig, darkshadowSmall);
        }
    }
    static checkCell(cellId) {
        if (playerX.clickedCells.includes(Number(cellId[4])) || playerO.clickedCells.includes(Number(cellId[4]))) {
            return false;
        } else return true;
    }
    static draw() {
        var drawMessage = document.createElement('div');
        drawMessage.setAttribute('class','draw-message');
        drawMessage.innerHTML = 'draw';
        document.querySelector('.wrapper').appendChild(drawMessage);
    }
    static handlePlayerClick(){
        var clickCounter = 0;
        document.querySelectorAll('.cell').forEach(cell => {
            
            cell.addEventListener('mouseover', e => {
                this.activeCell.classList.remove('active-cell');
                this.activeCell = cell;
                this.activeCell.classList.add('active-cell');
            });
            
            cell.addEventListener('click', e => {
                var cellId = cell.getAttribute('id');
                if (this.checkCell(cellId)) {
                    this.activePlayer = Player.togglePlayer();
                    clickCounter++;
                    this.activePlayer.occupyCell(cellId);
                    this.activePlayer.clickedCells.push(Number(cellId[4]));
                    if (clickCounter > 4) {
                        this.activePlayer.checkWinner(this.activePlayer);
                    }
                    if (clickCounter === 9 && !this.activePlayer.checkWinner(this.activePlayer)) {
                        this.draw();
                    }
                    if (this.activePlayer.isWinner) {
                        this.activePlayer.celebrate(this.activePlayer);
                    }
                } else {
                    var warnMessage = document.createElement('div');
                    warnMessage.setAttribute('class','warn-message');
                    warnMessage.innerHTML = 'use free cells, please';
                    document.querySelector('.wrapper').appendChild(warnMessage);
                    setTimeout(() => document.querySelector('.wrapper').removeChild(warnMessage), 3000);
                };

            })

        });
    }
    static handleKeyUp(keyCode) {
        if (keyCode === 'Down') {
            this.moveActiveCell(this.activeCell, 'Down');
        } else if (keyCode === 'Up') {
            this.moveActiveCell(this.activeCell, 'Up');
        } else if (keyCode === 'Right') {
            this.moveActiveCell(this.activeCell, 'Right');
        } else if (keyCode === 'Left') {
            this.moveActiveCell(this.activeCell, 'Left');
        } else if (keyCode === 'Space') {
            this.activeCell.click();
        }
    }
    static moveActiveCell(currentCell, direction) {
        this.activeCell.classList.remove('active-cell');
        var activeCellId = currentCell.getAttribute('id');
        activeCellId = Number(activeCellId[4]);
        if (direction === 'Up') {
            if (activeCellId === 1 || activeCellId === 2 || activeCellId === 3) {
                activeCellId += 6;
            } else {
                activeCellId -= 3;
            }
        } else if (direction === 'Down') {
            if (activeCellId === 7 || activeCellId === 8 || activeCellId === 9) {
                activeCellId -= 6;
            } else {
                activeCellId += 3;
            }
        } else if (direction === 'Left') {
            if (activeCellId === 1 || activeCellId === 4 || activeCellId === 7) {
                activeCellId += 2;
            } else {
                activeCellId--;
            }
        } else if (direction === 'Right') {
            if (activeCellId === 9 || activeCellId === 6 || activeCellId === 3) {
                activeCellId -= 2;
            } else{
                activeCellId++;
            }
        }
        this.activeCell = document.querySelector('#cell' + activeCellId);
        this.activeCell.classList.add('active-cell');
    }
}

class Player {
    constructor (playerId, isActive, clickedCells, isWinner) {
        this.playerId = playerId;
        this.isActive = isActive;
        this.clickedCells = clickedCells;
        this.isWinner = isWinner;
    }
    occupyCell (cellId) {
        var mark = document.createElement('div');
        mark.setAttribute('class', this.playerId);
        document.querySelector('#' + cellId).appendChild(mark);
    }
    checkWinner (player) {
        var checker = (array, target) => target.every(v => array.includes(v));
        for (let x = 0; x < this.winnerCombinations.length; x++){
            if(checker(player.clickedCells, this.winnerCombinations[x])){
                player.isWinner = true;
                return true;
            }
        }
        return false;
    }
    celebrate (player) {
        var winnerMessage = document.createElement('div');
        winnerMessage.setAttribute('class','win-message');
        winnerMessage.innerHTML = player.playerId + ' wins !!';
        document.querySelector('.wrapper').appendChild(winnerMessage);
    }
    static togglePlayer() {
        var cells = document.querySelectorAll('.cell');
        if (playerX.isActive) {
            playerX.isActive = false;
            playerO.isActive = true;
            cells.forEach((cell) => cell.style.cursor = 'url(./x.cur), auto');
            return playerO;
        } else{
            playerX.isActive = true;
            playerO.isActive = false;
            cells.forEach((cell) => cell.style.cursor = 'url(./o.cur), auto');
            return playerX;
        }
    }
    winnerCombinations = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];
}

let playerX = new Player('x',false,[],false);
let playerO = new Player('o',true,[],false);


//
//
// celebrate?! confetti? scale 'player wins'? strike the winner combination, pulse, disable controls
// 
// 