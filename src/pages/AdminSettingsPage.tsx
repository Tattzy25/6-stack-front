import { useEffect, useState } from 'react';
import { isMasterPasscode } from '../config/masterAccess';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Lock, Settings } from 'lucide-react';
import { FloatingEditor } from '../components/FloatingEditor';

interface AdminSettingsPageProps {
  onNavigate?: (page: string) => void;
}

export function AdminSettingsPage({ onNavigate }: AdminSettingsPageProps) {
  const [code, setCode] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('tattty_admin_unlocked') === 'true';
    setUnlocked(saved);
  }, []);

  const handleUnlock = () => {
    if (!code.trim()) return;
    if (isMasterPasscode(code.trim())) {
      setUnlocked(true);
      localStorage.setItem('tattty_admin_unlocked', 'true');
      toast.success('Admin unlocked');
    } else {
      toast.error('Invalid code');
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-sm p-6 bg-[#0C0C0D]/80 backdrop-blur-xl border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-white/70" />
            <h1 className="text-white text-lg font-medium">Admin Settings</h1>
          </div>
          <p className="text-white/60 text-sm mb-4">Enter master code to access admin settings.</p>
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="Master code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-black/40 text-white border-white/20"
            />
            <Button onClick={handleUnlock} className="bg-[#57f1d6]/20 border border-[#57f1d6]/40 text-[#57f1d6] hover:bg-[#57f1d6]/30">
              Unlock
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-[#57f1d6]" />
          <h1 className="text-white text-xl font-semibold">Admin Settings</h1>
        </div>
        {/* Leave the radio + chat widget here for now */}
        <FloatingEditor />
      </div>
    </div>
  );
}