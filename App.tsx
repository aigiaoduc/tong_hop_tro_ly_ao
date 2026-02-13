import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Apps from './pages/Apps';
import Courses from './pages/Courses';
import Software from './pages/Software';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Feedback from './pages/Feedback';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Apps routes */}
            <Route path="/apps" element={<Apps />} />
            <Route path="/apps/:id" element={<Apps />} />
            
            {/* Courses routes */}
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<Courses />} />
            
            {/* Software routes */}
            <Route path="/software" element={<Software />} />
            <Route path="/software/:id" element={<Software />} />
            
            <Route path="/login" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;