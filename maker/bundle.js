/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./maker/js/core/crossword.js":
/*!************************************!*\
  !*** ./maker/js/core/crossword.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Graphics = __webpack_require__(/*! ../graphics/canvas */ \"./maker/js/graphics/canvas.js\")\nconst QuestionManager = __webpack_require__(/*! ./questions */ \"./maker/js/core/questions.js\")\n\nclass CrosswordManager {\n  /**\n   * \n   * @param { QuestionManager } questionManager \n   * @param { Graphics } graphics \n   */\n  constructor( questionManager, graphics ){\n    this.questionManager = questionManager\n    this.graphics = graphics\n    this.canvas = graphics.canvas\n    this.mouse = graphics.mouse\n\n    this.graphics.crossword = this\n\n    this.placedQuestions = new Map()\n    this.placedLetters   = []\n\n    this.previewQuestion = null\n\n    this.questionManager.events.addEventListener(\"place\" , this.onPlaceButton.bind(this))\n    this.questionManager.events.addEventListener(\"edit\"  , this.onEdit.bind(this))\n    this.questionManager.events.addEventListener(\"remove\", this.onRemove.bind(this))\n\n    this.canvas.addEventListener(\"click\", this.placeAnswer.bind(this))\n  }\n\n  onPlaceButton( event ){\n    console.log(event)\n\n    this.setPreview( event.detail )\n  }\n\n  onEdit( event ){\n    let question = event.detail\n\n    this.placedQuestions.delete( question )\n    this.placedLetters = this.getPlacedLetters()\n  }\n\n  onRemove( event ){\n    let question = event.detail\n\n    this.placedQuestions.delete( question )\n    this.placedLetters = this.getPlacedLetters()\n  }  \n\n  setPreview( question ){\n    this.previewQuestion = question\n\n    this.placedQuestions.delete( question )\n    this.placedLetters = this.getPlacedLetters()\n  }\n\n  clearPreview(){\n    this.previewQuestion = null\n  }\n\n  /**\n   * \n   * @param { QuestionElement } question \n   * @param { { x: Number, y: Number } } position \n   */\n  getAnswerLetters( question, position ) {\n    const answer    = question.answer.toUpperCase()\n    const direction = question.direction\n\n    const filter = { x: 0, y: 0 }\n\n    if(      direction == \"horizontal\" ) filter.x = 1\n    else if( direction == \"vertical\" )   filter.y = 1\n\n    let letters = []\n\n    for( let index = 0; index < answer.length; index++ ){\n      let x = position.x + index * filter.x\n      let y = position.y + index * filter.y\n      letters.push( [ x, y, answer[ index ] ] )\n    }\n\n    return letters\n  }\n\n  getPreviewLetters() {\n    const empty = []\n\n    if( ! this.previewQuestion ) return empty\n\n    let position = this.mouse.gridPosition\n\n    if( ! position ) return empty\n\n    return this.getAnswerLetters( this.previewQuestion, position )\n  }\n\n  placeAnswer() {\n    if( ! this.previewQuestion ) return false\n    if( ! this.mouse.gridPosition ) return false // how\n\n    if( this.hasInvalidBlock( this.placedLetters.concat( this.getPreviewLetters() ) ) ) return false\n\n    let positionClone = { ... this.mouse.gridPosition }\n\n    this.placedQuestions.set( this.previewQuestion, positionClone )\n\n    this.clearPreview()\n\n    this.placedLetters = this.getPlacedLetters()\n\n    return true\n  }\n\n  getPlacedLetters() {\n    let letterGroups = []\n\n    for( const [ question, position ] of this.placedQuestions.entries() ){\n      letterGroups.push( this.getAnswerLetters( question, position ) )\n    }\n\n    let letters = letterGroups.flat()\n\n    return letters\n  }\n\n  areLettersValid( firstLetter, secondLetter ){\n    // Check positions if match\n    if( firstLetter[0] != secondLetter[0] ) return true\n    if( firstLetter[1] != secondLetter[1] ) return true\n\n    // compare letters\n    if( firstLetter[2] == secondLetter[2] ) return true \n\n    return false\n  }\n\n  getInvalidBlocks( letterArray ){\n    let invalidBlocks = []\n\n    for( let firstIndex = 0; firstIndex < letterArray.length; firstIndex++ ){\n      for( let secondIndex = firstIndex + 1; secondIndex < letterArray.length; secondIndex++){\n        let firstLetter  = letterArray[ firstIndex ]\n        let secondLetter = letterArray[ secondIndex ]\n\n        if( this.areLettersValid( firstLetter, secondLetter) ) continue\n\n        invalidBlocks.push( { x: firstLetter[0], y: firstLetter[1] } )\n      }\n    }\n\n    return invalidBlocks\n  }\n\n  hasInvalidBlock( letterArray ){\n    for( let firstIndex = 0; firstIndex < letterArray.length; firstIndex++ ){\n      for( let secondIndex = firstIndex + 1; secondIndex < letterArray.length; secondIndex++){\n        let firstLetter  = letterArray[ firstIndex ]\n        let secondLetter = letterArray[ secondIndex ]\n\n        if( this.areLettersValid( firstLetter, secondLetter) ) continue\n\n        return { x: firstLetter[0], y: firstLetter[1] }\n      }\n    }\n\n    return null\n  }\n}\n\nmodule.exports = CrosswordManager\n\n//# sourceURL=webpack:///./maker/js/core/crossword.js?");

