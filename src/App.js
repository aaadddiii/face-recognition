import React,{ Component } from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import Signin from './components/signin/signin';
import Register from './components/Register/Register';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';

const app = new Clarifai.App({
 apiKey: 'a59d550c78e34c21ba3a9f6961bee71d'
});

const particlesOptions = {
                particles: {
                  number: {
                    value: 70,
                    density:{
                      enable: true,
                      value_area: 500
                    }
                  }
                }
}
const initialState = {
  input: '',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user:{
        id: '',
        name: '',
        email: '',
        entries:0,
        joined: ''
  }
}
class App extends Component{
  constructor(){
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user:{
        id: '',
        name: '',
        email: '',
        entries:0,
        joined: ''
      }
    }
  }

loadUser = (data) =>{
  this.setState({user:{
        id: data.id,
        name: data.name,
        email: data.email,
        entries:data.entries,
        joined: data.joined
  }})
}

  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol: clarifaiFace.left_col*width,
      topRow: clarifaiFace.top_row*height,
      rightCol: width - (clarifaiFace.right_col*width),
      bottomRow: height - (clarifaiFace.bottom_row*height)
    }
  }
  displayFaceBox = (box) =>{
    this.setState({box: box});
  }
  OnInputChange = (event) => {
    this.setState({input: event.target.value})
  } 
  onButtonSubmit = () =>{
    this.setState({imageURL: this.state.input})
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response =>{
      if(response){  
        fetch('https://hidden-journey-09300.herokuapp.com/image',{
        method:'put',
        headers:{'content-type':'application/json'},
        body: JSON.stringify({
        id: this.state.user.id,
      })
        })
        .then(response =>
          response.json())
        .then(count =>{
          this.setState(Object.assign(this.state.user,{entries: count}))
        })
        .catch(console.log)
      }
     this.displayFaceBox(this.calculateFaceLocation(response))})
    .catch(err => console.log(err));
  }
onRouteChange = (route) => {
  if(route === 'signout'){
    this.setState(initialState)
  }
  else if(route === 'home'){
    this.setState({isSignedIn: true})
  }
  this.setState({route:  route});
}

  render(){
   const {isSignedIn,imageURL,route,box} = this.state;
  return (

      <div className="App">
      <Particles className='particles'
              params={particlesOptions}
            />
        <Navigation isSignedIn={isSignedIn} onRouteChange = {this.onRouteChange}/>
        {this.state.route === 'home' 
        ?<div>
         <Logo />
         <Rank entries={this.state.user.entries} name={this.state.user.name} />
        <ImageLinkForm OnInputChange={this.OnInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition imageURL={imageURL} box={box}/>
        </div>
        :(route === 'signin'
          ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>)
         
      }
      </div>
    );
  }
}

export default App;
