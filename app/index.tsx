import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

const Root = () => (
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

export default Root;
