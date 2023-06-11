import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './main.css';

import dayjs from 'dayjs';
import DayjsRO from 'dayjs/esm/locale/ro';
import LocalizedFormat from 'dayjs/esm/plugin/localizedFormat';

dayjs.locale(DayjsRO);
dayjs.extend(LocalizedFormat);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
