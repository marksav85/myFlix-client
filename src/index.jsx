import React from 'react';
import { createRoot } from 'react-dom/client';
import MainView from './components/main-view/main-view';
import './index.css';
import { AppProvider } from './contexts/AppContext';
import { getApiBaseUrl } from './api/config';

// Surface a missing public API configuration as soon as the application starts.
getApiBaseUrl();

const MyFlixApplication = () => {
  return (
    <AppProvider>
      <div className="app-shell">
        <MainView />
      </div>
    </AppProvider>
  );
};

const container = document.querySelector('#root');
const root = createRoot(container);

root.render(<MyFlixApplication />);
