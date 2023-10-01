const Camera = require("./camera")
const Graphics = require("./canvas")

/**
 * Manages mouse operations and provides positions.
 * 
 */
class Mouse {
  /**
   * 
   * @param { Graphics } graphics
   */
  constructor( graphics ) {
    this.graphics = graphics

    console.log( graphics )

    /** @type { Camera } */
    this.camera = graphics.camera

    /** @type { HTMLCanvasElement } */
    this.canvas = graphics.canvas

    this.mousePresent = false

    this._canvasPosition = { x: 0, y: 0 }
    this._cameraPosition = { x: 0, y: 0 }
    this._gridPosition   = { x: 0, y: 0 }

    this.addMouseEvents()
  }

  get canvasPosition() {
    if( ! this.mousePresent ) return null
    
    return this._canvasPosition
  }

  get cameraPosition() {
    if( ! this.mousePresent ) return null
    
    return this._cameraPosition
  }

  get gridPosition() {
    if( ! this.mousePresent ) return null
    
    return this._gridPosition
  }

  /**
   * Sets mouse present flag on when mouse is on canvas.
   */
  onMouseOver() {
    this.mousePresent = true
  }

  /**
   * Sets mouse present flag off when mouse leaves canvas.
   */
  onMouseLeave() {
    this.mousePresent = false
  }

  /**
   * Hanldes mouse movement.
   * 
   * @param { MouseEvent } event 
   */
  onMouseMove( event ) {
    this._canvasPosition.x = event.offsetX
    this._canvasPosition.y = event.offsetY

    this._cameraPosition.x = ( event.offsetX * this.camera.zoom ) + this.camera.position.x
    this._cameraPosition.y = ( event.offsetY * this.camera.zoom ) + this.camera.position.y

    this._gridPosition.x = Math.floor( this._cameraPosition.x / this.graphics.gridSize )
    this._gridPosition.y = Math.floor( this._cameraPosition.y / this.graphics.gridSize )
  }

  addMouseEvents() {
    this.canvas.addEventListener( "mouseover" , this.onMouseOver.bind( this ) )
    this.canvas.addEventListener( "mouseleave", this.onMouseLeave.bind( this ) )
    this.canvas.addEventListener( "mousemove" , this.onMouseMove.bind( this ) )
  }
}

module.exports = Mouse