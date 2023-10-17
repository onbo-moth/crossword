function getCrosswords() {
  return new Promise( ( resolve, reject ) => {
  fetch( "./crosswords.json" )
    .then((response) => {
      if( response.ok ){
        resolve( response.json() )
      } else {
        reject( response.status );
      }
    })
  })
}

module.exports = getCrosswords