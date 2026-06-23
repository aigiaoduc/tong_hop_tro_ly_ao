import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const Apps = lazy(() => import('./pages/Apps'));
const Courses = lazy(() => import('./pages/Courses'));
const Software = lazy(() => import('./pages/Software'));
const Auth = lazy(() => import('./pages/Auth'));
const Profile = lazy(() => import('./pages/Profile'));
const Feedback = lazy(() => import('./pages/Feedback'));
const NotFound = lazy(() => import('./pages/NotFound'));

const LoadingScreen: React.FC = () => (
  <div className="flex justify-center items-center h-[60vh]">
    <LoadingSpinner message="Đang tải..." />
  </div>
);

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <HashRouter>
            <Layout>
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/apps" element={<Apps />} />
                  <Route path="/apps/:id" element={<Apps />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:id" element={<Courses />} />
                  <Route path="/software" element={<Software />} />
                  <Route path="/software/:id" element={<Software />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Layout>
          </HashRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
