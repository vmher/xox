
(function() {
    document.querySelector('.theme').addEventListener('click', e => Game.toggleTheme());
    document.querySelector('.restart').addEventListener('click', e => location.reload());
    var start = document.querySelector('.start');
    start.addEventListener('click', e => {
        start.classList.add('hide');
        Game.drawTable(9);
        Game.handlePlayerClick();
    });
})();

class Game {
    constructor(){}

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
        if (getColor() === darkMain) {
            setColor(lightMain, lightSecondary, lightShadowBig, lightShadowSmall);
        } else {
            setColor(darkMain, darkSecondary, darkShadowBig, darkshadowSmall);
        }
        function setColor(main, secondary, shadowBig, shadowSmall) {
            root.style.setProperty('--main', main);
            root.style.setProperty('--secondary', secondary);
            root.style.setProperty('--shadowBig', shadowBig);
            root.style.setProperty('--shadowSmall', shadowSmall);
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
            cell.addEventListener('click', e => {
                var cellId = cell.getAttribute('id');
                if (this.checkCell(cellId)) {
                    var activePlayer = Player.togglePlayer();
                    clickCounter++;
                    activePlayer.occupyCell(cellId);
                    activePlayer.clickedCells.push(Number(cellId[4]));
                    if (clickCounter > 4) {
                        activePlayer.checkWinner(activePlayer);
                    }
                    if (clickCounter === 9 && !activePlayer.checkWinner(activePlayer)) {
                        this.draw();
                    }
                    if (activePlayer.isWinner) {
                        activePlayer.celebrate(activePlayer);
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
}

class Player {
    constructor (playerId,isActive,clickedCells,isWinner) {
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
        if (playerX.isActive) {
            playerX.isActive = false;
            playerO.isActive = true;
            return playerO;
        } else{
            playerX.isActive = true;
            playerO.isActive = false;
            return playerX;
        }
    }
    winnerCombinations = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];
}

let playerX = new Player('x',false,[],false);
let playerO = new Player('o',true,[],false);

//
//
// change cursor??
// cell hover effect?! for further use with keyboard
// scale for bigger dimensions????
// celebrate?! confetti? scale 'player wins'? strike the winner combination, pulse
// 
// 