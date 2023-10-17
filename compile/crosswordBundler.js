const path = require("path")
const fs   = require("fs")

const CROSSWORDS_DIR = path.resolve(__dirname, "../crosswords/")

class CrosswordBundler {
  constructor(){
    this.files = this.getFiles()

    let content = []

    for( const file of this.files ){
      let data = JSON.parse( this.readFile( file ) )

      content.push( data )
    }

    fs.writeFileSync( path.resolve(__dirname, "../player/crosswords.json"), JSON.stringify( content ) ) 
  }

  getFiles() {
    return fs.readdirSync( CROSSWORDS_DIR );
  }

  readFile( filePath ){
    let content = fs.readFileSync( path.resolve(CROSSWORDS_DIR, filePath) ).toString( "utf-8" )

    return content
  }
}


new CrosswordBundler()