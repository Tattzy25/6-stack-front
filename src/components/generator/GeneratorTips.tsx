import { Card, CardContent } from '../ui/card';

export function GeneratorTips() {
  const cardStyle = {
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
    borderRadius: '70px'
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl mb-8 text-center">Pro Tips for Better Designs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-accent/20" style={cardStyle}>
              <CardContent className="p-6">
                <h3 className="mb-2">Be Specific</h3>
                <p className="text-sm text-muted-foreground">
                  The more details you provide about your story, the more personalized and meaningful your design will be.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-accent/20" style={cardStyle}>
              <CardContent className="p-6">
                <h3 className="mb-2">Include Symbolism</h3>
                <p className="text-sm text-muted-foreground">
                  Mention specific symbols, animals, or objects that have meaning to you for more targeted results.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-accent/20" style={cardStyle}>
              <CardContent className="p-6">
                <h3 className="mb-2">Choose Your Style</h3>
                <p className="text-sm text-muted-foreground">
                  Selecting a specific tattoo style helps the AI understand your aesthetic preferences better.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-accent/20" style={cardStyle}>
              <CardContent className="p-6">
                <h3 className="mb-2">Consider Placement</h3>
                <p className="text-sm text-muted-foreground">
                  Think about where you want your tattoo - different placements work better for different designs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