/***/ }),

/***/ "./maker/js/core/exporter.js":
/*!***********************************!*\
  !*** ./maker/js/core/exporter.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const CrosswordTitle = __webpack_require__(/*! ../ui/title */ \"./maker/js/ui/title.js\")\nconst CrosswordManager = __webpack_require__(/*! ./crossword */ \"./maker/js/core/crossword.js\")\nconst QuestionManager = __webpack_require__(/*! ./questions */ \"./maker/js/core/questions.js\")\n\nclass Exporter extends EventTarget {\n  /**\n   * \n   * @param { CrosswordTitle } titleManager \n   * @param { QuestionManager } questionManager \n   * @param { CrosswordManager } crosswordManager \n   */\n  constructor( titleManager, questionManager, crosswordManager ){\n    super()\n\n    this.title     = titleManager\n    this.questions = questionManager\n    this.crossword = crosswordManager\n\n    this.fileInput = document.createElement(\"input\")\n    this.fileInput.type = \"file\"\n\n    this.fileInput.addEventListener(\"change\", this.onImport.bind( this ))\n\n    this.downloadLink = document.createElement(\"a\")\n    this.downloadLink.download = \"save.cwd\"\n\n    document.getElementById(\"importButton\").addEventListener(\"click\", this.openImport.bind( this ))\n    document.getElementById(\"exportButton\").addEventListener(\"click\", this.openExport.bind( this ))\n  }\n\n  openImport() {\n    this.fileInput.click()\n  }\n\n  openExport() {\n    let save = {}\n\n    save.title = this.title.getTitle()\n\n    save.questions = []\n\n    for( const question of this.questions.questions ){\n      let data = []\n\n      data.push( question.question )\n      data.push( question.answer )\n      data.push( question.direction )\n\n      save.questions.push( data )\n    }\n\n    save.crossword = []\n\n    for( const [ question, position ] of this.crossword.placedQuestions.entries() ){\n      let index = this.questions.questions.indexOf( question )\n\n      save.crossword.push( [ index, position ] )\n    }\n\n    this.export( JSON.stringify( save ) )\n  }\n\n  /**\n   * \n   * @param { Event } event \n   */\n  onImport( event ){\n    const file = event.target.files[0]\n    if( ! file ) return false\n\n    this.import( file )\n  }\n\n  import( file ) {\n    console.log( file )\n\n    const reader = new FileReader()\n\n    reader.addEventListener(\"load\", function( event ){\n\n      let object = JSON.parse( event.target.result )\n\n      this.title.setTitle( object.title )\n\n\n      for( const question of this.questions.questions ){\n        question.forceRemove()\n      }\n\n      this.questions.questions = []\n\n      for ( const question of object.questions ){\n        this.questions.addQuestion({ \n          event: \"confirm\",\n          data: {\n            question: question[0],\n            answer: question[1],\n            direction: question[2]\n          }\n        })\n      }\n\n      this.crossword.clearPreview()\n\n      for( const [ index, position ] of object.crossword ){\n        this.crossword.placedQuestions.set( this.questions.questions[ index ], position )\n      }\n\n      console.log( this.crossword )\n      console.log( this.questions)\n\n      this.crossword.placedLetters = this.crossword.getPlacedLetters()\n\n    }.bind( this ))\n\n    reader.readAsText( file )\n  }\n\n  export( string ){\n    let blob = new Blob( [string], { type: \"text/plain\" } )\n\n    this.downloadLink.href = URL.createObjectURL( blob )\n\n    this.downloadLink.click()\n  }\n}\n\nmodule.exports = Exporter\n\n//# sourceURL=webpack:///./maker/js/core/exporter.js?");

/***/ }),

