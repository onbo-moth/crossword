const lang = {
  placeButton: "Umieść",
  editButton: "Edytuj",
  removeButton: "Usuń"
}

function listElementTemplate( question, answer, direction ){
  let listElement = document.createElement("li")

  listElement.classList.add("list-group-item")
  listElement.classList.add("d-flex")
  listElement.classList.add("justify-content-between")
  listElement.classList.add("align-items-center")


  let contentElement = document.createElement("div")


  let questionSpan = document.createElement("span")

  questionSpan.classList.add("d-block")

  questionSpan.setAttribute("name", "question")

  questionSpan.innerText = question


  let boldAnswerWrapper = document.createElement("b")


  let answerSpan = document.createElement("span")

  answerSpan.classList.add("font-weight-bold")

  answerSpan.setAttribute("name", "answer")  

  answerSpan.innerText = answer


  boldAnswerWrapper.appendChild(answerSpan)


  contentElement.appendChild(questionSpan)
  contentElement.appendChild(boldAnswerWrapper)


  let buttonsElement = document.createElement("div")


  let placeButton = document.createElement("button")

  placeButton.classList.add("btn")
  placeButton.classList.add("btn-sm")
  placeButton.classList.add("btn-info")
  placeButton.classList.add("mx-1")

  placeButton.setAttribute("name", "placeButton")

  placeButton.innerText = lang.placeButton


  let editButton = document.createElement("button")

  editButton.classList.add("btn")
  editButton.classList.add("btn-sm")
  editButton.classList.add("btn-warning")
  editButton.classList.add("mx-1")

  editButton.setAttribute("name", "editButton")

  editButton.innerText = lang.editButton


  let removeButton = document.createElement("button")

  removeButton.classList.add("btn")
  removeButton.classList.add("btn-sm")
  removeButton.classList.add("btn-danger")
  removeButton.classList.add("mx-1")

  removeButton.setAttribute("name", "removeButton")

  removeButton.innerText = lang.removeButton


  let directionSpan = document.createElement("span")

  directionSpan.setAttribute("name", "direction")

  directionSpan.innerText = "Direction: " + direction

  directionSpan.classList.add("d-block")

  buttonsElement.appendChild(placeButton)
  buttonsElement.appendChild(editButton)
  buttonsElement.appendChild(removeButton)

  buttonsElement.appendChild(directionSpan)


  listElement.appendChild(contentElement)
  listElement.appendChild(buttonsElement)


  return listElement
}

module.exports = listElementTemplate