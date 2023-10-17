const CanvasFont = require("@onbo/canvasfont");
const { CrosswordElement } = require("./crossword");
const { CrosswordQuestionServer } = require("./CrosswordQuestionServer");

class CrosswordCanvas {
  static CW_PADDING = 40;
  static CW_TILE_WIDTH  = 40;
  static CW_OUTLINE_OFFSET = -4;
  static CW_MARGIN = 2
  
  /**
   * 
   * @param { Crossword } crossword 
   * @param { CrosswordQuestionServer } questionServer 
   */
  constructor( crossword, questionServer ) {
    this.crossword = crossword
    this.questionServer = questionServer
    this.canvas = document.getElementsByTagName("canvas")[0]
    this.context = this.canvas.getContext("2d")
    this.font = new CanvasFont( this.canvas )

    this.font.fontFamily = "arial"
    this.font.fontSize = 24

    this.resizeToFitCrossword()


    this.context.fillStyle = "#000000"
    this.drawOutlines()
    this.context.fillStyle = "#ffffff"
    this.drawTiles()
  }

  resizeTo( width, height ) {
    this.canvas.width = width
    this.canvas.height = height
  }

  resizeToFitCrossword() {
    let [ width, height ] = this.crossword.getSize()

    let canvasWidth  = 2 * CrosswordCanvas.CW_PADDING + width *  CrosswordCanvas.CW_TILE_WIDTH
    let canvasHeight = 2 * CrosswordCanvas.CW_PADDING + height * CrosswordCanvas.CW_TILE_WIDTH

    let extraMarginX = width  * CrosswordCanvas.CW_MARGIN
    let extraMarginY = height * CrosswordCanvas.CW_MARGIN

    this.resizeTo( canvasWidth + extraMarginX, canvasHeight + extraMarginY )
  }

  drawOutlines() {
    for( const position of this.crossword.getNonemptyTiles() ){
      this.drawOutline( ...position )
    }
  }

  drawTiles() {
    for( const position of this.crossword.getNonemptyTiles() ){
      this.drawTile( ...position )
    }
  }

  drawOutline( x, y ){
    let pos = this.getGridPosition( x, y )

    let off = CrosswordCanvas.CW_OUTLINE_OFFSET
    let size = CrosswordCanvas.CW_TILE_WIDTH

    let cx = pos.x + off
    let cy = pos.y + off

    let w = size + 2 * -off
    let h = size + 2 * -off

    this.context.fillRect( cx, cy, w, h )
  }

  drawTile( x, y ){
    let pos = this.getGridPosition( x, y )

    let size = CrosswordCanvas.CW_TILE_WIDTH

    let cx = pos.x
    let cy = pos.y

    let w = size 
    let h = size 

    this.context.fillRect( cx, cy, w, h )
  }

  getGridPosition( x, y ){
    let pad = CrosswordCanvas.CW_PADDING
    let wid = CrosswordCanvas.CW_TILE_WIDTH

    let marginX = x * CrosswordCanvas.CW_MARGIN
    let marginY = y * CrosswordCanvas.CW_MARGIN

    let gx = pad + x * wid + marginX
    let gy = pad + y * wid + marginY

    return {
      x: gx,
      y: gy
    }
  }

  /**
   * 
   * @param { CrosswordElement } element 
   */
  highlightElement( element ){
    for( const pos of this.crossword.getElementTiles( element ) ){
      this.drawTile( ...pos )
    }
  }


  /**
   * Gets the grid coordinates that the mouse position falls on.
   * 
   * @param { Number } x 
   * @param { Number } y 
   * @returns { [ x: Number, y: Number ] }
   */
  getMouseGridPosition( x, y ){
    x -= CrosswordCanvas.CW_PADDING
    y -= CrosswordCanvas.CW_PADDING

    let realWidth = CrosswordCanvas.CW_TILE_WIDTH + CrosswordCanvas.CW_MARGIN

    let gx = Math.floor( x / realWidth )
    let gy = Math.floor( y / realWidth )

    if( gx < 0 ) return null
    if( gy < 0 ) return null

    if( gx > this.crossword.sizedata.width ) return null
    if( gy > this.crossword.sizedata.height ) return null

    return [ gx, gy ]
  }
}

module.exports = {
  CrosswordCanvas
}