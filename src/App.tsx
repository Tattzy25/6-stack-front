import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { CommunityPage } from './components/CommunityPage';
import { BlogPage } from './components/BlogPage';
import { GeneratorPage } from './components/GeneratorPage';
import { AuthPage } from './components/AuthPage';
import { UserDashboard } from './pages/UserDashboard';
import { GoogleCallbackHandler } from './components/GoogleCallbackHandler';
import { PricingPage } from './components/PricingPage';
import { NotFoundPage } from './components/NotFoundPage';
import { PrivacyPolicyPage } from './pages/policy/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/policy/TermsOfServicePage';
import { FloatingEditor } from './components/FloatingEditor';
import { ScreenshotProtection } from './components/shared/ScreenshotProtection';
import { Toaster } from './components/ui/sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GeneratorProvider } from './contexts/GeneratorContext';
import { InkProvider } from './contexts/InkContext';
import { ImageEditProvider } from './contexts/ImageEditContext';
import { toast } from 'sonner';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const { setUser, signOut, isAuthenticated } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);

  // Check for OAuth callback on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('code')) {
      setCurrentPage('callback');
    }
    window.scrollTo(0, 0);
  }, []);

  const handleNavigate = async (page: string) => {
    // Handle logout
    if (page === 'logout') {
      try {
        await signOut();
        toast.success('Logged out successfully');
        setCurrentPage('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        toast.error('Logout failed. Please try again.');
        console.error('Logout error:', error);
      }
      return;
    }

    // Protect dashboard - redirect to auth if not logged in
    if (page === 'dashboard' && !isAuthenticated) {
      toast.error('Please sign in to access your dashboard');
      setCurrentPage('auth');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (user: any) => {
    setUser(user);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'community':
        return <CommunityPage onNavigate={handleNavigate} />;
      case 'blog':
        return <BlogPage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <UserDashboard onNavigate={handleNavigate} />;
      case 'auth':
        return <AuthPage onNavigate={handleNavigate} />;
      case 'callback':
        return <GoogleCallbackHandler onNavigate={handleNavigate} onAuthSuccess={handleAuthSuccess} />;
      case 'pricing':
        return <PricingPage onNavigate={handleNavigate} />;
      case 'privacy-policy':
        return <PrivacyPolicyPage onNavigate={handleNavigate} />;
      case 'terms-of-service':
        return <TermsOfServicePage onNavigate={handleNavigate} />;
      case 'generate':
      case 'login':
      case 'about':
      case 'contact':
      case 'settings':
      case 'account':
        return <GeneratorPage onNavigate={handleNavigate} />;
      case '404':
      case 'not-found':
        return <NotFoundPage onNavigate={handleNavigate} />;
      default:
        // Unknown route - show 404 page
        return <NotFoundPage onNavigate={handleNavigate} />;
    }
  };

  const hideHeaderPages = ['dashboard', 'auth', 'callback', '404', 'not-found'];
  const hideFooterPages = ['dashboard', 'generate', 'auth', 'callback', '404', 'not-found'];
  const shouldHideHeader = hideHeaderPages.includes(currentPage);
  const shouldHideFooter = hideFooterPages.includes(currentPage);
  
  // Only lock height for generator page (dashboard needs to scroll)
  const fixedHeightPages = ['generate'];
  const isFixedHeight = fixedHeightPages.includes(currentPage);

  return (
    <div className={`${isFixedHeight ? 'h-screen overflow-hidden' : 'min-h-screen'} flex flex-col`}>
      {!shouldHideHeader && <Header currentPage={currentPage} onNavigate={handleNavigate} />}
      <main className={`h-full ${isFixedHeight ? 'overflow-hidden' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="h-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      {!shouldHideFooter && <Footer onNavigate={handleNavigate} />}
      
      {/* Floating Editor Widget */}
      <FloatingEditor
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
        selectedElement={selectedElement}
        onSave={() => {}}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <InkProvider>
        <GeneratorProvider>
          <ScreenshotProtection />
          <ImageEditProvider>
            <AppContent />
            <Toaster position="bottom-center" expand={false} richColors />
          </ImageEditProvider>
        </GeneratorProvider>
      </InkProvider>
    </AuthProvider>
  );
}