/***/ "./maker/js/core/questions.js":
/*!************************************!*\
  !*** ./maker/js/core/questions.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const listElementTemplate = __webpack_require__(/*! ../ui/questionTemplate.js */ \"./maker/js/ui/questionTemplate.js\")\n\nconst lang = {\n  removeQuestionPrompt: \"Are you sure you want to remove this question?\"\n}\n\nclass QuestionManager {\n  constructor(modalManager){\n    this.modalManager = modalManager\n\n    this.list = $(\"#questionList\")\n\n    this.questions = []\n\n    this.events = new EventTarget()\n\n    $(\"#addQuestionButton\").on(\"click\", this.addQuestionModal.bind(this))\n    this.events.addEventListener(\"remove\", this.onRemove.bind(this))\n  }\n\n  addQuestionModal(){\n    let promise = this.modalManager.openModal()\n\n    promise.then(this.addQuestion.bind(this))\n  }\n  \n  addQuestion( data ){\n    if( data.event !== \"confirm\" ) return\n    \n    let listElement = listElementTemplate(\n      data.data.question,\n      data.data.answer,\n      data.data.direction\n    )\n\n    this.list.append(listElement)\n\n    this.questions.push( new QuestionElement(\n      this,\n      listElement,\n      data.data\n    ) )\n  }\n\n  onRemove( event ){\n    let object = event.detail\n\n    let questionIndex = this.questions.indexOf( object )\n    this.questions.splice( questionIndex, 1 )\n\n    object.element.remove()\n  }\n}\n\nclass QuestionElement extends EventTarget {\n  constructor(manager, element, data){\n    super()\n\n    this.manager = manager\n    this.modalManager = manager.modalManager\n\n    this.id = Symbol()\n    this.element = element\n\n    this.question  = data.question\n    this.answer    = data.answer\n    this.direction = data.direction\n\n    console.log(this.element)\n\n    this.buttons = this.element.getElementsByTagName(\"button\")\n    this.texts = this.element.getElementsByTagName(\"span\")\n\n    this.buttons.placeButton.addEventListener(\n      \"click\",\n      function(){\n        this.manager.events.dispatchEvent(\n          new CustomEvent(\"place\", { detail: this } )\n        )\n      }.bind(this)\n    )\n\n    this.buttons.editButton.addEventListener(\n      \"click\",\n      this.editQuestionModal.bind(this)\n    )\n\n    this.buttons.removeButton.addEventListener(\n      \"click\",\n      this.removeQuestion.bind(this)\n    )\n  }\n\n  editQuestionModal() {\n    let promise = this.modalManager.openModal()\n\n    promise.then(this.editQuestion.bind(this))\n  }\n\n  editQuestion( data ){\n    if( data.event !== \"confirm\" ) return\n\n    this.question  = data.data.question\n    this.answer    = data.data.answer\n    this.direction = data.data.direction\n\n    this.updateInfo()\n\n    this.manager.events.dispatchEvent(\n      new CustomEvent(\"edit\", { detail: this } )\n    )\n  }\n\n  removeQuestion(){\n    if( confirm( lang.removeQuestionPrompt ) === false ) return\n    \n    this.manager.events.dispatchEvent(\n      new CustomEvent(\"remove\", { detail: this } )\n    )\n  }\n\n  forceRemove(){\n    this.manager.events.dispatchEvent(\n      new CustomEvent(\"remove\", { detail: this } )\n    )\n  }\n\n  updateInfo(){\n    this.texts.question.innerText  = this.question\n    this.texts.answer.innerText    = this.answer\n    this.texts.direction.innerText = \"Direction: \" + this.direction\n  }\n}\n\nmodule.exports = QuestionManager\n\n//# sourceURL=webpack:///./maker/js/core/questions.js?");

/***/ }),

/***/ "./maker/js/entry.js":
/*!***************************!*\
  !*** ./maker/js/entry.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const CrosswordTitle   = __webpack_require__(/*! ./ui/title.js */ \"./maker/js/ui/title.js\")\nconst ModalManager     = __webpack_require__(/*! ./ui/modal.js */ \"./maker/js/ui/modal.js\")\nconst QuestionManager  = __webpack_require__(/*! ./core/questions.js */ \"./maker/js/core/questions.js\")\nconst Graphics         = __webpack_require__(/*! ./graphics/canvas.js */ \"./maker/js/graphics/canvas.js\")\nconst CrosswordManager = __webpack_require__(/*! ./core/crossword.js */ \"./maker/js/core/crossword.js\")\nconst Exporter         = __webpack_require__(/*! ./core/exporter.js */ \"./maker/js/core/exporter.js\")\n\nlet title     = new CrosswordTitle()\nlet modal     = new ModalManager()\nlet qlist     = new QuestionManager(modal)\nlet canvas    = new Graphics()\nlet crossword = new CrosswordManager( qlist, canvas )\nlet exporter  = new Exporter(title, qlist, crossword)\n\n//# sourceURL=webpack:///./maker/js/entry.js?");

/***/ }),

/***/ "./maker/js/graphics/camera.js":
/*!*************************************!*\
  !*** ./maker/js/graphics/camera.js ***!
  \*************************************/
