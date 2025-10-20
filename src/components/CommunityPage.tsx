import { useState } from 'react';
import { Heart, MessageCircle, Share2, TrendingUp, Users, Award, Search, Filter, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CommunityPageProps {
  onNavigate: (page: string) => void;
}

export function CommunityPage({ onNavigate }: CommunityPageProps) {
  const [activeCategory, setActiveCategory] = useState('All Designs');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredDesigns = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1605647533135-51b5906087d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      title: 'Phoenix Rising',
      artist: 'Sarah M.',
      location: 'Los Angeles, CA',
      likes: 2453,
      comments: 187,
      category: 'TaTTTy',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1552627019-947c3789ffb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      title: 'Eternal Bond',
      artist: 'Mike & Emma',
      location: 'Santa Monica, CA',
      likes: 3891,
      comments: 256,
      category: 'Couples',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1619678562883-7f77b7c68d3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      title: 'Career Journey',
      artist: 'David K.',
      location: 'Downtown LA',
      likes: 1876,
      comments: 143,
      category: 'Career',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1565058698270-c8e5c574f25e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      title: 'Cosmic Octopus',
      artist: 'Jessica T.',
      location: 'Venice Beach, CA',
      likes: 4521,
      comments: 298,
      category: 'Weird Shit',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1519217651866-847339e674d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      title: 'Style Transformation',
      artist: 'Alex R.',
      location: 'Hollywood, CA',
      likes: 3214,
      comments: 201,
      category: 'Swap',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1605381942640-0a262ce59788?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      title: 'Custom Script',
      artist: 'Ryan & Lisa',
      location: 'Pasadena, CA',
      likes: 2987,
      comments: 176,
      category: 'Fonts',
      avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop',
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1590246814883-57c511e56c06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      title: 'Sleeve Extension',
      artist: 'Marcus T.',
      location: 'Long Beach, CA',
      likes: 3567,
      comments: 234,
      category: 'Extend',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1598662957477-64634a66e3e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      title: 'Bold Cover-Up',
      artist: 'Nina P.',
      location: 'Burbank, CA',
      likes: 2876,
      comments: 198,
      category: 'Cover-Ups',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    {
      id: 9,
      image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      title: 'Creative Exploration',
      artist: 'Jordan L.',
      location: 'Culver City, CA',
      likes: 4123,
      comments: 287,
      category: 'Ideas',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
  ];

  const topArtists = [
    { name: 'Sarah Martinez', designs: 127, followers: '12.5K', location: 'Los Angeles, CA', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
    { name: 'Michael Chen', designs: 98, followers: '10.2K', location: 'Santa Monica, CA', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    { name: 'Jessica Thompson', designs: 156, followers: '15.8K', location: 'Venice Beach, CA', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
    { name: 'David Kim', designs: 89, followers: '9.1K', location: 'Downtown LA', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  ];

  const categories = [
    'All Designs',
    'Freestyle',
    'TaTTTy',
    'Couples',
    'Career',
    'Cover-Ups',
    'Extend',
    'Fonts',
    'Ideas',
    'Weird Shit',
    'Swap',
  ];

  const filteredDesigns = featuredDesigns.filter(design => {
    const matchesCategory = activeCategory === 'All Designs' || design.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-16 bg-background">
      <section className="py-12 md:py-16 lg:py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl leading-tight">
              <span className="block font-[Rock_Salt] teal-echo">Tattoo World</span>
              <span className="block bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
                Community & Inspiration
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground px-4">
              Explore designs from all 10 creators, connect with artists worldwide, and find inspiration for your next ink.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Search designs, artists, styles..."
                  className="pl-10 text-sm md:text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button className="text-sm md:text-base">
                <Filter className="mr-2" size={16} />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent mb-1 md:mb-2">
                500K+
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Designs Created</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent mb-1 md:mb-2">
                100K+
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Community Members</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent mb-1 md:mb-2">
                25K+
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Active Creators</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent mb-1 md:mb-2">
                4.9★
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="featured" className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="featured" className="flex-1 md:flex-none text-xs sm:text-sm">
                  <TrendingUp className="mr-1 sm:mr-2" size={14} />
                  Featured
                </TabsTrigger>
                <TabsTrigger value="recent" className="flex-1 md:flex-none text-xs sm:text-sm">Recent</TabsTrigger>
                <TabsTrigger value="top" className="flex-1 md:flex-none text-xs sm:text-sm">Top Rated</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                {categories.slice(0, 6).map((category) => (
                  <Button 
                    key={category} 
                    variant={activeCategory === category ? 'default' : 'outline'}
                    size="sm" 
                    className="whitespace-nowrap text-xs"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <TabsContent value="featured" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredDesigns.map((design) => (
                  <Card key={design.id} className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                    <div className="relative aspect-square overflow-hidden">
                      <ImageWithFallback
                        src={design.image}
                        alt={design.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute top-2 right-2 md:top-3 md:right-3 px-2 md:px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs">
                        {design.category}
                      </div>
                    </div>
                    <CardContent className="p-3 md:p-4 space-y-2 md:space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-base md:text-lg mb-1">{design.title}</h3>
                          <div className="flex items-center gap-2">
                            <ImageWithFallback
                              src={design.avatar}
                              alt={design.artist}
                              className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover"
                            />
                            <div className="text-xs md:text-sm">
                              <p className="text-muted-foreground">{design.artist}</p>
                              <p className="text-xs text-muted-foreground">{design.location}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 md:gap-4 pt-2 border-t border-border text-xs md:text-sm text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                          <Heart size={14} className="md:w-4 md:h-4" />
                          <span>{design.likes.toLocaleString()}</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                          <MessageCircle size={14} className="md:w-4 md:h-4" />
                          <span>{design.comments}</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-accent transition-colors ml-auto">
                          <Share2 size={14} className="md:w-4 md:h-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredDesigns.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">No designs found matching your search</p>
                </div>
              )}
              
              {filteredDesigns.length > 0 && (
                <div className="text-center mt-8 md:mt-12">
                  <Button variant="outline" size="lg" className="text-sm md:text-base">
                    Load More Designs
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[...filteredDesigns].reverse().slice(0, 6).map((design) => (
                  <Card key={design.id} className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                    <div className="relative aspect-square overflow-hidden">
                      <ImageWithFallback
                        src={design.image}
                        alt={design.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute top-2 right-2 md:top-3 md:right-3 px-2 md:px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs">
                        {design.category}
                      </div>
                    </div>
                    <CardContent className="p-3 md:p-4 space-y-2 md:space-y-3">
                      <h3 className="text-base md:text-lg">{design.title}</h3>
                      <div className="flex items-center gap-2">
                        <ImageWithFallback
                          src={design.avatar}
                          alt={design.artist}
                          className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover"
                        />
                        <p className="text-xs md:text-sm text-muted-foreground">{design.artist}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="top" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[...filteredDesigns].sort((a, b) => b.likes - a.likes).slice(0, 6).map((design) => (
                  <Card key={design.id} className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                    <div className="relative aspect-square overflow-hidden">
                      <ImageWithFallback
                        src={design.image}
                        alt={design.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute top-2 right-2 md:top-3 md:right-3 px-2 md:px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs">
                        {design.category}
                      </div>
                    </div>
                    <CardContent className="p-3 md:p-4 space-y-2 md:space-y-3">
                      <h3 className="text-base md:text-lg">{design.title}</h3>
                      <div className="flex items-center gap-2">
                        <ImageWithFallback
                          src={design.avatar}
                          alt={design.artist}
                          className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover"
                        />
                        <p className="text-xs md:text-sm text-muted-foreground">{design.artist}</p>
                      </div>
                      <div className="flex items-center gap-1 text-red-500 text-sm">
                        <Heart size={14} fill="currentColor" />
                        <span>{design.likes.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl mb-2 font-[Rock_Salt] teal-echo">Top Creators</h2>
              <p className="text-muted-foreground">Follow the best designers across all 10 generators</p>
            </div>
            <Button variant="outline">
              <Users className="mr-2" size={16} />
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topArtists.map((artist, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="relative inline-block">
                    <ImageWithFallback
                      src={artist.avatar}
                      alt={artist.name}
                      className="w-20 h-20 rounded-full object-cover mx-auto"
                    />
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Award size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="mb-1">{artist.name}</h3>
                    <p className="text-sm text-muted-foreground">{artist.location}</p>
                  </div>
                  <div className="flex justify-around text-sm pt-3 border-t border-border">
                    <div>
                      <p className="text-muted-foreground">Designs</p>
                      <p>{artist.designs}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Followers</p>
                      <p>{artist.followers}</p>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    Follow
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-background"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(87,241,214,0.15),transparent_60%)]"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 font-[Rock_Salt] teal-echo">
            Join the Life Ink Community
          </h2>
          <p className="text-base sm:text-lg mb-6 md:mb-8 text-muted-foreground max-w-2xl mx-auto px-4">
            Share designs from all 10 generators, get inspired by others, and connect with tattoo enthusiasts worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6" onClick={() => onNavigate('generate')}>
              <Sparkles className="mr-2" size={20} />
              Create Your Design
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6">
              <Users className="mr-2" size={20} />
              Sign Up Free
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
