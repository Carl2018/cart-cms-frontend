import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// setup fake backend
import { configureFakeBackend } from './_helpers/fake-backend';
configureFakeBackend();

ReactDOM.render(
  <React.Fragment>
    <App />
  </React.Fragment>,
  document.getElementById('root')
);
