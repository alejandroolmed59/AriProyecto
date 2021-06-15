import logo from './logo.svg';
import './App.css'
import { Component } from 'react';
import { Form, Input } from 'reactstrap';
import FileSaver from 'file-saver';
import {CifrarDegenere ,DescifrarDegenere } from './seguridad/Degenere';
import {GenerateJWT, ValidateJWT} from './seguridad/Jwt'

const initState = {
  key: "",
  ciphed: "",
  txt: "",
  lectura: "123",
  myfile: null,
  archivo:""
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
    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = (e.target.result)
      this.state.lectura = text
    };
    reader.readAsText(e.target.files[0])
  }

  Txt2XML =  txt => {
    var xml = '<cliente> \n'
    var i = 0;
    var categorias = ["<documento>", "</documento>", "<primer-nombre>", "</primer-nombre>", "<apellido>", "</apellido>", "<credit-card>", "</credit-card>", "<tipo>", "</tipo>", "<telefono>", "</telefono>"];

    txt.split(';').forEach((param, k) => {
      if(k==3){ 
        //TODO VIGENERE
        const creditCardChiped = CifrarDegenere(param, this.state.key)
        this.state.ciphed = creditCardChiped

        xml += '   ' + categorias[i] + creditCardChiped + categorias[i + 1] + '\n'
      }
      else{
        xml += '   ' + categorias[i] + param.trim() + categorias[i + 1] + '\n'
      }
      i += 2
    })
    const final = xml + '</cliente> \n';
    this.setState({
      xml: final,
      archivo: final
    })
  }
  Txt2JSON = async(txt) => {
    var json = {};
    var categorias = ["documento", "primer-nombre", "apellido", "credit-card", "tipo", "telefono"];

    txt.split(';').forEach((param, i) => {
        json[categorias[i]] = param.trim();
    })
    this.setState({json: json, archivo: JSON.stringify(json)})
    GenerateJWT(json, this.state.key).then(jwt=>{
       this.setState({jwt})
     })
    
}
  submitHandler = e => {
    e.preventDefault()
    if(e.target.id==="descargarXml"){
      var file = new File([this.state.xml], "pruebisss.xml", {type: "application/xml"});
    }else if(e.target.id==="descargarJson"){
      var file = new File([JSON.stringify(this.state.json)], "pruebisss.json", {type: "application/json"});
    }
    FileSaver.saveAs(file);
  } 
  descifrarHandler = e =>{
    e.preventDefault()
    const decifrado = DescifrarDegenere(this.state.ciphed, this.state.key)
    console.log("DECIFRADO: "+ decifrado)
    this.setState({
      ciphed: decifrado
    })
  }
  changeLabel = e  =>{
    const archivo = e.target.id
    if(archivo==="generateJson") this.Txt2JSON(this.state.lectura)
    else if(archivo==="generateXml") this.Txt2XML(this.state.lectura)
  }
  validarJwt = e=>{
    e.preventDefault()
    ValidateJWT(this.state.jwt, this.state.key).then((respuesta)=>{
     console.log(respuesta)
    })
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
            <Input type="file" id="myfile" name="myfile" onChange={(e) => this.changeFile(e)}  /> <br />
            <div>
              <button id="descargarXml" onClick={e=>this.submitHandler(e)} >Descargar xml hey 🥴 </button>
              <button id="descargarJson" onClick={e=>this.submitHandler(e)} >Descargar json hey 🥴 </button> <br />
            </div>
            <button onClick={this.descifrarHandler} >Descifre hey 🥴 </button>
            <button onClick={this.validarJwt} >Validar JWT 🥴 </button>
            <label type="text" name="ciphed" id="ciphed">{this.state.ciphed}</label>
            
          </Form>
          <label type="text" name="archivo" id="archivo">{this.state.archivo}</label><br />
          <div>
            <button id="generateJson" onClick={e => this.changeLabel(e)} >Generar json 🥴 </button>
            <button id="generateXml" onClick={e=> this.changeLabel(e)} >General xml 🥴 </button>
          </div>
        </header>
      </div>

    )
  };
}

export default App;
