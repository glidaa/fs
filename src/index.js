import "smap/smap-shim"
import "core-js";
import 'regenerator-runtime/runtime';
import './utils/nanoidIE'
import React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import store from "./store"
import './index.scss';
import 'simplebar/dist/simplebar.min.css';
import App from './components/App';
import { API } from "@aws-amplify/api";
import { Auth } from "@aws-amplify/auth";
import awsconfig from './aws-exports';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

API.configure(awsconfig);
Auth.configure(awsconfig);
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
