/**
 * @file main.jsx
 * @description The entry point of the application.
 * It renders the root component, App, and wraps it with the Ant Design ConfigProvider.
 * @module main
 * @requires react
 * @requires react-dom/client
 * @requires ./App.jsx
 * @requires ./index.css
 * @requires antd
 * @requires ./styles/theme.js
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ConfigProvider } from 'antd';
import { customTheme } from './styles/theme.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={customTheme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);