/***/ ((module) => {

eval("class Camera {\n  constructor( graphics ){\n    this.graphics = graphics\n\n    this.handleInput = true\n\n    this.moveFactor   = -1\n    this.scrollFactor = 0.002\n\n    this.zoomMin = 0.5\n    this.zoomMax = 3\n\n    this.position = { x: 0, y: 0}\n\n    this.zoom         = 1\n    this.invertedZoom = 1 \n\n    this.bindListeners()\n  }\n\n  recenter(){\n    let canvas = this.graphics.canvas\n\n    this.position.x = - Math.round( canvas.width  / 2 ),\n    this.position.y = - Math.round( canvas.height / 2 )\n\n    this.zoom = 1\n  }\n\n  bindListeners(){\n    this.graphics.canvas.addEventListener(\"mousemove\", this.rightHoldMove.bind(this))\n    this.graphics.canvas.addEventListener(\"wheel\", this.mouseScroll.bind(this))\n  }\n\n  rightHoldMove( event ){\n    if( ! this.handleInput ) return\n    if( event.buttons !== 2 ) return\n\n    let deltaX = event.movementX * this.zoom * this.moveFactor\n    let deltaY = event.movementY * this.zoom * this.moveFactor\n\n    this.position.x += deltaX\n    this.position.y += deltaY\n  }\n\n  mouseScroll( event ){\n    if( ! this.handleInput ) return\n\n    let previousZoom = this.zoom\n\n    this.zoom += event.deltaY * this.scrollFactor\n    this.invertedZoom = 1 / this.zoom \n\n    this.zoom = Math.max( this.zoomMin, this.zoom )\n    this.zoom = Math.min( this.zoomMax, this.zoom )\n\n    let width  = this.graphics.canvas.width\n    let height = this.graphics.canvas.height\n\n    let xDiff = (width  * previousZoom) - (width  * this.zoom)\n    let yDiff = (height * previousZoom) - (height * this.zoom)\n\n    this.position.x += xDiff / 2\n    this.position.y += yDiff / 2\n  }\n}\n\nmodule.exports = Camera\n\n//# sourceURL=webpack:///./maker/js/graphics/camera.js?");

/***/ }),

/***/ "./maker/js/graphics/canvas.js":
/*!*************************************!*\
  !*** ./maker/js/graphics/canvas.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const CrosswordManager = __webpack_require__(/*! ../core/crossword.js */ \"./maker/js/core/crossword.js\")\nconst Camera     = __webpack_require__(/*! ./camera.js */ \"./maker/js/graphics/camera.js\")\nconst Mouse      = __webpack_require__(/*! ./mouse.js */ \"./maker/js/graphics/mouse.js\")\nconst CanvasFont = __webpack_require__(/*! @onbo/canvasfont */ \"./node_modules/@onbo/canvasfont/main.js\")\n\nclass Graphics {\n  constructor(){\n    this.gridSize      = 64\n    this.mainFontSize  = 32\n    this.indexFontSize = 16\n\n    /** @type { HTMLCanvasElement } */\n    this.canvas  = document.getElementById(\"crosswordCanvas\")\n    this.context = this.canvas.getContext(\"2d\")\n\n    this.font = new CanvasFont( this.canvas )\n\n    this.preventDefaults()\n\n    this.camera = new Camera( this )\n    this.camera.recenter()\n\n    /** @type { CrosswordManager | null } */\n    this.crossword = null\n\n    this.bindedLoop = this.canvasLoop.bind(this)\n\n    this.font.fontSize = 32\n\n    this.canvasLoop()\n\n    this.mouse = new Mouse( this )\n  }\n\n  preventDefaults(){\n    this.canvas.addEventListener(\"contextmenu\", function( event ){\n      event.preventDefault()\n    })\n\n    this.canvas.addEventListener(\"wheel\", function( event ){\n      event.preventDefault()\n    })\n  }\n\n  canvasLoop(){\n    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)\n\n    this.drawGrid()\n\n    if( this.crossword ){\n      // status fills\n\n      let errors = this.crossword.getInvalidBlocks( this.crossword.placedLetters.concat( this.crossword.getPreviewLetters() ) )\n\n      this.context.fillStyle = \"#FF8888\"\n\n      for( const error of errors ){\n        this.fillPosition( error.x, error.y )\n      }\n\n      // main letters\n      this.font.fontSize = Math.floor( this.mainFontSize / this.camera.zoom )\n\n      let preview = this.crossword.getPreviewLetters()\n\n      this.context.fillStyle = \"#888888\"\n\n      for( const letter of preview ){\n        this.writeStringCenter( ...letter )\n      }\n\n      let placed = this.crossword.placedLetters\n\n      this.context.fillStyle = \"#000000\"\n\n      for( const letter of placed ){\n        this.writeStringCenter( ...letter )\n      }\n    }\n\n    requestAnimationFrame( this.bindedLoop )\n  }\n\n  drawGrid(){\n    this.drawHorizontalGrid()\n    this.drawVerticalGrid()\n  }\n\n  drawHorizontalGrid(){\n    let startingX = (- this.camera.position.x % this.gridSize) / this.camera.zoom\n\n    for(\n      let x = startingX;\n      x < this.canvas.width;\n      x += this.gridSize / this.camera.zoom\n    ){\n      this.context.beginPath()\n\n      this.context.moveTo( x, 0 )\n      this.context.lineTo( x, this.canvas.height )\n\n      this.context.stroke()\n\n      this.context.closePath()\n    }\n  }\n\n  drawVerticalGrid(){\n    let startingY = (- this.camera.position.y % this.gridSize) / this.camera.zoom\n\n    for(\n      let y = startingY;\n      y < this.canvas.height;\n      y += this.gridSize / this.camera.zoom\n    ){\n      this.context.beginPath()\n\n      this.context.moveTo( 0, y )\n      this.context.lineTo( this.canvas.width, y )\n\n      this.context.stroke()\n\n      this.context.closePath()\n    }\n  }\n\n  getGridTopLeft( x, y ){\n    const invertedZoom = 1 / this.camera.zoom\n\n    let zeroX = - this.camera.position.x * invertedZoom\n    let zeroY = - this.camera.position.y * invertedZoom\n\n    let gridX = zeroX + x * this.gridSize * invertedZoom\n    let gridY = zeroY + y * this.gridSize * invertedZoom\n\n    return { x: gridX, y: gridY }\n  }\n\n  fillPosition( x, y ){\n    let topLeft     = this.getGridTopLeft( x,     y     )\n    let bottomRight = this.getGridTopLeft( x + 1, y + 1 )\n\n    if( bottomRight.x < 0 || topLeft.x > this.canvas.width ) return\n    if( bottomRight.y < 0 || topLeft.y > this.canvas.width ) return\n\n    let width  = bottomRight.x - topLeft.x\n    let height = bottomRight.y - topLeft.y\n\n    this.context.fillRect( topLeft.x, topLeft.y, width, height )\n  }\n\n  writeStringCenter( x, y, string ){\n    let topLeft     = this.getGridTopLeft( x,     y     )\n    let bottomRight = this.getGridTopLeft( x + 1, y + 1 )\n\n    let centerX = ( topLeft.x + bottomRight.x ) / 2\n    let centerY = ( topLeft.y + bottomRight.y ) / 2\n\n    const centerAnchor = CanvasFont.FontAnchors.Center\n    this.font.fillText( centerX, centerY, string, centerAnchor )\n  }\n\n  writeStringTopLeft( x, y, string ){\n    let topLeft = this.getGridTopLeft( x, y )\n\n    this.context.fillStyle = \"#444444\"\n\n    this.font.fillText( topLeft.x, topLeft.y, string )\n  }\n\n  writeStringBottomRight( x, y, string ){\n    let topLeft = this.getGridTopLeft( x + 1, y + 1 )\n\n    this.context.fillStyle = \"#444444\"\n\n    const anchor = CanvasFont.FontAnchors.BottomRight\n    this.font.fillText( topLeft.x, topLeft.y, string, anchor )\n  }\n}\n\n\nmodule.exports = Graphics\n\n//# sourceURL=webpack:///./maker/js/graphics/canvas.js?");

