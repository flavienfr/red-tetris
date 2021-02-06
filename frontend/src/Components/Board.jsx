function Board({status, board}) {

  return (
    <div>
      <p>{status}</p>
      <div className='board'>
        { board }
      </div>
    </div>
  )

}

export default Board
