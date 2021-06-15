import logo from './logo.svg';
import './App.css'
import { Component } from 'react';
import { Form, Input } from 'reactstrap';
import FileSaver from 'file-saver';


const Vigenere = (function(){
  var AcharCode = 'A'.charCodeAt(0);
  var ZcharCode = 'Z'.charCodeAt(0);
  var AZlen = ZcharCode - AcharCode + 1;
  
  function encrypt( text, key, reverse, keepspaces ){    
    var plaintext = keepspaces ? text : text.replace( /\s+/g, '' );
    var messageLen = plaintext.length;
    var keyLen = key.length;
    var enctext = '';
    var encriptionDir = reverse ? ( -1 * AZlen ) : 0;
    
    for( var i = 0; i < messageLen; i++ ){
      var plainLetter = plaintext.charAt(i).toUpperCase();
      if( plainLetter.match(/\s/) ){
        enctext += plainLetter;
        continue;
      }
      
      var keyLetter = key.charAt( i % keyLen ).toUpperCase();
      var vigenereOffset = keyLetter.charCodeAt(0) - AcharCode;
      var encLetterOffset =  ( plainLetter.charCodeAt(0) - AcharCode + Math.abs( encriptionDir + vigenereOffset ) ) % AZlen;
      
      enctext +=  String.fromCharCode( AcharCode + encLetterOffset );          
    }  
    
    return enctext;
  }
  
  return {
    encrypt : function( text, key,keepspaces ){
      return encrypt( text, key, false, keepspaces );
    },
    
    decrypt : function( text, key, keepspaces ){
      return encrypt( text, key, true, keepspaces );
    }
  };  
})()

const initState = {
  key: "",
  myfile: null,
  xml:"PRUEBA"
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = ({ ...initState })
  }
  changeHandler = e => {
    this.setState({
      [e.target.id]: e.target.value,
    })
  }
  changeFile = e => {
    this.setState({
      [e.target.id]: e.target,
    })
    e.preventDefault()
    // console.log(this.state.myfile.files)
    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = (e.target.result)
      this.Txt2XML(text)
    };
    reader.readAsText(e.target.files[0])
  }

  Txt2XML =  txt => {
    var xml = '<cliente> \n'
    var i = 0;
    var categorias = ["<documento>", "</documento>", "<primer-nombre>", "</primer-nombre>", "<apellido>", "</apellido>", "<credit-card>", "</credit-card>", "<tipo>", "</tipo>", "<telefono>", "</telefono>"];

    txt.split(';').forEach((param, k) => {
      if(k==3){ 
        console.log(param)
        const creditCard = Vigenere.encrypt(param, this.state.key, true)
        console.log(creditCard)
        xml += '   ' + categorias[i] + creditCard + categorias[i + 1] + '\n'
      }
      else{
        xml += '   ' + categorias[i] + param.trim() + categorias[i + 1] + '\n'
      }
      i += 2
    })
    const final = xml + '</cliente> \n';
    this.setState({
      xml: final
    })
  }
  submitHandler = e => {
    e.preventDefault()
    var file = new File([this.state.xml], "pruebisss.xml", {type: "application/xml"});
    FileSaver.saveAs(file);
  } 

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
        </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
        </a>
          <Form>
            <Input size={50} className='transparentInput' type="text" name="key" id="key" onChange={this.changeHandler} placeholder="Ingresa" onChange={this.changeHandler} value={this.state.key} />
            <Input type="file" id="myfile" name="myfile" onChange={(e) => this.changeFile(e)} value={this.state.txt}  /> <br />
            <label type="text" name="xml" id="xml"> {this.state.xml}</label><br />
            <button onClick={this.submitHandler} >Darle play 🥴 </button> <br />
            
            
          </Form>
        </header>
      </div>

    )
  };
}

export default App;
