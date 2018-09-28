/*
== battleship game ==

prerequisite:
1. render board (10 x 10) row = A - J, col = 1 - 10
2. two player

feature: 
1. add only a ship each type (carrier, destroyer, patrol, submarine, battleship)
2. attack the ship
3. show attack status (miss or hit the ship)

*/

const boardEl = document.getElementById("board")
const descEl = document.getElementById("description")
const playEl = document.getElementById("play")
const rowNames = Array(10).fill(0).map((x, idx) => String.fromCharCode(65+idx) )
const colNames = Array(10).fill(0).map((x, idx) => idx)
let playerOneBoard = []
let playerTwoBoard = []

let hitCounter = 0

const shipData = {
  carrier: { size: 5 },
  battleship: { size: 4 },
  destroyer: { size: 3 },
  submarine: { size: 3 },
  patrol: { size: 2 },
}

let playerOneShip = []
let playerTwoShip = []

let playNow = false

let playerOneTurn = true

let cheatMode = false

document.getElementById("submit").addEventListener("click", onAddShip)
document.getElementById("changePlayer").addEventListener("click", changePlayer)
document.getElementById("play").addEventListener("click", changePlayStatus)

function updateBoard () {
  playerOneBoard = rowNames.map(x => Array(colNames.length).fill({type: "water", hit: false}))
  playerTwoBoard = rowNames.map(x => Array(colNames.length).fill({type: "water", hit: false}))
}

function renderBoard () {
  boardEl.innerHTML = ""
  if (playerOneShip.length > 4 && playerTwoShip.length > 4) {
    playEl.style.display = "block"
  } else if (playerOneShip.length > 4) {
    
  } else if (playerTwoShip.length > 4) {

  }
  
  if (playNow) {
    if (playerOneTurn) {
      if (!cheatMode) descEl.innerText = "Now playing: Player One"
    } else {
      if (!cheatMode) descEl.innerText = "Now playing: Player Two"
    }
  } else {
    if (playerOneTurn) {
      descEl.innerText = `${playerOneShip.length > 4 ? "READY" : "PREPARE"} for WAR: Player One`
    } else {
      descEl.innerText = `${playerTwoShip.length > 4 ? "READY" : "PREPARE"} for WAR: Player Two`
    }
  }
  
  for (var i = 0; i < rowNames.length; i++) {
    renderRow(i)
    for (var j = 0; j < colNames.length; j++) {
      renderBox(i, j)
    }
  }
}

function renderRow (row) {
  if (row == 0) {
    const coordDiv = document.createElement("DIV")
    coordDiv.style.display = "flex"
    coordDiv.style.flexDirection = "row"
    for (var i = 0; i < colNames.length + 1; i++) {
      const colDiv = document.createElement("DIV")
      const colText = document.createTextNode(Number(i))
      colDiv.classList.add("coord")
      colDiv.appendChild(colText)
      coordDiv.appendChild(colDiv)
    }
    boardEl.appendChild(coordDiv)

  }

  var div = document.createElement("DIV")
  div.setAttribute("id", "box-" + row)
  div.classList.add("row")
  boardEl.appendChild(div)
}

function renderBox (row, col) {
  if (col == 0) {
    const rowDiv = document.createElement("DIV")
    const rowText = document.createTextNode(rowNames[row])
    rowDiv.classList.add("coord")
    rowDiv.appendChild(rowText)
    document.getElementById("box-" + row).appendChild(rowDiv)
  }
  const rowOfBoxes = document.getElementById("box-" + row)
  const box = document.createElement("BUTTON")
  let selectedBox

  if (playNow) {
    if (playerOneTurn) {
      selectedBox = playerTwoBoard[row][col]
    } else {
      selectedBox = playerOneBoard[row][col]
    }
    if (selectedBox.hit == true) {
      if (selectedBox.type != "water") {
        box.classList.add("hit-ship")
        box.appendChild(document.createTextNode(selectedBox.type[0]))
      } else {
        box.classList.add("hit")
      }
    }
  } else {
    if (playerOneTurn) {
      selectedBox = playerOneBoard[row][col]
    } else {
      selectedBox = playerTwoBoard[row][col]
    }
    if (selectedBox.type != "water") {
      box.classList.add("ship")
      box.classList.add(selectedBox.type)
    }
  }
   
  box.classList.add("box")
  box.setAttribute("id", "box-"+row+"-"+col)
  box.addEventListener("click", attack)
  rowOfBoxes.appendChild(box)
}

