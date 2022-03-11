import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {AppProvider} from './context'
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <SnackbarProvider maxSnack={3}>
      <App />
      </SnackbarProvider>
    </AppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
