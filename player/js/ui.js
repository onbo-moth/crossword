const loadingDiv = document.getElementById("loadingScreen")

function setStatus( string ){
  loadingDiv.querySelector("p").innerText = string
}

function finishLoading(){
  setStatus("Finished loading.")

  setTimeout(() => loadingDiv.classList.add("fade-out"), 1000)
  setTimeout(() => loadingDiv.style.display = "none", 2000)
}

module.exports = {
  setStatus,
  finishLoading
}