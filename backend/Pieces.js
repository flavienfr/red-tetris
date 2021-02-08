class Pieces{
  constructor(generator){
    this.gnt = generator
    this.cur_piece = 0
  }


}

export default Pieces

/*

  getPiece(piece_number){
    return this.gnt.pieces[piece_number].piece
  }

  getPos(piece_number){
    return this.gnt.pieces[piece_number].pos
  }

  getShema(piece_number){
    //if (piece_number < 0 || piece_number >= this.gnt.MAX_PIECES)
    //  console.error('Piece out of range')
    this.cur_piece_shape = getPiece(piece_number)
    this.cur_pos = getPos(piece_number)
    return (this.gnt.all_pieces[this.cur_piece_shape][this.cur_pos])
  }

  next(){
    if (++this.cur_piece > this.gnt.MAX_PIECES - 1)
      this.cur_piece = 0
    return getShema(this.cur_piece)
  }

  left(){
    if (--)
  }

*/