//board size
let rows;
let cols;

let board = []
let antObj = []

let repTime = 1000

timer = document.getElementById('repTime')
timer.addEventListener('change', (event)=>{
  repTime = event.target.value*1000
})

window.onresize = resized




// playing componenets
let playing = false
let playB = document.getElementById('playButton')
playB.onclick = playBClicked

let clearB = document.getElementById('clearButton')
clearB.onclick = clearBClicked

let randB = document.getElementById('randButton')
randB.onclick = randBCliecked

let selectElement = document.getElementById('games')
let selectValue = selectElement.value

let jumpElement = document.getElementById('jumpIt')
let jumpButton = document.getElementById('bJump')

jumpButton.onclick = jumpButtonClicked

selectElement.addEventListener('change', (event)=>{
  selectValue = event.target.value
  if(playing === true){
    playBClicked()
  }

  if(selectValue != 'antGame'){
    jumpElement.style.display = "none"
    jumpButton.style.display = "none"
  }
  else{
    jumpElement.style.display = ""
    jumpButton.style.display = ""

  }
  clearBClicked()
})


// render board
function renderBoard(){
  for(let i = 0; i < rows; i++){
    for(let j = 0; j < cols; j++){
      let cell = document.getElementById(i+'_'+j)
      if(!isAnt(i,j) && board[i][j]==0){
        cell.setAttribute('class','dead')
      }
      else if(isAnt(i,j)){
        cell.setAttribute('class', 'ant')
      }
      else{
        cell.setAttribute('class','live')
      }
    }
  }  
}

// button handlers
function jumpButtonClicked(){
  for(let i = 0; i< parseInt(jumpElement.value); i++){
    nextAntBoardState()
  }
  renderBoard()

}

function randBCliecked(){
  antObj = []
  clearBClicked();
  for(let i = 0; i<rows; i++){
    for(let j = 0; j<cols; j++){
      if(Math.floor(Math.random() * Math.floor(2))){
        board[i][j] = 1
      }
    }
  }
  renderBoard()
}
function clearBClicked(){
  antObj = []
  for(let i = 0; i < rows; i++){
    for(let j = 0; j < cols; j++){
      board[i][j] = 0
    }
  }
  if(playing){
    playBClicked()
  }
  renderBoard()
}
function playBClicked(){
  if(playing){
    playB.innerHTML = 'Play'
    playing = false
  }
  else{
    playB.innerHTML = 'Pause'
    playing = true
  }
  infiniteLoop()
}



function createArrayBoard(){
  rows = Math.floor((window.innerHeight )/15);
  cols = Math.floor((window.innerWidth )/10);

  board = Array(rows).fill().map(() => Array(cols).fill(0))

}

//creates table board to view
function createTable(){
  let boardC = document.getElementById('boardContainer')

  let table = document.createElement('table')

  for(let i = 0; i < rows; i++){
    let tr = document.createElement('tr')
    for(let j = 0; j< cols; j++){
      let cell = document.createElement('td')
      cell.setAttribute('id', i +'_'+ j)
      cell.setAttribute('class', 'dead')
      cell.onclick = cellClicked
      tr.appendChild(cell)
    }
    table.appendChild(tr)

  }
  boardC.appendChild(table)
}

// cell clicked hanlder
function cellClicked(){
  let rowcol = this.id.split("_");
  let row = parseInt(rowcol[0]);
  let col = parseInt(rowcol[1]);
  
  if(selectValue === ''){
    return alert('select a game')

  }
  else if(selectValue === 'antGame'){

    if(board[row][col] >= 0 && !isAnt(row,col)){
      let ant = new Ant(row, col, 'U')
      antObj.push(ant)
    } 
    else if(isAnt(row, col)){
      board[row][col] = 0
      
      let obj = antObj.find(obj => obj.aRow == row && obj.aCol == col)
      antObj.splice(antObj.indexOf(obj), 1)
    }
  }
  else if(selectValue === 'lifeGame'){

    if(board[row][col] === 0){
      board[row][col] = 1
    } 
    else{
      board[row][col] = 0
    }   
  }
  renderBoard()
}	



//infinite loop
function infiniteLoop(){
  if(selectValue == 'antGame'){
    nextAntBoardState()
  }
  if(playing){
    timer = setTimeout(infiniteLoop, repTime)
  }
  renderBoard()
}


// ant obj
function Ant(aRow, aCol, Orientation){
  this.aRow = aRow
  this.aCol = aCol
  this.Orientation = Orientation
}

function isAnt(cRow, cCol){
  for(let i = 0; i < antObj.length; i++){
    if(antObj[i].aRow == cRow && antObj[i].aCol == cCol){
      return true
    }
  }
  return false
}

function antSteps(nAnt, direc){
  if(direc == 'left'){
    if(nAnt.Orientation == 'U'){
      nAnt.aCol -= 1
      nAnt.Orientation = 'L'
    }
    else if(nAnt.Orientation == 'L'){
      nAnt.aRow += 1
      nAnt.Orientation = 'D'
    }
    else if(nAnt.Orientation == 'D'){
      nAnt.aCol += 1
      nAnt.Orientation = 'R'
    }
    else if(nAnt.Orientation == 'R'){
      nAnt.aRow -= 1
      nAnt.Orientation = 'U'
    }
  }

  else if(direc == 'right'){
    if(nAnt.Orientation == 'U'){
      nAnt.aCol += 1
      nAnt.Orientation = 'R'
    }
    else if(nAnt.Orientation == 'R'){
      nAnt.aRow += 1
      nAnt.Orientation = 'D'
    }
    else if(nAnt.Orientation == 'D'){
      nAnt.aCol -= 1
      nAnt.Orientation = 'L'
    }
    else if(nAnt.Orientation == 'L'){
      nAnt.aRow -= 1
      nAnt.Orientation = 'U'
    }  
  }
}

function nextAntBoardState(){
  for(let i = 0; i< antObj.length; i++){
    let ant = antObj[i]

    if(board[ant.aRow][ant.aCol] == 1){
      board[ant.aRow][ant.aCol] = 0
      antSteps(ant, 'left')
    }
    else{
      board[ant.aRow][ant.aCol] = 1
      antSteps(ant, 'right')
    }
    ant.aRow = mod(ant.aRow, rows)
    ant.aCol = mod(ant.aCol, cols)
  }
}
var mod = function (n, m) {
  var remain = n % m;
  return Math.floor(remain >= 0 ? remain : remain + m);
}

function resized(){
  let elem = document.getElementById('boardContainer')
  elem.innerHTML= ''
  start()
  
}

function start(){
  createArrayBoard()
  createTable()
}
window.onload = start()