/***/ }),

/***/ "./maker/js/graphics/mouse.js":
/*!************************************!*\
  !*** ./maker/js/graphics/mouse.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Camera = __webpack_require__(/*! ./camera */ \"./maker/js/graphics/camera.js\")\nconst Graphics = __webpack_require__(/*! ./canvas */ \"./maker/js/graphics/canvas.js\")\n\n/**\n * Manages mouse operations and provides positions.\n * \n */\nclass Mouse {\n  /**\n   * \n   * @param { Graphics } graphics\n   */\n  constructor( graphics ) {\n    this.graphics = graphics\n\n    console.log( graphics )\n\n    /** @type { Camera } */\n    this.camera = graphics.camera\n\n    /** @type { HTMLCanvasElement } */\n    this.canvas = graphics.canvas\n\n    this.mousePresent = false\n\n    this._canvasPosition = { x: 0, y: 0 }\n    this._cameraPosition = { x: 0, y: 0 }\n    this._gridPosition   = { x: 0, y: 0 }\n\n    this.addMouseEvents()\n  }\n\n  get canvasPosition() {\n    if( ! this.mousePresent ) return null\n    \n    return this._canvasPosition\n  }\n\n  get cameraPosition() {\n    if( ! this.mousePresent ) return null\n    \n    return this._cameraPosition\n  }\n\n  get gridPosition() {\n    if( ! this.mousePresent ) return null\n    \n    return this._gridPosition\n  }\n\n  /**\n   * Sets mouse present flag on when mouse is on canvas.\n   */\n  onMouseOver() {\n    this.mousePresent = true\n  }\n\n  /**\n   * Sets mouse present flag off when mouse leaves canvas.\n   */\n  onMouseLeave() {\n    this.mousePresent = false\n  }\n\n  /**\n   * Hanldes mouse movement.\n   * \n   * @param { MouseEvent } event \n   */\n  onMouseMove( event ) {\n    this._canvasPosition.x = event.offsetX\n    this._canvasPosition.y = event.offsetY\n\n    this._cameraPosition.x = ( event.offsetX * this.camera.zoom ) + this.camera.position.x\n    this._cameraPosition.y = ( event.offsetY * this.camera.zoom ) + this.camera.position.y\n\n    this._gridPosition.x = Math.floor( this._cameraPosition.x / this.graphics.gridSize )\n    this._gridPosition.y = Math.floor( this._cameraPosition.y / this.graphics.gridSize )\n  }\n\n  addMouseEvents() {\n    this.canvas.addEventListener( \"mouseover\" , this.onMouseOver.bind( this ) )\n    this.canvas.addEventListener( \"mouseleave\", this.onMouseLeave.bind( this ) )\n    this.canvas.addEventListener( \"mousemove\" , this.onMouseMove.bind( this ) )\n  }\n}\n\nmodule.exports = Mouse\n\n//# sourceURL=webpack:///./maker/js/graphics/mouse.js?");

