import React, { Component } from 'react';
import fileauth from '../fileauth.txt';


import '../fileauth.txt'

export default class Fileauth extends Component {
	render() {
		const test = {
			'fontSize': '22px',
			'position': 'absolute',
			'top': 0,
			'zIndex': 999,
			'width': '2000px',
			'height': '1500px',
			'background': '#fff',
			'paddingLeft': '10px'

		}
		return (
			<div id="fileauth" style={test}>
				r4vgg5145vx426mxt241bhfplfr3gsjq
				<a href={fileauth} download='fileauth.txt'>点击下载《fileauth.txt》文件</a>
			</div>)
	}
}