//獲取頁面元素
const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const currentStatus = document.getElementById('currentStatus');
const resetButton = document.getElementById('resetButton');
const gameEndOverlay = document.getElementById('gameEndOverlay');
const currentBeastStatusImg = document.getElementById('currentBeastImg');
const winningMessage = document.querySelector('[data-winning-message]');
const winningMessageText = document.querySelector('[data-winning-message]');
const winningMessageImg = document.createElement('img');

//相應玩家的音效
const unicornButtonSound = document.getElementById('unicornSound');
const dragonButtonSound = document.getElementById('dragonSound');

//初始化遊戲狀態
let gameIsLive = true;
let unicornTurn = true;
let winner = null;
//所有獲勝組合
const winnerCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

//設置鼠標懸停時樣式
const setBoardHoverClass = () => {
    board.classList.remove('unicorn');
    board.classList.remove('dragon');
    if(unicornTurn){
        board.classList.add('unicorn');
    }else{
        board.classList.add('dragon');
    }
}

//在格子上放置圖片
const placeBeastImg = (cell, currentBeast) =>{
    cell.classList.add(currentBeast);
}

//切換回合
const swapTurns = () =>{
    unicornTurn = !unicornTurn;
}

//更新當前狀態
const updateCurrentStatus = () => {
    if(unicornTurn){
        currentBeastStatusImg.src = '圖/吉伊.png';
        currentBeastStatusImg.alt = 'unicorn';
    }else{
        currentBeastStatusImg.src = '圖/小八.png';
        currentBeastStatusImg.alt = 'dragon';
    }
}

//檢查是否獲勝
const checkWin = (currentBeast) => {
    return winnerCombinations.some(combination => {
        return combination.every(i => {
            return cells[i].classList.contains(currentBeast);
        })
    });
}

//判斷是否平局
const isDraw = () => {
    return [...cells].every(cell =>{
        return cell.classList.contains('unicorn') || cell.classList.contains('dragon');
    })
}

//開始遊戲
const startGame = () => {
    cells.forEach(cell => {
        winningMessageImg.remove();
        cell.classList.remove('unicorn');
        cell.classList.remove('dragon');
        cell.removeEventListener('click',handleCellClick);
        cell.addEventListener('click',handleCellClick, {once: true});
    });
    setBoardHoverClass();
    gameEndOverlay.classList.remove('show');
}

//結束遊戲
const endGame = (draw) => {

    //添加遊戲結束時顯示頭像的照片
    const winnerAvatar = document.getElementById('winnerAvatar');
    const winningMessageText = document.getElementById('winningMessageText');
    //添加平局時的圖片
    const drawMessage = document.getElementById('drawMessage');
    
    if(draw){
        winnerAvatar.style.backgroundImage = 'url(圖/平局.png)';
        winningMessageText.innerText = `draw!`;
        drawMessage.style.display = 'block';
    } else {

         //添加勝利者音效
         const winnerSound = unicornTurn ? unicornWinSound : dragonWinSound;
         // 播放獲勝玩家的音效
         winnerSound.play();


        winningMessageImg.src = unicornTurn ? '圖/吉伊.png' : '圖/小八.png';
        winningMessageImg.alt = unicornTurn ? 'unicorn' : 'dragon';

        //添加勝利者的圖片
        winnerAvatar.style.backgroundImage = `url(${unicornTurn ? '圖/吉伊.png' : '圖/小八.png'})`;
        
        winningMessage.appendChild(winningMessageImg);
        winningMessageText.innerText = `wins!!!`
        drawMessage.style.display = 'none';
       

       
        
    }
    gameEndOverlay.classList.add('show');
}

//處理格子點擊事件
const handleCellClick = (e) => {
    const cell = e.target;
    const currentBeast =unicornTurn ? 'unicorn' : 'dragon';

    // 播放相应玩家的音效
    currentBeast === 'unicorn' ? unicornButtonSound.play() : dragonButtonSound.play();


    placeBeastImg(cell, currentBeast);

    if (checkWin(currentBeast)){
        endGame(false);
    } else if (isDraw()){
        endGame(true);
    }else{
        swapTurns();
        updateCurrentStatus();
        setBoardHoverClass();
    }
}

//重置遊戲
resetButton.addEventListener('click', startGame);

//開始遊戲
startGame();