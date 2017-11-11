import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// get rid of service worker during testing
import { unregister, registerServiceWorker} from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
//registerServiceWorker();
unregister();
