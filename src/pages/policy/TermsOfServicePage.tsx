import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { FrostCard } from '../../components/FrostCard';

interface TermsOfServicePageProps {
  onNavigate: (page: string) => void;
}

export function TermsOfServicePage({ onNavigate }: TermsOfServicePageProps) {
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
          <h1 className="text-[#57f1d6] mb-4">Terms of Service</h1>
          <p className="text-white/60">
            Last updated: October 15, 2025
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <FrostCard className="p-8">
            <h2 className="text-white mb-4">The Deal</h2>
            <p className="text-white/80 mb-4">
              Welcome to TaTTTy. By using our service, you're agreeing to these terms. We know nobody actually reads these things, so we tried to make it less painful. Let's keep it real.
            </p>
          </FrostCard>

          <FrostCard className="p-8">
            <h2 className="text-white mb-4">What TaTTTy Does</h2>
            <p className="text-white/80 mb-4">
              TaTTTy is an AI-powered tattoo design generator. We turn your stories, ideas, and vibes into custom tattoo designs. We offer:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li><span className="text-white">Freestyle Generator</span> - Your story, your design</li>
              <li><span className="text-white">Couples Tattoos</span> - Matching ink for you and your person</li>
              <li><span className="text-white">Cover-Up Designs</span> - Transform old tattoos into something new</li>
              <li><span className="text-white">Extend Tattoos</span> - Add to your existing ink</li>
            </ul>
          </FrostCard>

          <FrostCard className="p-8">
            <h2 className="text-white mb-4">Your Account</h2>
            <p className="text-white/80 mb-4">
              You need to be 18+ to use TaTTTy. When you create an account:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li>Keep your login secure - don't share it with randoms</li>
              <li>You're responsible for everything that happens on your account</li>
              <li>Don't create multiple accounts to abuse the system</li>
              <li>Be honest - fake info = account termination</li>
            </ul>
          </FrostCard>

          <FrostCard className="p-8">
            <h2 className="text-white mb-4">Intellectual Property</h2>
            <p className="text-white/80 mb-4">
              Here's how ownership works:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li><span className="text-white">Your Designs:</span> You own the tattoo designs we create for you</li>
              <li><span className="text-white">Our Platform:</span> We own TaTTTy, the AI, and all the tech behind it</li>
              <li><span className="text-white">Community Content:</span> If you share designs publicly, you give us permission to display them</li>
              <li><span className="text-white">Commercial Use:</span> Use your designs however you want - get them inked, share them, sell them, whatever</li>
            </ul>
          </FrostCard>

          <FrostCard className="p-8">
            <h2 className="text-white mb-4">What We're NOT Responsible For</h2>
            <p className="text-white/80 mb-4">
              Real talk - we're a design tool, not your tattoo artist or therapist:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li>How your actual tattoo turns out (that's on your artist)</li>
              <li>Tattoo placement advice or medical considerations</li>
              <li>Allergic reactions, infections, or tattoo regret</li>
              <li>Design copyright issues if you copy someone else's work</li>
              <li>Bad decisions made under the influence</li>
            </ul>
          </FrostCard>

          <FrostCard className="p-8">
            <h2 className="text-white mb-4">Payments & Subscriptions</h2>
            <p className="text-white/80 mb-4">
              We offer both token-based and subscription models:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li>All purchases are final (no refunds after designs are generated)</li>
              <li>Subscriptions auto-renew unless you cancel</li>
              <li>Cancel anytime - you keep access until the period ends</li>
              <li>We might change pricing, but we'll give you a heads up</li>
            </ul>
          </FrostCard>

          <FrostCard className="p-8">
            <h2 className="text-white mb-4">Content Guidelines</h2>
            <p className="text-white/80 mb-4">
              Don't be that person. When using TaTTTy:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li>No hate symbols, racist imagery, or offensive content</li>
              <li>No illegal stuff (seriously, don't)</li>
              <li>No trying to break or hack the system</li>
              <li>No spam or abusive behavior in the community</li>
              <li>Respect other users and their designs</li>
            </ul>
          </FrostCard>

          <FrostCard className="p-8">
            <h2 className="text-white mb-4">AI-Generated Content</h2>
            <p className="text-white/80 mb-4">
              Our AI is powerful but not perfect:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li>Designs are unique but may have similarities to existing work</li>
              <li>AI interpretation of your story may vary</li>
              <li>We can't guarantee specific styles or results</li>
              <li>Show your design to a professional artist before getting it inked</li>
            </ul>
          </FrostCard>

          <FrostCard className="p-8">
            <h2 className="text-white mb-4">Termination</h2>
            <p className="text-white/80 mb-4">
              We can terminate accounts that violate these terms. You can also delete your account anytime. If you're banned for being shady, no refunds.
            </p>
          </FrostCard>

          <FrostCard className="p-8">
            <h2 className="text-white mb-4">Disclaimers</h2>
            <p className="text-white/80 mb-4">
              TaTTTy is provided "as is" - we're constantly improving but can't guarantee perfection. We're not liable for any damages from using (or not being able to use) the service.
            </p>
          </FrostCard>

          <FrostCard className="p-8">
            <h2 className="text-white mb-4">Changes to Terms</h2>
            <p className="text-white/80 mb-4">
              We might update these terms. If we make major changes, we'll let you know. Continued use means you accept the new terms.
            </p>
          </FrostCard>

          <FrostCard className="p-8">
            <h2 className="text-white mb-4">Contact & Disputes</h2>
            <p className="text-white/80 mb-4">
              Got issues? Let's work it out. Contact us first before going nuclear with legal stuff. We're reasonable people.
            </p>
          </FrostCard>

          <FrostCard className="p-8">
            <h2 className="text-white mb-4">Final Word</h2>
            <p className="text-white/80">
              TaTTTy is here to help you create meaningful, unique tattoo designs. We're not trying to scam you or make things complicated. Use the platform responsibly, respect others, and let's make some sick art together.
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
