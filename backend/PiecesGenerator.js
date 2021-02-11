import { cyan, blue, orange, yellow, green, pink, red } from './AllPieces'

export const MAX_PIECES = 50

class PiecesGenerator{

  constructor(){
    this.all_pieces = [cyan, blue, orange, yellow, green, pink, red]
    this.pieces = this.randomPiecesGenerator(MAX_PIECES)
  }

  getPieceShema(idx){
    const shemaId = this.pieces[idx].shema
    return (this.all_pieces[shemaId])
  }

  getPiecePos(idx){
    return (this.pieces[idx].pos)
  }

  randomPiecesGenerator(number_pieces){
    let array = []
    for (let id = 0; id < number_pieces; ++id){
      array.push(
        {
          shema: this.getRandomIntInclusive(0, 6),
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
