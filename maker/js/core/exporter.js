const CrosswordTitle = require("../ui/title")
const CrosswordManager = require("./crossword")
const QuestionManager = require("./questions")

class Exporter extends EventTarget {
  /**
   * 
   * @param { CrosswordTitle } titleManager 
   * @param { QuestionManager } questionManager 
   * @param { CrosswordManager } crosswordManager 
   */
  constructor( titleManager, questionManager, crosswordManager ){
    super()

    this.title     = titleManager
    this.questions = questionManager
    this.crossword = crosswordManager

    this.fileInput = document.createElement("input")
    this.fileInput.type = "file"

    this.fileInput.addEventListener("change", this.onImport.bind( this ))

    this.downloadLink = document.createElement("a")
    this.downloadLink.download = "save.cwd"

    document.getElementById("importButton").addEventListener("click", this.openImport.bind( this ))
    document.getElementById("exportButton").addEventListener("click", this.openExport.bind( this ))
  }

  openImport() {
    this.fileInput.click()
  }

  openExport() {
    let save = {}

    console.log( this.questions )
    console.log( this.questions.questions )

    console.log( this.title )

    console.log( this.crossword )
    console.log( this.crossword.placedQuestions )

    save.title = this.title.getTitle()

    save.questions = []

    for( const question of this.questions.questions ){
      let data = []

      data.push( question.question )
      data.push( question.answer )
      data.push( question.direction )

      save.questions.push( data )
    }

    save.crossword = []

    for( const [ question, position ] of this.crossword.placedQuestions.entries() ){
      let index = this.questions.questions.indexOf( question )

      save.crossword.push( [ index, position ] )
    }

    this.export( JSON.stringify( save ) )
  }

  /**
   * 
   * @param { Event } event 
   */
  onImport( event ){
    const file = event.target.files[0]
    if( ! file ) return false

    this.import( file )
  }

  import( file ) {
    console.log( file )

    const reader = new FileReader()

    reader.addEventListener("load", function( event ){

      let object = JSON.parse( event.target.result )

      this.title.setTitle( object.title )


      for( const question of this.questions.questions ){
        question.forceRemove()
      }

      this.questions.questions = []

      for ( const question of object.questions ){
        this.questions.addQuestion({ 
          event: "confirm",
          data: {
            question: question[0],
            answer: question[1],
            direction: question[2]
          }
        })
      }

      this.crossword.clearPreview()

      for( const [ index, position ] of object.crossword ){
        this.crossword.placedQuestions.set( this.questions.questions[ index ], position )
      }

      console.log( this.crossword )
      console.log( this.questions)

      this.crossword.placedLetters = this.crossword.getPlacedLetters()

    }.bind( this ))

    reader.readAsText( file )
  }

  export( string ){
    let blob = new Blob( [string], { type: "text/plain" } )

    this.downloadLink.href = URL.createObjectURL( blob )

    this.downloadLink.click()
  }
}

module.exports = Exporter