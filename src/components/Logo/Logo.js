import React from 'react';
import 'tachyons';
import Tilt from 'react-tilt';
import './Logo.css';
import Brain from './brain.png'

const  Logo = () =>{
	return (
		<div className = "ma4 mt0">
		<Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 150, width: 150 }} >
 			<div className="Tilt-inner pa3"><img src={Brain} alt="Logo" style={{ paddingTop:'5px',height: 100 ,width: 100 }} /></div>
		</Tilt>
		</div>
	);
}

export default Logo;