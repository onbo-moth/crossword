/**
 * Manages the title for the currently edited crossword.
 */
class CrosswordTitle {
  constructor(){
    this.titleElement = $("#crosswordTitle")
    this.inputElement = $("#crosswordTitleInput")

    this.title = this.titleElement.text()

    this.bootstrapDisplayNone = "d-none"

    this.bindListeners()
  }

  /**
   * Retrieves the current title.
   * @returns {string}
   */
  getTitle(){
    return this.title
  }

  /**
   * Sets a title for crossword. Use when importing.
   * @param {string} newTitle 
   */
  setTitle( newTitle ){
    this.title = newTitle
    this.titleElement.text( newTitle )
  }

  /**
   * Binds listeners to the title and input elements.
   */
  bindListeners(){
    this.titleElement.on("click", this.onTitleClick.bind(this))

    this.inputElement.on("focusout", this.onInputBlur.bind(this))
    this.inputElement.on("keypress", this.onInputKey.bind(this))
  }

  /**
   * Changes title into a input and automatically focuses.
   */
  onTitleClick(){
    this.titleElement.addClass( this.bootstrapDisplayNone )

    this.inputElement.val( this.titleElement.text() )

    this.inputElement.removeClass( this.bootstrapDisplayNone )
    this.inputElement.focus()
  }

  /**
   * Sets title as input gets unfocused.
   */
  onInputBlur(){
    this.inputElement.addClass( this.bootstrapDisplayNone )

    let value = this.inputElement.val()
    if( value.trim() === "" ) value = "Tytuł"
    
    this.titleElement.text( value )
    this.title = value

    this.titleElement.removeClass( this.bootstrapDisplayNone )
  }

  /**
   * Unfocuses input if enter is pressed.
   * @param {object} JQEvent A event object returned by JQuery's on() callback.
   */
  onInputKey( JQEvent ){
    let key = JQEvent.originalEvent.code

    if( key === "Enter" ) this.inputElement.blur()
  }
}

module.exports = CrosswordTitle