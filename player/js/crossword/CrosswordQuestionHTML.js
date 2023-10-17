class CrosswordQuestionHTML {
  constructor(server, element, parent) {
    this.server = server;
    this.element = element;
    this.parent = parent;
    this.htmlElement = null;
  }

  createElement() {
    let htmlElement = document.createElement("p");

    htmlElement.innerHTML = `${this.parent.childElementCount - 1}. ${this.element.question}`;

    htmlElement.addEventListener("mouseenter", this.onHover.bind(this));
    htmlElement.addEventListener("mouseleave", this.onUnhover.bind(this));

    this.parent.appendChild(htmlElement);

    this.htmlElement = htmlElement;
  }

  onHover(ev) {
    let customEvent = new CustomEvent("hover", {
      detail: {
        originalEvent: ev,
        question: this
      }
    });

    this.server.dispatchEvent(customEvent);
  }

  onUnhover(ev) {
    let customEvent = new CustomEvent("unhover", {
      detail: {
        originalEvent: ev,
        question: this
      }
    });

    this.server.dispatchEvent(customEvent);
  }
}

module.exports = { CrosswordQuestionHTML }