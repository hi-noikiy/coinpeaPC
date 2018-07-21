import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';


import 'animate.css';
import * as moment from 'moment';
import 'moment/locale/zh-cn';

import 'animate.css';
import './index.scss';

moment.locale('zh-cn');

// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement );

// registerServiceWorker();
