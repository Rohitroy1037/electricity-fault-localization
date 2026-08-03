// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProviders } from './providers/AppProviders';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
);
