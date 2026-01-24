import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';

import ScrollToTop from './components/common/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ScrollToTop />
      <Toaster position="top-right" reverseOrder={false} />
      <AppRoutes />
    </Router>
  );
}

export default App;
