import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#57f1d6] border-t border-black/10">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-[#57f1d6]">T</span>
              </div>
              <span className="text-xl text-black">TaTTTy</span>
            </div>
            <p className="text-black/70 text-sm">
              AI-powered tattoo design generator. Create meaningful tattoos based on your life story.
            </p>
            <div className="flex items-center space-x-2 text-sm text-black/70">
              <MapPin size={16} />
              <span>Los Angeles, CA</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 text-black">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('generate')} className="text-black/70 hover:text-black transition-colors">
                  Creator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('community')} className="text-black/70 hover:text-black transition-colors">
                  Community
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="text-black/70 hover:text-black transition-colors">
                  Pricing
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-black">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('about')} className="text-black/70 hover:text-black transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="text-black/70 hover:text-black transition-colors">
                  Blog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('community')} className="text-black/70 hover:text-black transition-colors">
                  Community
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="text-black/70 hover:text-black transition-colors">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 text-black">Stay Updated</h4>
            <p className="text-sm text-black/70 mb-4">
              Get the latest tattoo trends and AI updates.
            </p>
            <div className="flex space-x-2 mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-white border border-black/20 rounded-md text-sm text-black placeholder:text-black/50"
              />
              <button className="px-4 py-2 bg-black text-[#57f1d6] rounded-md hover:opacity-90 transition-opacity">
                <Mail size={16} />
              </button>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-black/70 hover:text-black transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-black/70 hover:text-black transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-black/70 hover:text-black transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-black/70 hover:text-black transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs sm:text-sm text-black/70 text-center md:text-left">
            © 2025 TaTTTy. All rights reserved. Based in Los Angeles, California.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <button 
              onClick={() => onNavigate('privacy-policy')}
              className="text-black/70 hover:text-black transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => onNavigate('terms-of-service')}
              className="text-black/70 hover:text-black transition-colors"
            >
              Terms of Service
            </button>
            <button className="text-black/70 hover:text-black transition-colors">
              Cookie Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
