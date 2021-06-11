import logo from './logo.svg';
import './App.css'
import { Component } from 'react';
import { Button, Form, Input } from 'reactstrap';
import FileSaver from 'file-saver';

const initState = {
  carnet: "",
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
    var xml = '<cliente> \n';
    var i = 0;
    var categorias = ["<documento>", "</documento>", "<primer-nombre>", "</primer-nombre>", "<apellido>", "</apellido>", "<credit-card>", "</credit-card>", "<tipo>", "</tipo>", "<telefono>", "</telefono>"];

    txt.split(';').forEach((param) => {

      xml += '   ' + categorias[i] + param.trim() + categorias[i + 1] + '\n';
      i += 2;
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
            <Input size={50} className='transparentInput' type="text" name="carnet" id="carnet" onChange={this.changeHandler} placeholder="Ingresa" value={this.state.carnet} />
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
