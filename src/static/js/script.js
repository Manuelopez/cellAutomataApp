//board size
let rows;
let cols;

let board = []
let antObj = []

let repTime = 100

timer = document.getElementById('repTime')
timer.addEventListener('change', (event)=>{
  repTime = event.target.value*1000
})


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
  
  if(selectValue === 'antGame'){

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
  else{

    if(board[row][col] === 0){
      board[row][col] = 1
    } 
    else{
      board[row][col] = 0
    }   
  }
  renderBoard()
}



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
      else if(board[i][j] == 2){
        cell.setAttribute('class', 'bDying')
      }
      else{
        cell.setAttribute('class','live')
      }
    }
  }  
}
//infinite loop
function infiniteLoop(){
  if(selectValue == 'antGame'){
    nextAntBoardState()
  }
  else if(selectValue == 'lifeGame'){
    nextLifeBoardState()
  }
  else if(selectValue == 'brianGame'){
    nextBrianBoardState()
  }

  if(playing){
    timer = setTimeout(infiniteLoop, repTime)
  }
  renderBoard()
}

// Window controler
function resized(){
  let elem = document.getElementById('boardContainer')
  elem.innerHTML= ''
  start()
  
}
window.onresize = resized

function start(){
  createArrayBoard()
  createTable()
  antObj.forEach((ant)=>{
    ant.aCol = mod(ant.aCol, cols)
    ant.aRow = mod(ant.aRow, rows)
  })
  renderBoard()

}
window.onload = start()

// ant functions
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
  antObj.forEach((ant) =>{

    ant.aRow = mod(ant.aRow, rows)
    ant.aCol = mod(ant.aCol, cols)

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
  })

  
}	
var mod = function (n, m) {
  var remain = n % m;
  return Math.floor(remain >= 0 ? remain : remain + m);
}


function nextLifeBoardState(){
  let newState = Array(rows).fill().map(() => Array(cols).fill(0))
  for(let i = 0; i < rows; i++){
    for(let j=0; j < cols; j++){
      if(board[i][j] == 1 && (countliveNeighbors(i,j) == 2 || countliveNeighbors(i,j) == 3)){
        newState[i][j] = 1
      }
      else if(board[i][j] == 0 && countliveNeighbors(i, j) == 3){
        newState[i][j] = 1
      }
      else{
        newState[i][j] = 0
      }
    }
  }
  board = [...newState]
}

function countliveNeighbors(row, col){
  let sum = 0
  sum += countDiagLU(row,col)
  sum += countU(row, col)
  sum += countDiagRU(row, col)
  sum += countL(row, col)
  sum += countR(row, col)
  sum += countDiagLD(row, col)
  sum += countD(row, col)
  sum += countDR(row, col)

  return sum
}


function nextBrianBoardState(){
  let newState = Array(rows).fill().map(() => Array(cols).fill(0))
  for(let i = 0; i < rows; i++){
    for(let j = 0; j < cols; j++){
      if(board[i][j] == 0){
        if(countBrian(i,j) == 2){
          newState[i][j] = 1
        }
        else{
          newState[i][j] = 0
        }
      }
      else if(board[i][j] == 1){
        newState[i][j] = 2
      }
      else if(board[i][j] == 2){
        newState[i][j] = 0
      }
    }
  }
  board = [...newState]
}

function countBrian(row, col){
  let sum = 0
  function fix(x){
    if(x ==2){
      return 0
    }
    return x
  }
  sum += fix(countDiagLU(row,col))
  sum += fix(countU(row, col))
  sum += fix(countDiagRU(row, col))
  sum += fix(countL(row, col))
  sum += fix(countR(row, col))
  sum += fix(countDiagLD(row, col))
  sum += fix(countD(row, col))
  sum += fix(countDR(row, col))

  return sum
  
}




function countDiagLU(i,j){
  
  if(i == 0 && j == 0){
    return board[rows-1][cols-1]
  }
  else if(i==0 && j > 0){
    return board[rows-1][j-1]
  }
  else if(i > 0 && j == 0){
    return board[i-1][cols-1]
  }
  else{
    return board[i-1][j-1]
  }
}

function countU(i, j){
  if(i==0){
    return board[rows-1][j]
  }
  else{
    return board[i-1][j]
  }
}

function countDiagRU(i, j){
  if(i == 0 && j == cols-1){
    return board[rows-1][0]
  }
  else if(i == 0 && j < cols -1){
    return board[rows-1][j+1]
  }
  else if(i>0 && j == cols-1){
    return board[i-1][0]
  }
  else{
    return board[i-1][j+1]
  }
}

function countL(i,j){
  if(j == 0){
    return board[i][cols-1] 
  }
  else{
    return board[i][j-1]
  }
}

function countR(i,j){
  if(j == cols - 1){
    return board[i][0]
  }
  else{
    return board[i][j+1]
  }
}

function countDiagLD(i,j){
  if(i == rows-1 && j == 0){
    return board[0][cols-1]
  }
  else if(i < rows-1 && j == 0){
    return board[i+1][cols-1]
  }
  else if(i == rows-1 && j >0){
    return board[0][j-1]
  }
  else{
    return board[i+1][j-1]
  }
}

function countD(i,j){
  if(i == rows-1){
    return board[0][j]
  }
  else{
    return board[i+1][j]
  }
}

function countDR(i, j){
  if(i == rows - 1 && j == cols -1){
    return board[0][0]
  }
  else if(i == rows -1 && j < cols -1){
    return board[0][j+1]
  }
  else if(i< cols - 1 && j == cols -1){
    return board[i+1][0]
  }
  else{
    return board[i+1][j+1]
  }
}