function attack (e) {
  if (!playNow) return false
  if (playerOneTurn) {
    if (isWin()) alert("Player 1 WIN")
  } else {
    if (isWin()) alert("Player 2 WIN")
  }
  const id = e.target.id
  const ids = id.split("-")
  const row = ids[1]
  const col = ids[2]

  if (playerOneTurn) {
    const selectedBox = playerTwoBoard[row][col]
    if (selectedBox.hit == true) {
      document.getElementById("status").innerText = "sudah menembak koordinat ini"
    } else if (selectedBox.type != "water") {
      document.getElementById("status").innerText = "you hit " + selectedBox.type
    } else {
      document.getElementById("status").innerText = "your attack is miss!"
    }
    playerTwoBoard[row][col] = { ...selectedBox, hit: true}

  } else {
    const selectedBox = playerOneBoard[row][col]
    if (selectedBox.hit == true) {
      document.getElementById("status").innerText = "sudah menembak koordinat ini"
    } else if (selectedBox.type != "water") {
      document.getElementById("status").innerText = "you hit " + selectedBox.type
    } else {
      document.getElementById("status").innerText = "your attack is miss!"
    }
    playerOneBoard[row][col] = { ...selectedBox, hit: true}
  }

  if (cheatMode) {
    hitCounter++
    if (hitCounter == 5) {
      changePlayer()
    }
  } else {
    // changePlayer()
  }

  renderBoard()
}

function onAddShip (e) {
  if (playNow) return false

  const direction = document.getElementsByName("direction")[0].value
  const shipName = document.getElementsByName("ship")[0].value

  const addedShips = playerOneTurn ? playerOneShip : playerTwoShip
  if (addedShips.indexOf(shipName) > -1) {
    alert('Hanya boleh satu kapal untuk tiap jenis kapal')
    return false
  } 

  const startCoord = prompt("Enter start coordinate for your ship:")
  if (startCoord) {
    var regCol = /[0-9]+/
    var regRow = /[a-zA-Z]+/
    const detectedNumber = startCoord.match(regCol)
    const detectedRow = startCoord.match(regRow)

    const col = detectedNumber.length > 0 ? parseInt(detectedNumber[0]) - 1 : -1
    const row = detectedRow.length > 0 ? rowNames.indexOf(detectedRow[0].toUpperCase()) : -1

    if (col > -1 && row > -1) {
      const start = { col, row }
      const { status, message } = checkShip(shipName, start, direction)
      if (status) {
        alert(message)
        return false
      } else {
        addShip(shipName, start, direction)
      }
    } else { alert('Hanya koordinat di arena tempur yang diperbolehkan') }
  }
}

function addShip (shipName, start, direction) {
  if (playNow) return false

  const { size } = shipData[shipName]
  const { row, col } = start
  if (direction == 'hor') {
    for (var i = col; i < col + size; i++ ) {
      if (playerOneTurn) {
        playerOneBoard[row][i] = { type: shipName, hit: false }
      } else {
        playerTwoBoard[row][i] = { type: shipName, hit: false }
      }
    }
  } else if (direction == 'ver') {
    for (var i = row; i < row + size; i++ ) {
      if (playerOneTurn) {
        playerOneBoard[i][col] = { type: shipName, hit: false }
      } else {
        playerTwoBoard[i][col] = { type: shipName, hit: false }
      }
    }
  }

  if (playerOneTurn) {
    playerOneShip.push(shipName)
  } else {
    playerTwoShip.push(shipName)
  }

  renderBoard()
}

function checkShip (ship, start, direction) {
  let existShip = []
  let message
  let status = false
  const { row, col } = start
  const { size } = shipData[ship]
  if (direction == 'hor') {
    if (col + size - 1> colNames.length - 1) {
      return {
        status: true,
        message: 'Kapal tidak boleh keluar dari arena'
      }
    }
    for (var i = col; i < col + size; i++ ) {
      if (playerOneTurn) {
        const selectedBox = playerOneBoard[row][i]
        if (selectedBox.type != "water") {
          existShip.push(selectedBox.type)
        }
      } else {
        const selectedBox = playerTwoBoard[row][i]
        if (selectedBox.type != "water") {
          existShip.push(selectedBox.type)
        }
      }
    }
  } else if (direction == 'ver') {
    if (row + size - 1 > rowNames.length - 1) {
      return {
        status: true,
        message: 'Kapal tidak boleh keluar dari arena'
      }
    }
    for (var i = row; i < row + size; i++ ) {
      if (playerOneTurn) {
        const selectedBox = playerOneBoard[i][col]
        if (selectedBox.type != "water") {
          existShip.push(selectedBox.type)
        }
      } else {
        const selectedBox = playerTwoBoard[i][col]
        if (selectedBox.type != "water") {
          existShip.push(selectedBox.type)
        }
      }
    }
  }

  return {
    status: existShip.length > 0, 
    message: "Kapal menabrak dengan kapal lain"
  }
}

function changePlayer () {
  playerOneTurn = !playerOneTurn
  hitCounter = 0
  renderBoard()
}

function changePlayStatus () {
  // playNow = status
  playNow = true
  renderBoard()
}

function toggleHint () {
  cheatMode = !cheatMode
  playerOneTurn = !playerOneTurn
  playNow = !playNow
  renderBoard()
}

function isWin (player) {
  const playerTurn = player == 'p1' ? true : false
  const selectedBoard = playerTurn ? playerTwoBoard : playerOneBoard
  const filtered = selectedBoard.map(val => {
    return val.filter(x => x.type != "water" && x.hit == false)
  })
  const existEnemy =  filtered.flat()
  return existEnemy.length < 1
}

function init () {
  updateBoard()
  renderBoard()
}

init()