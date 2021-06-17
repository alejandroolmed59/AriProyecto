import "antd/dist/antd.css";
import './App.css'
import { Component } from 'react';
import { Form } from 'reactstrap';
import FileSaver from 'file-saver';
import {CifrarDegenere ,DescifrarDegenere } from './seguridad/Degenere';
import {GenerateJWT, ValidateJWT} from './seguridad/Jwt'
import { Alert, Button, Input, Tag } from 'antd';
import { KeyOutlined, UnlockOutlined } from '@ant-design/icons';


const initState = {
  key: "",
  ciphed: "",
  txt: "",
  lectura: "",
  myfile: null,
  archivo:"",
  jwt:{},
  aler:false
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
    console.log("Hace xml")

    var xml = '<cliente> \n'
    var i = 0;
    var categorias = ["<documento>", "</documento>", "<primer-nombre>", "</primer-nombre>", "<apellido>", "</apellido>", "<credit-card>", "</credit-card>", "<tipo>", "</tipo>", "<telefono>", "</telefono>"];

    txt.split(';').forEach((param, k) => {
      if(k==3){ 
        //TODO VIGENERE
        if(this.state.key=="") xml += '   ' + categorias[i] + param.trim() + categorias[i + 1] + '\n'
        else{
          const creditCardChiped = CifrarDegenere(param, this.state.key)
          this.state.ciphed = creditCardChiped
          xml += '   ' + categorias[i] + creditCardChiped + categorias[i + 1] + '\n'
        }
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
    console.log("Hace json")
    var json = {};
    var categorias = ["documento", "primer-nombre", "apellido", "credit-card", "tipo", "telefono"];

    txt.split(';').forEach((param, i) => {
        json[categorias[i]] = param.trim();
    })
    this.setState({json: json, archivo: JSON.stringify(json)})

    if(this.state.key!==""){
      GenerateJWT(json, this.state.key).then(jwt=>{
          localStorage.setItem('jwtSesion', jwt);
          this.setState({jwt})
      })
    }else{this.state.alert=true}
     
    
}
  submitHandler = (e, target) => {
    e.preventDefault()
    if(target==="descargarXml"){
      var file = new File([this.state.xml], "pruebisss.xml", {type: "application/xml"});
    }else if(target==="descargarJson"){
      var file = new File([JSON.stringify(this.state.json)], "pruebisss.json", {type: "application/json"});
    }
    FileSaver.saveAs(file);
  } 
  descifrarHandler = e =>{
    e.preventDefault()
    const decifrado = DescifrarDegenere(this.state.ciphed, this.state.key)
    console.log("DECIFRADO: "+ decifrado)
    this.setState({
      displayCifrado: decifrado
    })
  }

  validarJwt = e=>{
    e.preventDefault()
    if(localStorage.getItem("jwtSesion")!==null){
        this.setState({jwt: localStorage.getItem("jwtSesion")})
    }
    ValidateJWT(this.state.jwt, this.state.key).then((respuesta)=>{
     console.log(respuesta)
    })
  }

  render() {

    return (
      
      <div className="App">
        {this.state.alert==""&& <Alert
                    message="Error"
                    description="Para generar el JWT es necesario tener un secreto"
                    type="error"
                    showIcon
                />}
        <header className="App-header">
          <Form>
            <Input prefix={<KeyOutlined/>}  name="key" id="key" placeholder="Llave ultra secreta 🤐" onChange={this.changeHandler} value={this.state.key} />
            <Input type="file" id="myfile" name="myfile" onChange={(e) => this.changeFile(e)}  /> <br />
            <div>
              <Button type="primary" name="generateXml" id="generateXml" onClick={()=>this.Txt2XML(this.state.lectura)} >General xml 🥴 </Button>
              <Button type="primary" name="generateJson" id="generateJson" onClick={()=> this.Txt2JSON(this.state.lectura)}>Generar json 🥴 </Button>
            </div>
            <div>
              <Button type="primary" id="descargarXml" onClick={(e)=>this.submitHandler(e,"descargarXml")} >Descargar xml hey 🥴 </Button>
              <Button type="primary" id="descargarJson" onClick={(e)=>this.submitHandler(e,"descargarJson")} >Descargar json hey 🥴 </Button> <br />
            </div>
            <Button type="primary" onClick={this.descifrarHandler} >Descifre hey 🥴 </Button>
            <Button type="primary" onClick={this.validarJwt} >Validar JWT 🥴 </Button>
          </Form>
          <label type="text" name="archivo" id="archivo">{this.state.archivo}</label><br />
          <Tag  color="volcano" icon={<UnlockOutlined />} type="text" name="ciphed" id="ciphed">{this.state.displayCifrado}</Tag><br />
          

          <div>
            <Button type="primary" id="jwtLocal" onClick={e => this.validarJwt(e)} >Generar json del jwt almacenado en navegador🥴 </Button>
          </div>
        </header>
      </div>

    )
  };
}

export default App;
