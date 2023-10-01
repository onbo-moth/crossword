const CrosswordManager = require("../core/crossword.js")
const Camera     = require("./camera.js")
const Mouse      = require("./mouse.js")
const CanvasFont = require("@onbo/canvasfont")

class Graphics {
  constructor(){
    this.gridSize      = 64
    this.mainFontSize  = 32
    this.indexFontSize = 16

    /** @type { HTMLCanvasElement } */
    this.canvas  = document.getElementById("crosswordCanvas")
    this.context = this.canvas.getContext("2d")

    this.font = new CanvasFont( this.canvas )

    this.preventDefaults()

    this.camera = new Camera( this )
    this.camera.recenter()

    /** @type { CrosswordManager | null } */
    this.crossword = null

    this.bindedLoop = this.canvasLoop.bind(this)

    this.font.fontSize = 32

    this.canvasLoop()

    this.mouse = new Mouse( this )
  }

  preventDefaults(){
    this.canvas.addEventListener("contextmenu", function( event ){
      event.preventDefault()
    })

    this.canvas.addEventListener("wheel", function( event ){
      event.preventDefault()
    })
  }

  canvasLoop(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.drawGrid()

    if( this.crossword ){
      // status fills

      let errors = this.crossword.getInvalidBlocks( this.crossword.placedLetters.concat( this.crossword.getPreviewLetters() ) )

      this.context.fillStyle = "#FF8888"

      for( const error of errors ){
        this.fillPosition( error.x, error.y )
      }

      // main letters
      this.font.fontSize = Math.floor( this.mainFontSize / this.camera.zoom )

      let preview = this.crossword.getPreviewLetters()

      this.context.fillStyle = "#888888"

      for( const letter of preview ){
        this.writeStringCenter( ...letter )
      }

      let placed = this.crossword.placedLetters

      this.context.fillStyle = "#000000"

      for( const letter of placed ){
        this.writeStringCenter( ...letter )
      }
    }

    requestAnimationFrame( this.bindedLoop )
  }

  drawGrid(){
    this.drawHorizontalGrid()
    this.drawVerticalGrid()
  }

  drawHorizontalGrid(){
    let startingX = (- this.camera.position.x % this.gridSize) / this.camera.zoom

    for(
      let x = startingX;
      x < this.canvas.width;
      x += this.gridSize / this.camera.zoom
    ){
      this.context.beginPath()

      this.context.moveTo( x, 0 )
      this.context.lineTo( x, this.canvas.height )

      this.context.stroke()

      this.context.closePath()
    }
  }

  drawVerticalGrid(){
    let startingY = (- this.camera.position.y % this.gridSize) / this.camera.zoom

    for(
      let y = startingY;
      y < this.canvas.height;
      y += this.gridSize / this.camera.zoom
    ){
      this.context.beginPath()

      this.context.moveTo( 0, y )
      this.context.lineTo( this.canvas.width, y )

      this.context.stroke()

      this.context.closePath()
    }
  }

  getGridTopLeft( x, y ){
    const invertedZoom = 1 / this.camera.zoom

    let zeroX = - this.camera.position.x * invertedZoom
    let zeroY = - this.camera.position.y * invertedZoom

    let gridX = zeroX + x * this.gridSize * invertedZoom
    let gridY = zeroY + y * this.gridSize * invertedZoom

    return { x: gridX, y: gridY }
  }

  fillPosition( x, y ){
    let topLeft     = this.getGridTopLeft( x,     y     )
    let bottomRight = this.getGridTopLeft( x + 1, y + 1 )

    if( bottomRight.x < 0 || topLeft.x > this.canvas.width ) return
    if( bottomRight.y < 0 || topLeft.y > this.canvas.width ) return

    let width  = bottomRight.x - topLeft.x
    let height = bottomRight.y - topLeft.y

    this.context.fillRect( topLeft.x, topLeft.y, width, height )
  }

  writeStringCenter( x, y, string ){
    let topLeft     = this.getGridTopLeft( x,     y     )
    let bottomRight = this.getGridTopLeft( x + 1, y + 1 )

    let centerX = ( topLeft.x + bottomRight.x ) / 2
    let centerY = ( topLeft.y + bottomRight.y ) / 2

    const centerAnchor = CanvasFont.FontAnchors.Center
    this.font.fillText( centerX, centerY, string, centerAnchor )
  }

  writeStringTopLeft( x, y, string ){
    let topLeft = this.getGridTopLeft( x, y )

    this.context.fillStyle = "#444444"

    this.font.fillText( topLeft.x, topLeft.y, string )
  }

  writeStringBottomRight( x, y, string ){
    let topLeft = this.getGridTopLeft( x + 1, y + 1 )

    this.context.fillStyle = "#444444"

    const anchor = CanvasFont.FontAnchors.BottomRight
    this.font.fillText( topLeft.x, topLeft.y, string, anchor )
  }
}


module.exports = Graphics