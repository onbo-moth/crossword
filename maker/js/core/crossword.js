const Graphics = require("../graphics/canvas")
const QuestionManager = require("./questions")

class CrosswordManager {
  /**
   * 
   * @param { QuestionManager } questionManager 
   * @param { Graphics } graphics 
   */
  constructor( questionManager, graphics ){
    this.questionManager = questionManager
    this.graphics = graphics
    this.canvas = graphics.canvas
    this.mouse = graphics.mouse

    this.graphics.crossword = this

    this.placedQuestions = new Map()
    this.placedLetters   = []

    this.previewQuestion = null

    this.questionManager.events.addEventListener("place" , this.onPlaceButton.bind(this))
    this.questionManager.events.addEventListener("edit"  , this.onEdit.bind(this))
    this.questionManager.events.addEventListener("remove", this.onRemove.bind(this))

    this.canvas.addEventListener("click", this.placeAnswer.bind(this))
  }

  onPlaceButton( event ){
    console.log(event)

    this.setPreview( event.detail )
  }

  onEdit( event ){
    let question = event.detail

    this.placedQuestions.delete( question )
    this.placedLetters = this.getPlacedLetters()
  }

  onRemove( event ){
    let question = event.detail

    this.placedQuestions.delete( question )
    this.placedLetters = this.getPlacedLetters()
  }  

  setPreview( question ){
    this.previewQuestion = question

    this.placedQuestions.delete( question )
    this.placedLetters = this.getPlacedLetters()
  }

  clearPreview(){
    this.previewQuestion = null
  }

  /**
   * 
   * @param { QuestionElement } question 
   * @param { { x: Number, y: Number } } position 
   */
  getAnswerLetters( question, position ) {
    const answer    = question.answer.toUpperCase()
    const direction = question.direction

    const filter = { x: 0, y: 0 }

    if(      direction == "horizontal" ) filter.x = 1
    else if( direction == "vertical" )   filter.y = 1

    let letters = []

    for( let index = 0; index < answer.length; index++ ){
      let x = position.x + index * filter.x
      let y = position.y + index * filter.y
      letters.push( [ x, y, answer[ index ] ] )
    }

    return letters
  }

  getPreviewLetters() {
    const empty = []

    if( ! this.previewQuestion ) return empty

    let position = this.mouse.gridPosition

    if( ! position ) return empty

    return this.getAnswerLetters( this.previewQuestion, position )
  }

  placeAnswer() {
    if( ! this.previewQuestion ) return false
    if( ! this.mouse.gridPosition ) return false // how

    if( this.hasInvalidBlock( this.placedLetters.concat( this.getPreviewLetters() ) ) ) return false

    let positionClone = { ... this.mouse.gridPosition }

    this.placedQuestions.set( this.previewQuestion, positionClone )

    this.clearPreview()

    this.placedLetters = this.getPlacedLetters()

    return true
  }

  getPlacedLetters() {
    let letterGroups = []

    for( const [ question, position ] of this.placedQuestions.entries() ){
      letterGroups.push( this.getAnswerLetters( question, position ) )
    }

    let letters = letterGroups.flat()

    return letters
  }

  areLettersValid( firstLetter, secondLetter ){
    // Check positions if match
    if( firstLetter[0] != secondLetter[0] ) return true
    if( firstLetter[1] != secondLetter[1] ) return true

    // compare letters
    if( firstLetter[2] == secondLetter[2] ) return true 

    return false
  }

  getInvalidBlocks( letterArray ){
    let invalidBlocks = []

    for( let firstIndex = 0; firstIndex < letterArray.length; firstIndex++ ){
      for( let secondIndex = firstIndex + 1; secondIndex < letterArray.length; secondIndex++){
        let firstLetter  = letterArray[ firstIndex ]
        let secondLetter = letterArray[ secondIndex ]

        if( this.areLettersValid( firstLetter, secondLetter) ) continue

        invalidBlocks.push( { x: firstLetter[0], y: firstLetter[1] } )
      }
    }

    return invalidBlocks
  }

  hasInvalidBlock( letterArray ){
    for( let firstIndex = 0; firstIndex < letterArray.length; firstIndex++ ){
      for( let secondIndex = firstIndex + 1; secondIndex < letterArray.length; secondIndex++){
        let firstLetter  = letterArray[ firstIndex ]
        let secondLetter = letterArray[ secondIndex ]

        if( this.areLettersValid( firstLetter, secondLetter) ) continue

        return { x: firstLetter[0], y: firstLetter[1] }
      }
    }

    return null
  }
}

module.exports = CrosswordManager