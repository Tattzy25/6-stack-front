import { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Heart,
  ShoppingBag,
  Sparkles,
  Settings,
  TrendingUp,
  Plus,
  Users,
  Edit3,
  Crown
} from 'lucide-react';
import { NavigationMenu } from '../components/NavigationMenu';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { FrostCard } from '../components/FrostCard';
import { DesignsTab, FavoritesTab, EditsTab } from '../components/user/tabs';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { masterAccess } from '../config/masterAccess';

interface UserDashboardProps {
  onNavigate: (page: string) => void;
}

export function UserDashboard({ onNavigate }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState('designs');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { user, isAuthenticated, isLoading } = useAuth();
  const isAdmin = user?.stackUserId ? masterAccess.isMasterUser(user.stackUserId) : false;

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Please sign in to access your dashboard');
      onNavigate('auth');
    }
  }, [isAuthenticated, isLoading, onNavigate]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  // Extract user data
  const userName = user.name || user.email?.split('@')[0] || 'User';
  const userEmail = user.email || '';
  const userAvatar = user.avatar || '';
  
  // TODO: These will come from backend API once integrated
  const userStats = {
    designsCreated: 0,
    favorites: 0,
    creditsRemaining: 100 // Default credits for new users
  };
  
  const memberSince = 'October 2025'; // TODO: Get from user creation date
  const plan = 'Free'; // TODO: Get from user subscription

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header/Navigation */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-background">T</span>
              </div>
              <span className="text-xl">TaTTTy Dashboard</span>
            </button>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              {/* Admin Access Button */}
              {isAdmin && (
                <Button 
                  onClick={() => onNavigate('admin')} 
                  className="bg-[#57f1d6] hover:bg-[#45d4be] text-black hidden md:flex"
                >
                  <Crown className="mr-2" size={16} />
                  Admin Panel
                </Button>
              )}
              <Button onClick={() => onNavigate('generate')} className="hidden md:flex">
                <Plus className="mr-2" size={16} />
                Create Design
              </Button>
              <Avatar className="h-10 w-10 cursor-pointer hidden md:block">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>
                  <UserIcon size={20} />
                </AvatarFallback>
              </Avatar>
              
              {/* Hamburger Navigation Menu */}
              <NavigationMenu 
                onNavigate={onNavigate}
                currentPage="dashboard"
                variant="icon"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* User Profile Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="text-2xl">
                  <UserIcon size={32} />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl mb-1 font-[Audiowide]">Welcome back, {userName}</h1>
                <p className="text-muted-foreground">
                  Member since {memberSince} • {plan} Plan
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border/50 hover:border-accent/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Designs</p>
                    <p className="text-3xl">{userStats.designsCreated}</p>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Sparkles className="text-accent" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-accent/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Favorites</p>
                    <p className="text-3xl">{userStats.favorites}</p>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Heart className="text-accent" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-accent/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Credits</p>
                    <p className="text-3xl">{userStats.creditsRemaining}</p>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <TrendingUp className="text-accent" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="designs">
              <Sparkles className="mr-2" size={16} />
              My Designs
            </TabsTrigger>
            <TabsTrigger value="edits">
              <Edit3 className="mr-2" size={16} />
              Edits
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="mr-2" size={16} />
              Favorites
            </TabsTrigger>
          </TabsList>

          {/* My Designs Tab - Empty array until backend integrated */}
          <TabsContent value="designs">
            <DesignsTab
              designs={[]}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </TabsContent>

          {/* Edits Tab */}
          <TabsContent value="edits">
            <EditsTab />
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <FavoritesTab />
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl mb-6 font-[Audiowide]">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FrostCard className="p-6 cursor-pointer hover:border-accent transition-colors group" onClick={() => onNavigate('generate')}>
              <div className="p-4 bg-accent/10 rounded-lg w-fit mb-4 group-hover:bg-accent/20 transition-colors">
                <Sparkles className="text-accent" size={32} />
              </div>
              <h3 className="mb-2">Generate New Design</h3>
              <p className="text-muted-foreground">
                Create a new AI-powered tattoo design based on your story
              </p>
            </FrostCard>

            <FrostCard className="p-6 cursor-pointer hover:border-accent transition-colors group" onClick={() => onNavigate('community')}>
              <div className="p-4 bg-accent/10 rounded-lg w-fit mb-4 group-hover:bg-accent/20 transition-colors">
                <Users className="text-accent" size={32} />
              </div>
              <h3 className="mb-2">Explore Community</h3>
              <p className="text-muted-foreground">
                Browse and get inspired by designs from the TaTTTy community
              </p>
            </FrostCard>

            <FrostCard className="p-6 cursor-pointer hover:border-accent transition-colors group" onClick={() => onNavigate('shop')}>
              <div className="p-4 bg-accent/10 rounded-lg w-fit mb-4 group-hover:bg-accent/20 transition-colors">
                <ShoppingBag className="text-accent" size={32} />
              </div>
              <h3 className="mb-2">Shop Products</h3>
              <p className="text-muted-foreground">
                Browse tattoo aftercare products and TaTTTy merchandise
              </p>
            </FrostCard>
          </div>
        </div>
      </div>
    </div>
  );
}
