class Camera {
  constructor( graphics ){
    this.graphics = graphics

    this.handleInput = true

    this.moveFactor   = -1
    this.scrollFactor = 0.002

    this.zoomMin = 0.5
    this.zoomMax = 3

    this.position = { x: 0, y: 0}

    this.zoom         = 1
    this.invertedZoom = 1 

    this.bindListeners()
  }

  recenter(){
    let canvas = this.graphics.canvas

    this.position.x = - Math.round( canvas.width  / 2 ),
    this.position.y = - Math.round( canvas.height / 2 )

    this.zoom = 1
  }

  bindListeners(){
    this.graphics.canvas.addEventListener("mousemove", this.rightHoldMove.bind(this))
    this.graphics.canvas.addEventListener("wheel", this.mouseScroll.bind(this))
  }

  rightHoldMove( event ){
    if( ! this.handleInput ) return
    if( event.buttons !== 2 ) return

    let deltaX = event.movementX * this.zoom * this.moveFactor
    let deltaY = event.movementY * this.zoom * this.moveFactor

    this.position.x += deltaX
    this.position.y += deltaY
  }

  mouseScroll( event ){
    if( ! this.handleInput ) return

    let previousZoom = this.zoom

    this.zoom += event.deltaY * this.scrollFactor
    this.invertedZoom = 1 / this.zoom 

    this.zoom = Math.max( this.zoomMin, this.zoom )
    this.zoom = Math.min( this.zoomMax, this.zoom )

    let width  = this.graphics.canvas.width
    let height = this.graphics.canvas.height

    let xDiff = (width  * previousZoom) - (width  * this.zoom)
    let yDiff = (height * previousZoom) - (height * this.zoom)

    this.position.x += xDiff / 2
    this.position.y += yDiff / 2
  }
}

module.exports = Camera