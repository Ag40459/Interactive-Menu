import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'; 

import { AuthProvider } from './contexts/AuthContext';
import { LeadProvider } from './contexts/LeadContext'
import Seller from './components/Seller/Seller';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Features from './components/Features/Features';
import HowItWorks from './components/HowItWorks/HowItWorks';
import SolarEnergySimulator from './components/SolarEnergySimulator/SolarEnergySimulator';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import AdminDashboardPage from './components/Admin/AdminDashboardPage'; 
import ProtectedRoute from './components/Admin/ProtectedRoute'; 
import AuthModal from './components/AuthModal/AuthModal';
import ScrollToTopButton from './components/UI/ScrollToTopButton'; 
import ScrollToTop from './components/UI/ScrollToTop';
import FAQ from './components/Faq/FAQ';
import AnimatedBackground from './components/UI/AnimatedBackground/AnimatedBackground';
import Button3DRotate from './components/UI/ComponentsAnimation/Button3DRotate';



const MainLayout = ({ isAuthModalOpen, setIsAuthModalOpen }) => {
  // Adicionar useEffect para garantir que a página inicie no topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <AnimatedBackground />
      <Navbar openAuthModal={() => setIsAuthModalOpen(true)} />
      <main>
        <Hero />
        <About />
        <Features />
        <HowItWorks />
        <SolarEnergySimulator />
        <Contact />
      </main>
      <Footer />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
        <Button3DRotate text="Quero Fazer Parte" link="#contact"  />

      <ScrollToTopButton />
    </>
  );
};

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const body = document.body;
    const themeClasses = ['theme-light', 'theme-dark', 'theme-nature', 'theme-fire', 'theme-ocean'];
    body.classList.remove(...themeClasses);
    body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
          </Route>

          <Route path="/faq" element={<FAQ />} />
          <Route path="/simulador" element={<SolarEnergySimulator />} /> 

          <Route path="/*" element={<MainLayout isAuthModalOpen={isAuthModalOpen} setIsAuthModalOpen={setIsAuthModalOpen} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;