/***/ }),

/***/ "./maker/js/ui/modal.js":
/*!******************************!*\
  !*** ./maker/js/ui/modal.js ***!
  \******************************/
/***/ ((module) => {

eval("class ModalManager {\n  constructor(){\n    this.modal = $(\"#addQuestionModal\")\n    this.form = $(\"#addQuestionModal form\")[0]\n    this.confirm = $(\"#modalConfirm\")\n\n    this.waitingPromises = []\n\n    this.modal.on(\"hide.bs.modal\", this.onClose.bind(this))\n    this.confirm.on(\"click\", this.onConfirm.bind(this))\n  }\n\n  getInfo(){\n    let data = new FormData( this.form ).entries()\n\n    // this is dumb af but works\n    let question  = data.next().value[1]\n    let answer    = data.next().value[1]\n    let direction = data.next().value[1]\n\n    console.log( { question, answer, direction } )\n\n    return { question, answer, direction }\n  }\n\n  openModal() {\n    this.modal.modal(\"show\")\n\n    let promiseResolve;\n\n    let promise = new Promise(function( resolve, reject ){\n      promiseResolve = resolve\n    })\n\n    this.waitingPromises.push(promiseResolve)\n\n    return promise\n  }\n\n  onClose() {\n    this.resolvePromises( \"close\" )\n  }\n\n  onConfirm() {\n    this.resolvePromises( \"confirm\" )\n\n    this.modal.modal(\"hide\")\n  }\n\n  resolvePromises( event ){\n    let modalEvent = new ModalEvent( event, this.getInfo() )\n\n    for( let promise of this.waitingPromises ){\n      promise( modalEvent )\n    }\n\n    this.waitingPromises = []\n  }\n}\n\nclass ModalEvent {\n  constructor( event, data ){\n    /** @type { \"close\" | \"confirm\" } */\n    this.event = event\n    this.data  = data\n  }\n}\n\nmodule.exports = ModalManager\n\n//# sourceURL=webpack:///./maker/js/ui/modal.js?");

/***/ }),

/***/ "./maker/js/ui/questionTemplate.js":
/*!*****************************************!*\
  !*** ./maker/js/ui/questionTemplate.js ***!
  \*****************************************/
/***/ ((module) => {

eval("const lang = {\n  placeButton: \"Umieść\",\n  editButton: \"Edytuj\",\n  removeButton: \"Usuń\"\n}\n\nfunction listElementTemplate( question, answer, direction ){\n  let listElement = document.createElement(\"li\")\n\n  listElement.classList.add(\"list-group-item\")\n  listElement.classList.add(\"d-flex\")\n  listElement.classList.add(\"justify-content-between\")\n  listElement.classList.add(\"align-items-center\")\n\n\n  let contentElement = document.createElement(\"div\")\n\n\n  let questionSpan = document.createElement(\"span\")\n\n  questionSpan.classList.add(\"d-block\")\n\n  questionSpan.setAttribute(\"name\", \"question\")\n\n  questionSpan.innerText = question\n\n\n  let boldAnswerWrapper = document.createElement(\"b\")\n\n\n  let answerSpan = document.createElement(\"span\")\n\n  answerSpan.classList.add(\"font-weight-bold\")\n\n  answerSpan.setAttribute(\"name\", \"answer\")  \n\n  answerSpan.innerText = answer\n\n\n  boldAnswerWrapper.appendChild(answerSpan)\n\n\n  contentElement.appendChild(questionSpan)\n  contentElement.appendChild(boldAnswerWrapper)\n\n\n  let buttonsElement = document.createElement(\"div\")\n\n\n  let placeButton = document.createElement(\"button\")\n\n  placeButton.classList.add(\"btn\")\n  placeButton.classList.add(\"btn-sm\")\n  placeButton.classList.add(\"btn-info\")\n  placeButton.classList.add(\"mx-1\")\n\n  placeButton.setAttribute(\"name\", \"placeButton\")\n\n  placeButton.innerText = lang.placeButton\n\n\n  let editButton = document.createElement(\"button\")\n\n  editButton.classList.add(\"btn\")\n  editButton.classList.add(\"btn-sm\")\n  editButton.classList.add(\"btn-warning\")\n  editButton.classList.add(\"mx-1\")\n\n  editButton.setAttribute(\"name\", \"editButton\")\n\n  editButton.innerText = lang.editButton\n\n\n  let removeButton = document.createElement(\"button\")\n\n  removeButton.classList.add(\"btn\")\n  removeButton.classList.add(\"btn-sm\")\n  removeButton.classList.add(\"btn-danger\")\n  removeButton.classList.add(\"mx-1\")\n\n  removeButton.setAttribute(\"name\", \"removeButton\")\n\n  removeButton.innerText = lang.removeButton\n\n\n  let directionSpan = document.createElement(\"span\")\n\n  directionSpan.setAttribute(\"name\", \"direction\")\n\n  directionSpan.innerText = \"Direction: \" + direction\n\n  directionSpan.classList.add(\"d-block\")\n\n  buttonsElement.appendChild(placeButton)\n  buttonsElement.appendChild(editButton)\n  buttonsElement.appendChild(removeButton)\n\n  buttonsElement.appendChild(directionSpan)\n\n\n  listElement.appendChild(contentElement)\n  listElement.appendChild(buttonsElement)\n\n\n  return listElement\n}\n\nmodule.exports = listElementTemplate\n\n//# sourceURL=webpack:///./maker/js/ui/questionTemplate.js?");

/***/ }),

