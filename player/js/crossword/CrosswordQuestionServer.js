const { CrosswordQuestionHTML } = require("./CrosswordQuestionHTML");

class CrosswordQuestionServer extends EventTarget {
  constructor(elements) {
    super()

    this.questionDiv = document.getElementById("crosswordQuestions")

    this.elements = elements
    this.htmlElements = []

    this.putAllElements()

    this.addEventListener("hover", this.onHTMLHover.bind(this))
    this.addEventListener("unhover", this.onHTMLUnhover.bind(this))
  }

  putAllElements() {
    for (const element of this.elements) {
      let htmlElement = new CrosswordQuestionHTML(this, element, this.questionDiv);
      htmlElement.createElement()

      this.htmlElements.push(htmlElement)
    }
  }

  highlightElement(target) {
    target.classList.add("crosswordQuestionHighlight")
  }

  unhighlightElement(target) {
    target.classList.remove("crosswordQuestionHighlight")
  }

  onHTMLHover(ev) {
    console.log(ev)
    this.highlightElement(ev.detail.question.htmlElement)
  }

  onHTMLUnhover(ev) {
    this.unhighlightElement(ev.detail.question.htmlElement)
  }
}

module.exports = { CrosswordQuestionServer }
