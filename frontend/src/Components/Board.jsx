import { useEffect, useState } from 'react'
import { socket } from '../App'

function EmptyBoard(){
  return (
    Array.from({length: 200}, (_, id) => (
      <div key={id} id={ '_' + id } className='empty'></div>
    ))
  )
}

function Board({playerSize, isWinner}) {
  let theMainBoard
  let theSecondBoard
  const [mainBoard, setMainBoard] = useState(EmptyBoard())
  const [secondBoard, setSecondBoard] = useState(EmptyBoard())
  const [mainScore, setMainScore] = useState(0)
  const [secondScore, setSecondScore] = useState(0)

  useEffect(() => {
    socket.on('board', (data) => {
      let recvBoard = Array.from(data.board, (color, id) => (
        <div key={id} id={ '_' + id } className={color}></div>
      ))
      if (data.socketId === socket.id){
        setMainBoard(recvBoard)
        setMainScore(data.score)
      }
      else{
        setSecondBoard(recvBoard)
        setSecondScore(data.score)
      }
    })
    return() =>{
      socket.off('board')
    }
  }, [])

  if (playerSize === 1){
    if (isWinner === true || isWinner === false)
      theMainBoard = <div className='board'> {mainBoard} <p>GAME OVER</p> </div>
    else
      theMainBoard = <div className='board'> {mainBoard} </div>

    return (
      <div className='mainBoard'>
        <p>{mainScore}</p>
        {theMainBoard}
      </div>
   )
  }

  if (isWinner === true){
    theMainBoard = <div className='board'> {mainBoard} <p>WINNER</p> </div>
    theSecondBoard = <div className='board'> {secondBoard} <p>LOSER</p> </div>
  }
  else if (isWinner === false){
    theMainBoard = <div className='board'> {mainBoard} <p>LOSER</p> </div>
    theSecondBoard = <div className='board'> {secondBoard} <p>WINNER</p> </div>
  }
  else{
    theMainBoard = <div className='board'> {mainBoard} </div>
    theSecondBoard = <div className='board'> {secondBoard} </div>
  }

  return (
    <>
      <div className='mainBoard'>
        <p>{mainScore}</p>
        {theMainBoard}
      </div>
      <div className='secondBoard'>
        <p>{secondScore}</p>
        {theSecondBoard}
      </div>
    </>
  )
}

export default Board
