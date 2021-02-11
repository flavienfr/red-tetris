import { cyan, blue, orange, yellow, green, pink, red } from './AllPieces'

class PiecesGenerator{

  constructor(){
    const MAX_PIECES = 5
    this.all_pieces = [cyan, blue, orange, yellow, green, pink, red]
    this.pieces = this.randomPiecesGenerator(MAX_PIECES)
  }

  getPieceShema(idx){
    const shemeId = this.pieces[idx].sheme
    return (this.all_pieces[shemeId])
  }

  getPiecePos(idx){
    return (this.pieces[idx].pos)
  }

  randomPiecesGenerator(number_pieces){
    let array = []
    for (let id = 0; id < number_pieces; ++id){
      array.push(
        {
          sheme: this.getRandomIntInclusive(0, 6),
          pos: this.getRandomIntInclusive(0, 3)
        }
      )
    }
    return (array)
  }

  getRandomIntInclusive(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min +1)) + min
  }
}

export default PiecesGenerator
