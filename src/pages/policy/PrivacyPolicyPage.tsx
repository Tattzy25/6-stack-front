import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { FrostCard } from '../../components/FrostCard';

interface PrivacyPolicyPageProps {
  onNavigate: (page: string) => void;
}

export function PrivacyPolicyPage({ onNavigate }: PrivacyPolicyPageProps) {
  return (
    <div className="min-h-screen bg-[#0C0C0D] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate('home')}
          className="mb-8 text-[#57f1d6] hover:text-[#57f1d6]/80 hover:bg-[#57f1d6]/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-[#57f1d6] mb-4">Privacy Policy</h1>
          <p className="text-white/60">
            Last updated: October 15, 2025
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <FrostCard className="p-8">
            <h2 className="text-white mb-4">What We Collect</h2>
            <p className="text-white/80 mb-4">
              Look, we're not out here trying to steal your life story (unless you want us to turn it into a sick tattoo). Here's what we actually collect:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li>Your email address when you sign up</li>
              <li>The tattoo designs you create (obviously)</li>
              <li>Your preferences and saved designs</li>
              <li>Basic usage data to make the app not suck</li>
            </ul>
          </FrostCard>

          <FrostCard className="p-8">
            <h2 className="text-white mb-4">How We Use Your Data</h2>
            <p className="text-white/80 mb-4">
              We're not selling your info to random companies or spamming you with nonsense. Your data is used to:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li>Generate your custom tattoo designs</li>
              <li>Save your creations so you don't lose them</li>
              <li>Improve our AI so it gets even better at reading your vibe</li>
              <li>Send you updates about your designs (only if you want them)</li>
            </ul>
          </FrostCard>

          <FrostCard className="p-8">
            <h2 className="text-white mb-4">AI & Your Stories</h2>
            <p className="text-white/80 mb-4">
              When you share your story with TaTTTy's AI, we treat it with respect. Your personal narratives are used solely to create your unique tattoo designs. We don't use your stories to train models for other users or share them publicly without your explicit permission.
            </p>
          </FrostCard>

          <FrostCard className="p-8">
            <h2 className="text-white mb-4">Third-Party Services</h2>
            <p className="text-white/80 mb-4">
              We work with a few trusted partners to make TaTTTy work:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li><span className="text-white">Google OAuth</span> - For secure sign-in (we don't see your password)</li>
              <li><span className="text-white">Neon Database</span> - Where we safely store your designs</li>
              <li><span className="text-white">AI Services</span> - To generate your tattoo artwork</li>
            </ul>
          </FrostCard>

          <FrostCard className="p-8">
            <h2 className="text-white mb-4">Your Rights</h2>
            <p className="text-white/80 mb-4">
              You own your data. Period. You can:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li>Download all your designs anytime</li>
              <li>Delete your account and all associated data</li>
              <li>Request what data we have on you</li>
              <li>Opt out of any communications</li>
            </ul>
          </FrostCard>

          <FrostCard className="p-8">
            <h2 className="text-white mb-4">Cookies & Tracking</h2>
            <p className="text-white/80 mb-4">
              We use minimal cookies to keep you logged in and remember your preferences. We're not tracking your every move across the internet - that's creepy and we're not about that.
            </p>
          </FrostCard>

          <FrostCard className="p-8">
            <h2 className="text-white mb-4">Data Security</h2>
            <p className="text-white/80 mb-4">
              We take security seriously. Your data is encrypted, stored securely, and we follow industry best practices. If there's ever a breach (knock on wood), we'll let you know immediately.
            </p>
          </FrostCard>

          <FrostCard className="p-8">
            <h2 className="text-white mb-4">Kids & Privacy</h2>
            <p className="text-white/80 mb-4">
              TaTTTy is for adults 18+. We don't knowingly collect data from anyone under 18. If you're a parent and think your kid signed up, hit us up and we'll delete their account ASAP.
            </p>
          </FrostCard>

          <FrostCard className="p-8">
            <h2 className="text-white mb-4">Changes to This Policy</h2>
            <p className="text-white/80 mb-4">
              We might update this policy from time to time. When we do, we'll update the date at the top and let you know if there's anything major. We won't pull any shady moves on you.
            </p>
          </FrostCard>

          <FrostCard className="p-8">
            <h2 className="text-white mb-4">Questions?</h2>
            <p className="text-white/80">
              Got questions about your privacy? We're here for it. Reach out to us and we'll actually respond (crazy concept, we know).
            </p>
          </FrostCard>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Button
            onClick={() => onNavigate('home')}
            className="bg-[#57f1d6] hover:bg-[#57f1d6]/90 text-black"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
