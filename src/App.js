import "antd/dist/antd.css";
import './App.css'
import { Component } from 'react';
import { Form } from 'reactstrap';
import FileSaver from 'file-saver';
import { CifrarDegenere, DescifrarDegenere } from './seguridad/Degenere';
import { GenerateJWT, ValidateJWT } from './seguridad/Jwt'
import { Alert, Button, Input, Tag, Upload, message, Row, Col } from 'antd';
import { KeyOutlined, UnlockOutlined, UploadOutlined, InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;


const initState = {
  key: "",
  ciphed: "",
  txt: "",
  lectura: "",
  myfile: null,
  archivo: "",
  jwt: {},
  delimitador: ";",
  flag:false,
  flagInvalido:false,
  jwtRes:"",
  error:"ERROR"
}
const props = {
  name: 'file',
  accept: '.txt, .json, .xml',
  multiple: false,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76'
};

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
  changeFile = info => {
    const { status } = info.file;

    if (status === 'done') {
      console.log(info)
      const reader = new FileReader()
      reader.onload = async (info) => {
        const text = (info.target.result)
        this.state.lectura = text
      };
      reader.readAsText(info.file.originFileObj)
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);

    }

  }


  Txt2XML = txt => {
    if(this.state.lectura===""){ this.setState({error:"ENTRADA VACIA", flag2:true}); return}

    var xml = '<cliente> \n'
    var i = 0;
    var categorias = ["<documento>", "</documento>", "<primer-nombre>", "</primer-nombre>", "<apellido>", "</apellido>", "<credit-card>", "</credit-card>", "<tipo>", "</tipo>", "<telefono>", "</telefono>"];

    txt.split(this.state.delimitador).forEach((param, k) => {
      if (k == 3) {
        //TODO VIGENERE
        if (this.state.key == "") xml += '   ' + categorias[i] + param.trim() + categorias[i + 1] + '\n'
        else {
          const creditCardChiped = CifrarDegenere(param, this.state.key)
          this.state.ciphed = creditCardChiped
          xml += '   ' + categorias[i] + creditCardChiped + categorias[i + 1] + '\n'
        }
      }
      else {
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
  Txt2JSON = async (txt) => {
    if(this.state.lectura===""){ this.setState({error:"ENTRADA VACIA", flag2:true}); return}
    var json = {};
    var categorias = ["documento", "primer-nombre", "apellido", "credit-card", "tipo", "telefono"];

    txt.split(this.state.delimitador).forEach((param, i) => {
      json[categorias[i]] = param.trim();
    })
    this.setState({ json: json, archivo: JSON.stringify(json) })

    if (this.state.key !== "") {
      GenerateJWT(json, this.state.key).then(jwt => {
        localStorage.setItem('jwtSesion', jwt);
        this.setState({ jwt })
      })
    } else { this.state.alert = true }
  }

  JSON2Txt = (json, delimitador) => {
    if(this.state.lectura===""){ this.setState({error:"ENTRADA VACIA", flag2:true}); return}
    var str = ""
    for (let key in json) {
      str += json[key] + delimitador
    }
    const txt = str.slice(0, - 1)
    var file = new File([txt], "holis.txt", { type: "text/plain" });
    console.log(file)
    FileSaver.saveAs(file);
  }
  XML2TXT = (xml, delimitador) => {
    if(this.state.lectura===""){ this.setState({error:"ENTRADA VACIA", flag2:true}); return}
    var parser, xmlDoc;

    parser = new DOMParser();
    xmlDoc = parser.parseFromString(xml, "text/xml");

    var xml2text = xmlDoc.getElementsByTagName("primer-nombre")[0].childNodes[0].nodeValue + delimitador + xmlDoc.getElementsByTagName("apellido")[0].childNodes[0].nodeValue + delimitador + xmlDoc.getElementsByTagName("credit-card")[0].childNodes[0].nodeValue + delimitador + xmlDoc.getElementsByTagName("tipo")[0].childNodes[0].nodeValue + delimitador + xmlDoc.getElementsByTagName("telefono")[0].childNodes[0].nodeValue;
    var file = new File([xml2text], "holis.txt", { type: "text/plain" });
    FileSaver.saveAs(file);

  }
  submitHandler = (e, target) => {
    e.preventDefault()
    if(this.state.lectura===""){ this.setState({error:"ENTRADA VACIA", flag2:true}); return}
    if (target === "descargarXml") {
      var file = new File([this.state.xml], "pruebisss.xml", { type: "application/xml" });
    } else if (target === "descargarJson") {
      var file = new File([JSON.stringify(this.state.json)], "pruebisss.json", { type: "application/json" });
    }
    FileSaver.saveAs(file);
  }
  descifrarHandler = e => {
    e.preventDefault()
    const decifrado = DescifrarDegenere(this.state.ciphed, this.state.key)
    console.log("DECIFRADO: " + decifrado)
    this.setState({
      displayCifrado: decifrado
    })
  }

  validarJwt = e => {
    e.preventDefault()
    if (localStorage.getItem("jwtSesion")) {
      this.setState({ jwt: localStorage.getItem("jwtSesion") })
    }
    ValidateJWT(this.state.jwt.toString(), this.state.key).then((respuesta) => {
      console.log(respuesta)
      if(respuesta.json!=null){
        this.setState({
          jwtRes:respuesta.json,
          flag:true
        })
      }else{
        this.setState({
          flag2:true
        })
      }
    })
  }



  render() {

    return (

      <div className="App">
        <header className="App-header">
          <iframe width="300" height="154" src="https://w2.countingdownto.com/4797689" frameborder="0"></iframe>
        </header>
      </div>

    )
  };
}

export default App;
