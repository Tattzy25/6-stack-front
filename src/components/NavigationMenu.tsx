import { Menu, X, Home, Users, BookOpen, LayoutDashboard, User, Settings, Info, Mail, DollarSign, Sparkles, Palette, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationMenuProps {
  onNavigate: (page: string) => void;
  currentPage?: string;
  className?: string;
  variant?: 'icon' | 'button';
}

export function NavigationMenu({ onNavigate, currentPage, className = '', variant = 'icon' }: NavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  // admin menu removed

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setIsOpen(false);
  };

  const menuSections = [
    {
      title: '',
      items: [
        { icon: Home, label: 'Home', page: 'home' },
        { icon: Sparkles, label: 'TaTTTy', page: 'generate' },
        { icon: Users, label: 'Community', page: 'community' },
        { icon: BookOpen, label: 'Blog', page: 'blog' },
        ...(isAuthenticated ? [
          { icon: LayoutDashboard, label: 'Dashboard', page: 'dashboard' },
          { icon: User, label: 'Account', page: 'account' },
          { icon: Settings, label: 'Settings', page: 'settings' },
        ] : []),
        // Admin menu item removed
        { icon: Info, label: 'About', page: 'about' },
        { icon: DollarSign, label: 'Pricing', page: 'pricing' },
        { icon: Mail, label: 'Contact', page: 'contact' },
        ...(isAuthenticated ? [
          { icon: LogOut, label: 'Logout', page: 'logout', isDestructive: true }
        ] : []),
      ]
    },
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Hamburger Button */}
      {variant === 'icon' ? (
        <button
          onClick={toggleMenu}
          className="p-2 hover:bg-accent/10 rounded-md transition-colors"
          aria-label="Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      ) : (
        <Button
          onClick={toggleMenu}
          variant="outline"
          size="icon"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      )}

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed right-4 top-20 z-50 w-52 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-lg shadow-2xl"
            >
              <div className="p-3 space-y-2">
                {menuSections.map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    {section.title && (
                      <h4 className="text-xs uppercase text-muted-foreground mb-2 px-2">
                        {section.title}
                      </h4>
                    )}
                    <div className="space-y-0.5">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.page;
                        
                        return (
                          <button
                            key={item.page}
                            onClick={() => handleNavigation(item.page)}
                            className={`w-full flex items-center space-x-3 px-3 py-1.5 rounded-lg transition-all ${
                              isActive
                                ? 'text-accent'
                                : item.isDestructive
                                ? 'text-destructive hover:opacity-70'
                                : (item as any).isSpecial
                                ? 'text-[#57f1d6] hover:opacity-70'
                                : 'text-foreground hover:opacity-70'
                            }`}
                          >
                            <Icon size={20} className="flex-shrink-0" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}