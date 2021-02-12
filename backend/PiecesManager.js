
import { MAX_PIECES } from './PiecesGenerator'

class PiecesManager{
  constructor(generator){
    this.gnt = generator
    this.cur_gnt_piece = 0
    this.cur_piece_shema = this.gnt.getPieceShema(0)
    this.cur_piece_pos = this.gnt.getPiecePos(0)
    this.cur_piece_color = this.gnt.getPieceColor(0)

    this.cur_x
    this.cur_y
    this.initPosition()
  }
 
  initPosition(){
    this.cur_x = 3
    this.cur_y = -1
  }

  left(){ this.cur_x-- }
  right(){ this.cur_x++  }
  down(){ this.cur_y++  }
  goTo(col, row){
    this.cur_x = col
    this.cur_y = row
  }

  getPiece(){
    return (this.cur_piece_shema[this.cur_piece_pos])
  }

  next(){
    this.initPosition()
    if (++this.cur_gnt_piece >= MAX_PIECES)
      this.cur_gnt_piece = 0
    this.cur_piece_shema = this.gnt.getPieceShema(this.cur_gnt_piece)
    this.cur_piece_pos = this.gnt.getPiecePos(this.cur_gnt_piece)
    this.cur_piece_color = this.gnt.getPieceColor(this.cur_gnt_piece)
  }

  rotate(){
    if (++this.cur_piece_pos > 3)
      this.cur_piece_pos = 0
  }

  getRotate(){
    let tmp_pos = this.cur_piece_pos + 1
    if (tmp_pos > 3)
      tmp_pos = 0
    return (this.cur_piece_shema[tmp_pos])
  }
}

export default PiecesManager
