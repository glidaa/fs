import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import store from "./store"
import './index.scss';
import App from './components/App';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

Amplify.configure(awsconfig);
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
serviceWorkerRegistration.register();
