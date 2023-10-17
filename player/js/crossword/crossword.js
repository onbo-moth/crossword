const { CrosswordQuestionHTML } = require("./CrosswordQuestionHTML");
const { CrosswordQuestionServer } = require("./CrosswordQuestionServer");
const { CrosswordCanvas } = require("./canvas.js");
const { CrosswordInput } = require("./crosswordInput");

class Crossword {
  constructor( crosswordData ){
    console.log( crosswordData )

    this.elements = this.processCrosswordData( crosswordData )
    this.sizedata = this.getOffsetAndSize()

    this.htmlList = new CrosswordQuestionServer( this.elements );

    this.repositionCrossword()

    this.canvas = new CrosswordCanvas( this, this.htmlList )

    this.inputs = new CrosswordInput( this, this.canvas, this.htmlList );

    console.log(this)
  }

  getElement( index ){
    return this.elements[ index ]
  }

  /**
   * Gets crossword rectangle size.
   * @returns { [ width: Number, height: Number ] }
   */
  getSize() {
    return [ this.sizedata.width, this.sizedata.height ]
  }

  processCrosswordData( crosswordData ){
    let elements = []

    for( let index = 0; index < crosswordData.crossword.length; index++ ){
      let positionIndex = crosswordData.crossword[ index ]

      let cwIndex  = positionIndex[ 0 ]
      let position = positionIndex[ 1 ]

      let answer = crosswordData.questions[ cwIndex ]

      elements.push( new CrosswordElement(
        answer[0],
        answer[1],
        answer[2],
        position
      ) )
    }

    return elements
  }

  getOffsetAndSize() {
    let minX = Infinity
    let maxX = -Infinity
    
    let minY = Infinity
    let maxY = -Infinity

    for( const element of this.elements ){
      if( element.direction === "horizontal" ){
        let y = element.position.y

        let leftX  = element.position.x
        let rightX = element.position.x + (element.answer.length - 1)

        if( y < minY ) minY = y
        if( y > maxY ) maxY = y

        if( leftX  < minX ) minX = leftX
        if( rightX > maxX ) maxX = rightX
      } else {
        let x = element.position.x

        let topY    = element.position.y
        let bottomY = element.position.y + (element.answer.length - 1)

        if( x < minX ) minX = x
        if( x > maxX ) maxX = x

        if( topY < minY )    minY = topY
        if( bottomY > maxY ) maxY = bottomY
      }
    }

    let results = {
      offsetX: minX,
      offsetY: minY,
      width:   maxX - minX + 1,
      height:  maxY - minY + 1
    }

    return results
  }

  repositionCrossword() {
    let deltaX = this.sizedata.offsetX
    let deltaY = this.sizedata.offsetY

    for( const element of this.elements ){
      element.position.x -= deltaX
      element.position.y -= deltaY
    }
  }

  /**
   * Gets indexes for tiles.
   * 
   * @param { Number } x 
   * @param { Number } y 
   * @returns { Number[] }
   */
  whatOccupiesTile( x, y ) {
    let occupants = []

    for( const element of this.elements ){
      if( element.direction == "horizontal" ){
        let isMatchingY = y == element.position.y
        let isLeftXOut  = x < element.position.x
        let isRightXOut = x > element.position.x + ( element.answer.length - 1 )

        if( ! isMatchingY || isLeftXOut || isRightXOut ) continue
      } else {
        let isMatchingX  = x == element.position.x
        let isTopYOut    = y < element.position.y
        let isBottomYOut = y > element.position.y + ( element.answer.length - 1 )

        if( ! isMatchingX || isTopYOut || isBottomYOut ) continue
      }

      occupants.push( this.elements.indexOf( element ) )
    }

    return occupants
  }

  isTileOccupied( x, y ){
    for( const [ tx, ty ] of this.getNonemptyTiles() ){
      if( x == tx && y == ty ) return true
    }

    return false
  }

  /**
   * Gets position for tiles that element occupies.
   * @param { CrosswordElement } element 
   * @yields { [ x: Number, y: Number ] }
   */
  * getElementTiles( element ){
    let x = element.position.x
    let y = element.position.y

    let direction = element.direction

    let filterX = 0
    let filterY = 0

    if( direction == "horizontal" ) filterX = 1
    if( direction == "vertical"   ) filterY = 1

    let letters = element.answer.length

    for( let i = 0; i < letters; i++ ){
      let gx = x + i * filterX
      let gy = y + i * filterY
      yield [ gx, gy ]
    }
  }

  /**
   * Gets all tiles that are occupied by at least one element.
   * If a tile is caught in a intersection, it is sent twice.
   * 
   * @yields { [ x: Number, y: Number ] }
   */
  * getNonemptyTiles() {
    for( const element of this.elements ){
      for( const position of this.getElementTiles( element ) ){
        yield position
      }
    }
  }
}

class CrosswordElement {
  constructor( question, answer, direction, position ){
    this.question = question
    this.answer = answer
    this.direction = direction
    this.position = position
  }
}

exports.CrosswordQuestionHTML = CrosswordQuestionHTML;

module.exports = { 
  Crossword,
  CrosswordElement
}