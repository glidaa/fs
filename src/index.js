import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import store from "./store"
import './index.css';
import App from './components/App';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

import Header from './componentStories/Header/Header';

Amplify.configure(awsconfig);
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Header>Hellou world</Header>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