/***/ "./maker/js/ui/title.js":
/*!******************************!*\
  !*** ./maker/js/ui/title.js ***!
  \******************************/
/***/ ((module) => {

eval("/**\n * Manages the title for the currently edited crossword.\n */\nclass CrosswordTitle {\n  constructor(){\n    this.titleElement = $(\"#crosswordTitle\")\n    this.inputElement = $(\"#crosswordTitleInput\")\n\n    this.title = this.titleElement.text()\n\n    this.bootstrapDisplayNone = \"d-none\"\n\n    this.bindListeners()\n  }\n\n  /**\n   * Retrieves the current title.\n   * @returns {string}\n   */\n  getTitle(){\n    return this.title\n  }\n\n  /**\n   * Sets a title for crossword. Use when importing.\n   * @param {string} newTitle \n   */\n  setTitle( newTitle ){\n    this.title = newTitle\n    this.titleElement.text( newTitle )\n  }\n\n  /**\n   * Binds listeners to the title and input elements.\n   */\n  bindListeners(){\n    this.titleElement.on(\"click\", this.onTitleClick.bind(this))\n\n    this.inputElement.on(\"focusout\", this.onInputBlur.bind(this))\n    this.inputElement.on(\"keypress\", this.onInputKey.bind(this))\n  }\n\n  /**\n   * Changes title into a input and automatically focuses.\n   */\n  onTitleClick(){\n    this.titleElement.addClass( this.bootstrapDisplayNone )\n\n    this.inputElement.val( this.titleElement.text() )\n\n    this.inputElement.removeClass( this.bootstrapDisplayNone )\n    this.inputElement.focus()\n  }\n\n  /**\n   * Sets title as input gets unfocused.\n   */\n  onInputBlur(){\n    this.inputElement.addClass( this.bootstrapDisplayNone )\n\n    let value = this.inputElement.val()\n    if( value.trim() === \"\" ) value = \"Tytuł\"\n    \n    this.titleElement.text( value )\n    this.title = value\n\n    this.titleElement.removeClass( this.bootstrapDisplayNone )\n  }\n\n  /**\n   * Unfocuses input if enter is pressed.\n   * @param {object} JQEvent A event object returned by JQuery's on() callback.\n   */\n  onInputKey( JQEvent ){\n    let key = JQEvent.originalEvent.code\n\n    if( key === \"Enter\" ) this.inputElement.blur()\n  }\n}\n\nmodule.exports = CrosswordTitle\n\n//# sourceURL=webpack:///./maker/js/ui/title.js?");

/***/ }),

/***/ "./node_modules/@onbo/canvasfont/main.js":
/*!***********************************************!*\
  !*** ./node_modules/@onbo/canvasfont/main.js ***!
  \***********************************************/
