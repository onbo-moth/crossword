const listElementTemplate = require("../ui/questionTemplate.js")

const lang = {
  removeQuestionPrompt: "Are you sure you want to remove this question?"
}

class QuestionManager {
  constructor(modalManager){
    this.modalManager = modalManager

    this.list = $("#questionList")

    this.questions = []

    this.events = new EventTarget()

    $("#addQuestionButton").on("click", this.addQuestionModal.bind(this))
    this.events.addEventListener("remove", this.onRemove.bind(this))
  }

  addQuestionModal(){
    let promise = this.modalManager.openModal()

    promise.then(this.addQuestion.bind(this))
  }
  
  addQuestion( data ){
    if( data.event !== "confirm" ) return
    
    let listElement = listElementTemplate(
      data.data.question,
      data.data.answer,
      data.data.direction
    )

    this.list.append(listElement)

    this.questions.push( new QuestionElement(
      this,
      listElement,
      data.data
    ) )
  }

  onRemove( event ){
    let object = event.detail

    let questionIndex = this.questions.indexOf( object )
    this.questions.splice( questionIndex, 1 )

    object.element.remove()
  }
}

class QuestionElement extends EventTarget {
  constructor(manager, element, data){
    super()

    this.manager = manager
    this.modalManager = manager.modalManager

    this.id = Symbol()
    this.element = element

    this.question  = data.question
    this.answer    = data.answer
    this.direction = data.direction

    console.log(this.element)

    this.buttons = this.element.getElementsByTagName("button")
    this.texts = this.element.getElementsByTagName("span")

    this.buttons.placeButton.addEventListener(
      "click",
      function(){
        this.manager.events.dispatchEvent(
          new CustomEvent("place", { detail: this } )
        )
      }.bind(this)
    )

    this.buttons.editButton.addEventListener(
      "click",
      this.editQuestionModal.bind(this)
    )

    this.buttons.removeButton.addEventListener(
      "click",
      this.removeQuestion.bind(this)
    )
  }

  editQuestionModal() {
    let promise = this.modalManager.openModal()

    promise.then(this.editQuestion.bind(this))
  }

  editQuestion( data ){
    if( data.event !== "confirm" ) return

    this.question  = data.data.question
    this.answer    = data.data.answer
    this.direction = data.data.direction

    this.updateInfo()

    this.manager.events.dispatchEvent(
      new CustomEvent("edit", { detail: this } )
    )
  }

  removeQuestion(){
    if( confirm( lang.removeQuestionPrompt ) === false ) return
    
    this.manager.events.dispatchEvent(
      new CustomEvent("remove", { detail: this } )
    )
  }

  forceRemove(){
    this.manager.events.dispatchEvent(
      new CustomEvent("remove", { detail: this } )
    )
  }

  updateInfo(){
    this.texts.question.innerText  = this.question
    this.texts.answer.innerText    = this.answer
    this.texts.direction.innerText = "Direction: " + this.direction
  }
}

module.exports = QuestionManager