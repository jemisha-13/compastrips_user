import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import './helper/i18n/index'
import './Responsive.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/react-datepicker/dist/react-datepicker.css';
import '../node_modules/react-chat-widget/lib/styles.css';


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
