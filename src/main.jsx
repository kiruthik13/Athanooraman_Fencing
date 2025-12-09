import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { useToast } from './components/common/Toast';

const Root = () => {
  const { ToastContainer } = useToast();

  return (
    <>
      <App />
      <ToastContainer />
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