/***/ ((module) => {

eval("/**\n * Creates a easy font API for canvas.\n */\nclass CanvasFont {\n  static FontAnchors = {\n    TopLeft:      Symbol(\"AnchorTopLeft\"),\n    TopCenter:    Symbol(\"AnchorTopCenter\"),\n    TopRight:     Symbol(\"AnchorTopRight\"),\n    Left:         Symbol(\"AnchorLeft\"),\n    Center:       Symbol(\"AnchorCenter\"),\n    Right:        Symbol(\"AnchorRight\"),\n    BottomLeft:   Symbol(\"AnchorBottomLeft\"),\n    BottomCenter: Symbol(\"AnchorBottomCenter\"),\n    BottomRight:  Symbol(\"AnchorBottomRight\")\n  }\n\n  /**\n   * Initializes the canvas font API.\n   * \n   * @param { HTMLCanvasElement } canvas \n   */\n  constructor( canvas ){\n    this.canvas  = canvas\n    this.context = canvas.getContext(\"2d\")\n\n    // Canvas defaults baseline to bottom, which causes problems.\n    // (By drawing in bottom-left anchor and swapping measureText's ascent and descent properties.)\n    // It is best to use top baseline, since it's easier to calculate positions and follows the common canvas system.\n    this.context.textBaseline = \"top\"\n\n    this._fontSize   = 12\n    this._fontFamily = \"sans-serif\"\n    this._fontStyle  = \"normal\"\n  }\n\n  get fontSize() {\n    return this._fontSize\n  }\n\n  set fontSize( value ) {\n    if( typeof value != \"number\" ) return\n\n    this._fontSize = value\n    this.compileFont()\n  }\n\n  get fontFamily() {\n    return this._fontFamily\n  }\n\n  set fontFamily( value ) {\n    if( typeof value != \"string\" ) return\n\n    this._fontFamily = value\n    this.compileFont()\n  }\n\n  get fontStyle() {\n    return this._fontStyle\n  }\n\n  set fontStyle( value ) {\n    if( typeof value != \"string\" ) return\n\n    this._fontStyle = value\n    this.compileFont()\n  }\n\n  /**\n   * Sets the font attribute for the 2d context.\n   */\n  compileFont(){\n    this.context.font = `${this.fontStyle} ${this.fontSize}px ${this.fontFamily}`\n  }\n\n  /**\n   * Gets size of text's bounding box.\n   * Doesn't check for ideographic / alphabetic baselines.\n   * \n   * @param { String } text \n   * @returns \n   */\n  getTextboxSize( text ){\n    let measures = this.context.measureText( text )\n\n    return {\n      width:  measures.width,\n      height: measures.actualBoundingBoxDescent - measures.actualBoundingBoxAscent\n    }\n  }\n\n  /**\n   * Returns anchor offset position for textbox width and height.\n   * \n   * @param { Number } width \n   * @param { Number } height \n   * @param { Symbol } anchor \n   * @returns { { anchorX: Number, anchorY: number } }\n   */\n  getAnchorPosition( width, height, anchor ){\n    let anchorX = 0;\n    let anchorY = 0;\n\n    if(\n      anchor == CanvasFont.FontAnchors.TopCenter    ||\n      anchor == CanvasFont.FontAnchors.Center       ||\n      anchor == CanvasFont.FontAnchors.BottomCenter \n    ) {\n      anchorX = Math.round( width / 2 )\n    } else if(\n      anchor == CanvasFont.FontAnchors.TopRight    ||\n      anchor == CanvasFont.FontAnchors.Right       ||\n      anchor == CanvasFont.FontAnchors.BottomRight \n    ) {\n      anchorX = width\n    }\n\n    if( \n      anchor == CanvasFont.FontAnchors.Left   ||\n      anchor == CanvasFont.FontAnchors.Center ||\n      anchor == CanvasFont.FontAnchors.Right\n    ) {\n      anchorY = Math.round( height / 2 )\n    } else if(\n      anchor == CanvasFont.FontAnchors.BottomLeft   ||\n      anchor == CanvasFont.FontAnchors.BottomCenter ||\n      anchor == CanvasFont.FontAnchors.BottomRight\n    ) {\n      anchorY = height\n    }\n\n    return { anchorX, anchorY }\n  }\n\n  /**\n   * Gets the position for drawing text, offseting it by anchor.\n   * \n   * @param { Number } x \n   * @param { Number } y \n   * @param { String } text \n   * @param { Symbol } anchor \n   * @returns { { drawX: Number, drawY: Number } }\n   */\n  getDrawPosition( x, y, text, anchor ) {\n    let { width, height } = this.getTextboxSize( text )\n\n    let { anchorX, anchorY } = this.getAnchorPosition( width, height, anchor )\n\n    let drawX = x - anchorX\n    let drawY = y - anchorY\n\n    return { drawX, drawY }\n  }\n\n  /**\n   * Checks if the textbox will appear on canvas.\n   * \n   * @param { Number } drawX \n   * @param { Number } drawY \n   * @param { String } text \n   * @returns { Boolean }\n   */\n  isWithinCanvas( drawX, drawY, text ){\n    let { width, height } = this.getTextboxSize( text )\n\n    if( drawX + width  < 0 || drawX > this.canvas.width  ) return false \n    if( drawY + height < 0 || drawY > this.canvas.height ) return false \n\n    return true\n  }\n\n  /**\n   * Fills text in a position and anchor.\n   * \n   * @param { Number } x \n   * @param { Number } y \n   * @param { String } text \n   * @param { Symbol } anchor \n   * @returns { Boolean } if text has been drawn.\n   */\n  fillText( x, y, text, anchor = CanvasFont.FontAnchors.TopLeft ){\n    let { drawX, drawY } = this.getDrawPosition( x, y, text, anchor )\n    \n    if( ! this.isWithinCanvas( drawX, drawY ) ) return false\n\n    this.context.fillText( text, drawX, drawY )\n\n    return true\n  }\n\n  /**\n   * Strokes text in a position and anchor.\n   * \n   * @param { Number } x \n   * @param { Number } y \n   * @param { String } text \n   * @param { Symbol } anchor \n   * @returns { Boolean } if text has been drawn.\n   */\n  strokeText( x, y, text, anchor = CanvasFont.FontAnchors.TopLeft ){\n    let { drawX, drawY } = this.getDrawPosition( x, y, text, anchor )\n    \n    if( ! this.isWithinCanvas( drawX, drawY ) ) return false\n\n    this.context.strokeText( text, drawX, drawY )\n\n    return true\n  }\n}\n\nmodule.exports = CanvasFont\n\n//# sourceURL=webpack:///./node_modules/@onbo/canvasfont/main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./maker/js/entry.js");
/******/ 	
/******/ })()
;