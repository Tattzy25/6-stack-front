import { useState } from 'react';
import { Calendar, User, Clock, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BlogPageProps {
  onNavigate: (page: string) => void;
}

export function BlogPage({ onNavigate }: BlogPageProps) {
  const [activeCategory, setActiveCategory] = useState('All Posts');
  const [email, setEmail] = useState('');

  const featuredPost = {
    title: 'The Future of Tattoo Design: How AI is Revolutionizing Body Art',
    excerpt: 'Discover how artificial intelligence is transforming the tattoo industry and empowering people to create more meaningful, personalized designs.',
    image: 'https://images.unsplash.com/photo-1552627019-947c3789ffb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200',
    author: 'Sarah Martinez',
    date: 'October 1, 2025',
    readTime: '8 min read',
    category: 'Technology',
  };

  const blogPosts = [
    {
      title: '10 Tattoo Aftercare Tips Every First-Timer Should Know',
      excerpt: 'Your new tattoo is an investment. Learn how to properly care for your fresh ink to ensure it heals beautifully.',
      image: 'https://images.unsplash.com/photo-1605647533135-51b5906087d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      author: 'Mike Chen',
      date: 'September 28, 2025',
      readTime: '5 min read',
      category: 'Aftercare',
    },
    {
      title: 'Couples Tattoos That Actually Work: Design Ideas & Tips',
      excerpt: 'Planning matching tattoos with your partner? Here are creative ideas and advice to ensure your couples tattoo stands the test of time.',
      image: 'https://images.unsplash.com/photo-1605381942640-0a262ce59788?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      author: 'Jessica Thompson',
      date: 'September 25, 2025',
      readTime: '6 min read',
      category: 'Inspiration',
    },
    {
      title: 'From Corporate to Creative: Career Tattoos in Professional Settings',
      excerpt: 'Breaking down the stigma: How professionals are embracing meaningful career-inspired tattoos in the modern workplace.',
      image: 'https://images.unsplash.com/photo-1722149493669-30098ef78f9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      author: 'David Kim',
      date: 'September 22, 2025',
      readTime: '7 min read',
      category: 'Lifestyle',
    },
    {
      title: 'The Art of Cover-Ups: Transforming Tattoo Regrets into Masterpieces',
      excerpt: 'Not happy with an old tattoo? Learn about the cover-up process and how AI can help you reimagine what\'s possible.',
      image: 'https://images.unsplash.com/photo-1519217651866-847339e674d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      author: 'Alex Rodriguez',
      date: 'September 19, 2025',
      readTime: '6 min read',
      category: 'Education',
    },
    {
      title: 'Minimalist Tattoos: Less is More in 2025',
      excerpt: 'Why minimalist tattoo designs are trending and how to create simple yet powerful symbolic art.',
      image: 'https://images.unsplash.com/photo-1565058698270-c8e5c574f25e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      author: 'Emma Wilson',
      date: 'September 16, 2025',
      readTime: '5 min read',
      category: 'Trends',
    },
    {
      title: 'LA Tattoo Culture: A Guide to the Best Studios in Los Angeles',
      excerpt: 'From Hollywood to Venice Beach, explore the vibrant tattoo scene in Los Angeles and find your perfect artist.',
      image: 'https://images.unsplash.com/photo-1619678562883-7f77b7c68d3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      author: 'Carlos Martinez',
      date: 'September 13, 2025',
      readTime: '9 min read',
      category: 'Local',
    },
  ];

  const categories = [
    'All Posts',
    'Technology',
    'Inspiration',
    'Education',
    'Aftercare',
    'Trends',
    'Lifestyle',
    'Local',
  ];

  const popularTags = [
    'AI Tattoos',
    'Design Tips',
    'First Tattoo',
    'Cover-Ups',
    'Los Angeles',
    'Minimalist',
    'Couples Tattoos',
    'Typography',
    'Career',
    'Aftercare',
  ];

  const filteredPosts = activeCategory === 'All Posts' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with ${email}!`);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <section className="py-12 md:py-16 lg:py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl leading-tight">
              <span className="block font-[Rock_Salt] teal-echo">TaTTTy Blog</span>
              <span className="block bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
                Stories, Tips & Inspiration
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground px-4">
              Expert advice, tattoo trends, and inspiring stories from the world of AI-powered tattoo design.
            </p>
          </div>
        </div>
      </section>

      <section className="py-4 md:py-6 border-b border-border sticky top-16 bg-background/95 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === activeCategory ? 'default' : 'outline'}
                size="sm"
                className="whitespace-nowrap text-xs sm:text-sm"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="overflow-hidden border-2 hover:border-accent transition-all cursor-pointer group">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="relative aspect-video md:aspect-auto overflow-hidden">
                  <ImageWithFallback
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <Badge className="absolute top-3 left-3 md:top-4 md:left-4 bg-accent text-background">Featured</Badge>
                </div>
                <CardContent className="p-5 md:p-8 flex flex-col justify-center">
                  <Badge variant="outline" className="w-fit mb-3 md:mb-4 text-xs">
                    {featuredPost.category}
                  </Badge>
                  <h2 className="text-xl sm:text-2xl md:text-3xl mb-3 md:mb-4">{featuredPost.title}</h2>
                  <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">{featuredPost.excerpt}</p>
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <User size={14} className="md:w-4 md:h-4" />
                      <span className="truncate">{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <Calendar size={14} className="md:w-4 md:h-4" />
                      <span className="hidden sm:inline">{featuredPost.date}</span>
                      <span className="sm:hidden">Oct 1, 2025</span>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <Clock size={14} className="md:w-4 md:h-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  <Button className="w-fit text-sm md:text-base">
                    Read Article
                    <ArrowRight className="ml-2" size={16} />
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl md:text-3xl mb-6 md:mb-8">
                  {activeCategory === 'All Posts' ? 'Latest Articles' : `${activeCategory} Articles`}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {filteredPosts.map((post, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                      <div className="relative aspect-video overflow-hidden">
                        <ImageWithFallback
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        <Badge variant="secondary" className="absolute top-4 left-4">
                          {post.category}
                        </Badge>
                      </div>
                      <CardContent className="p-6 space-y-3">
                        <h3 className="text-xl line-clamp-2">{post.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-3 border-t border-border">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredPosts.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground">No articles found in this category</p>
                  </div>
                )}

                {filteredPosts.length > 0 && (
                  <div className="text-center mt-12">
                    <Button variant="outline" size="lg">
                      Load More Articles
                    </Button>
                  </div>
                )}
              </div>

              <aside className="w-full lg:w-80 space-y-8">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-xl">Subscribe to Our Newsletter</h3>
                    <p className="text-sm text-muted-foreground">
                      Get the latest tattoo trends, tips, and AI design insights delivered to your inbox.
                    </p>
                    <form onSubmit={handleSubscribe} className="space-y-3">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Button className="w-full" type="submit">Subscribe</Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag size={20} />
                      <h3 className="text-xl">Popular Tags</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag) => (
                        <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-xl mb-4">Recent Posts</h3>
                    <div className="space-y-4">
                      {blogPosts.slice(0, 3).map((post, index) => (
                        <div key={index} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0 cursor-pointer group">
                          <ImageWithFallback
                            src={post.image}
                            alt={post.title}
                            className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm line-clamp-2 group-hover:text-purple-600 transition-colors mb-1">
                              {post.title}
                            </p>
                            <p className="text-xs text-muted-foreground">{post.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-background"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(87,241,214,0.15),transparent_60%)]"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 font-[Rock_Salt] teal-echo">
            Ready to Create Your Own Tattoo?
          </h2>
          <p className="text-base sm:text-lg mb-6 md:mb-8 text-muted-foreground max-w-2xl mx-auto px-4">
            Use our AI-powered creator to design a tattoo that tells your unique story.
          </p>
          <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6" onClick={() => onNavigate('generate')}>
            <Sparkles className="mr-2" size={20} />
            Start Designing Now
          </Button>
        </div>
      </section>
    </div>
  );
}
