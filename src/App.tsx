import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter  } from 'react-router-dom';

import store from './redux/configureStore';

import './assets/iconfont/iconfont.css'

import Frames from './layouts/Frames';


class App extends React.Component {
	
	
	public render() {

		return(
				<Provider store = {store}>
					<BrowserRouter basename="/">
						<Frames  />
					</BrowserRouter>
				</Provider>
		)
	}

}

export default App;
