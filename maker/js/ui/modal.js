class ModalManager {
  constructor(){
    this.modal = $("#addQuestionModal")
    this.form = $("#addQuestionModal form")[0]
    this.confirm = $("#modalConfirm")

    this.waitingPromises = []

    this.modal.on("hide.bs.modal", this.onClose.bind(this))
    this.confirm.on("click", this.onConfirm.bind(this))
  }

  getInfo(){
    let data = new FormData( this.form ).entries()

    // this is dumb af but works
    let question  = data.next().value[1]
    let answer    = data.next().value[1]
    let direction = data.next().value[1]

    console.log( { question, answer, direction } )

    return { question, answer, direction }
  }

  openModal() {
    this.modal.modal("show")

    let promiseResolve;

    let promise = new Promise(function( resolve, reject ){
      promiseResolve = resolve
    })

    this.waitingPromises.push(promiseResolve)

    return promise
  }

  onClose() {
    this.resolvePromises( "close" )
  }

  onConfirm() {
    this.resolvePromises( "confirm" )

    this.modal.modal("hide")
  }

  resolvePromises( event ){
    let modalEvent = new ModalEvent( event, this.getInfo() )

    for( let promise of this.waitingPromises ){
      promise( modalEvent )
    }

    this.waitingPromises = []
  }
}

class ModalEvent {
  constructor( event, data ){
    /** @type { "close" | "confirm" } */
    this.event = event
    this.data  = data
  }
}

module.exports = ModalManager