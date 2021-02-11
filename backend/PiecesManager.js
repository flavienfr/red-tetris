class PiecesManager{
  constructor(generator){
    this.gnt = generator
    this.cur_gnt_piece = 0
    this.cur_piece_shema = this.gnt.getPieceShema(0)
    this.cur_piece_pos = this.gnt.getPiecePos(0)
    /*
    this.last_x
    this.last_y
    this.cur_x
    this.cur_y
    */
  }

  getPiece(){
    return (this.cur_piece_shema[this.cur_piece_pos])
  }

  next(){
    if (++this.cur_gnt_piece > this.gnt.MAX_PIECES)
      this.cur_gnt_piece = 0
    this.cur_piece_shema = this.gnt.getPieceShema(this.cur_gnt_piece)
    this.cur_piece_pos = this.gnt.getPiecePos(this.cur_gnt_piece)
    //return (this.cur_piece_shema[this.cur_piece_pos])
  }

  rotate(){
    if (++this.cur_piece_pos > 3)
      this.cur_piece_pos = 0
    //return (this.cur_piece_shema[this.cur_piece_pos])
  }
}

export default PiecesManager
