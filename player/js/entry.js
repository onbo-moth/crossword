const { Crossword } = require("./crossword/crossword")
const getCrosswords = require("./loader/getter")
const { finishLoading } = require("./ui")

getCrosswords().then( function( crosswords ){
  let random = Math.floor( Math.random() * crosswords.length )

  let crossword = new Crossword( crosswords[ random ] )


  finishLoading()
})

if(!localStorage.getItem("alertShown")) {
  let string = "Dzień dobry!\n"
             + "Troche się spieszyłem aby to skończyć i dobrze się wyspać.\n"
             + "Jest szansa na małe problemy, ale i tak, dużo zrobiliśmy!"

  alert( string );

  localStorage.setItem("alertShown", "true");
}
