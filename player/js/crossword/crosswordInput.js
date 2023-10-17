const CanvasFont = require("@onbo/canvasfont")
const { CrosswordCanvas } = require("./canvas")
const { Crossword, CrosswordElement } = require("./crossword")
const { CrosswordQuestionServer } = require("./CrosswordQuestionServer")

class CrosswordInput {
  /**
   * Initializes a input for the crossword.
   * 
   * @param { Crossword } crossword 
   * @param { CrosswordCanvas } canvas 
   * @param { CrosswordQuestionServer } htmllist
   */
  constructor( crossword, canvas, htmllist ){
    this.crossword = crossword
    this.canvas = canvas
    this.htmllist = htmllist

    this.selectedQuestion = null
    this.selectedTile     = null
    this.lettersWritten   = null
    this.letterAmount     = null

    this.hoverQuestions    = null
    this.selectedQuestions = null
    this.hoverIndex        = null

    this.hoveredTile = null

    this.input = this.generateInputTable()

    this.addCanvasListeners()

    this.htmllist.addEventListener("hover", this.highlight.bind(this))
    this.htmllist.addEventListener("unhover", this.unhighlight.bind(this))
  }

  highlight( ev ){
    let element = ev.detail.question.element

    this.canvas.context.fillStyle = "#88ffff"
    this.canvas.highlightElement( element )

    this.canvas.context.fillStyle = "#000000"
    this.drawText()
  }

  unhighlight( ev ){
    let element = ev.detail.question.element

    this.canvas.context.fillStyle = "#ffffff"
    this.canvas.highlightElement( element )

    this.canvas.context.fillStyle = "#000000"
    this.drawText()
  }

  generateInputTable() {
    let [ width, height ] = this.crossword.getSize()

    let table = []

    for( let y = 0; y < height; y++ ){
      let row = []

      for( let x = 0; x < width; x++ ){
        row.push( "" )
      }

      table.push( row )
    }

    return table
  }

  /**
   * 
   * @param { CrosswordElement } element 
   */
  focusInputOnElement( element ) {
    let x = element.position.x
    let y = element.position.y

    this.selectedTile = [ x, y ]
    this.lettersWritten = 0
    this.letterAmount = element.answer.length
  }

  addCanvasListeners() {
    this.canvas.canvas.addEventListener( "mouseleave", this.onMouseLeave.bind(this) )
    this.canvas.canvas.addEventListener( "mousemove",  this.onMouseMove.bind(this) )
    this.canvas.canvas.addEventListener( "click",  this.onClick.bind(this) )
    this.canvas.canvas.addEventListener( "keydown",  this.onKeydown.bind(this) )
  }

  /**
   * 
   * @param { MouseEvent } ev 
   */
  onMouseLeave( ev ){
    this.hoverQuestions = null
    this.hoverIndex = null

    this.hoveredTile = null

    this.highlightFocused()
  }

  /**
   * 
   * @param { MouseEvent } ev 
   */
  onMouseMove( ev ){
    let rect = this.canvas.canvas.getBoundingClientRect()

    let x = ev.clientX - rect.left
    let y = ev.clientY - rect.top

    this.detectTileChange( x, y )
  }

  onClick(){
    this.updateFocused()
    this.highlightFocused()
  }

  /**
   * 
   * @param { KeyboardEvent } ev 
   */
  onKeydown( ev ){
    this.updateInput( ev )
  }

  /**
   * 
   * @param { KeyboardEvent } event
   */
  updateInput( event ){
    let key = event.key.toUpperCase()
    let isBackspace = key == "Backspace"

    if( key.length != 1 && ! isBackspace ) return

    if( this.selectedQuestion == null ) return

    let filterX = this.selectedQuestion.direction == "horizontal" ? 1 : 0
    let filterY = this.selectedQuestion.direction == "vertical"   ? 1 : 0

    if( isBackspace && this.lettersWritten > 0 ) this.lettersWritten--

    let x = this.selectedTile.x + filterX * this.lettersWritten
    let y = this.selectedTile.y + filterY * this.lettersWritten

    if( !isBackspace ){
      console.log("written key", x, y, key)
      this.input[ y ][ x ] = key
      this.lettersWritten++
    } else {
      this.input[ y ][ x ] = ""
    }

    if( this.lettersWritten >= this.letterAmount ){
      this.selectedQuestion = null
      this.selectedTile     = null
      this.lettersWritten   = null
      this.letterAmount     = null
    }

    this.drawText()
  }

  updateFocused(){
    if( this.hoverQuestions.length == 0 ) return
    else {
      if( this.hoverIndex == null ) this.hoverIndex = -1

      this.selectedQuestions = this.hoverQuestions
      this.hoverIndex++ // starts at 0 kekw

      if( this.hoverIndex >= this.hoverQuestions.length){
        this.hoverIndex = null
        this.selectedQuestions = null

        this.highlightFocused()

        return
      }

      this.selectedQuestion = this.crossword.getElement( this.selectedQuestions[ this.hoverIndex ] )
      this.selectedTile = this.selectedQuestion.position
      this.lettersWritten = 0
      this.letterAmount = this.selectedQuestion.answer.length


      if( this.hoverIndex < this.hoverQuestions.length ) return

      this.selectedQuestions = null
      this.hoverIndex = null

      this.selectedQuestion = null
      this.selectedTile     = null
      this.lettersWritten   = null
      this.letterAmount     = null

    }
  }

  onTileChange() {
    this.hoverQuestions = this.crossword.whatOccupiesTile( ...this.hoveredTile )

    this.highlightFocused()
  }

  highlightFocused() {
    const context = this.canvas.context

    context.fillStyle = "#ffffff"
    this.canvas.drawTiles()

    context.fillStyle = "#88ffff"

    if( this.hoverIndex == null && this.hoverQuestions != null ){
      for( const index of this.hoverQuestions ){
        let element = this.crossword.getElement( index )
        this.canvas.highlightElement( element )
      }
    }
    if( this.selectedQuestion ){
      this.canvas.highlightElement( this.selectedQuestion )
    }

    context.fillStyle = "#000000"
    this.drawText()
  }

  detectTileChange( mouseX, mouseY ){
    let tile = this.canvas.getMouseGridPosition( mouseX, mouseY )

    if( tile == null ) return 

    let tileString = tile.toString()

    if( this.hoveredTile == null ){
      this.hoveredTile = tile
      this.onTileChange()
      return
    }

    if( this.hoveredTile.toString() != tileString ){
      this.hoveredTile = tile
      this.onTileChange()
      return
    }
  }

  drawText(){
    this.canvas.font.fontSize = 24
    for( const [ x, y ] of this.crossword.getNonemptyTiles() ){
      if( this.input[ y ][ x ] == "") continue

      this.drawChar( x, y )
    }
  }

  drawChar( x, y ){
    let char = this.input[ y ][ x ]

    let pos = this.canvas.getGridPosition( x, y )
    let gx = pos.x
    let gy = pos.y

    gx += CrosswordCanvas.CW_PADDING / 2
    gy += CrosswordCanvas.CW_PADDING / 2

    this.canvas.font.fillText( gx, gy, char, CanvasFont.FontAnchors.Center )
  }
}

module.exports = {
  CrosswordInput
}