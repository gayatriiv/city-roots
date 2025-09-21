import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Users, Award, Heart, Target, Lightbulb } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { icon: Users, value: "Just Started", label: "Our Journey" },
    { icon: Leaf, value: "10+", label: "Plant Varieties" },
    { icon: Award, value: "Fresh", label: "New Approach" },
    { icon: Heart, value: "Growing", label: "With You" },
  ];

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To bring the beauty and benefits of nature into every urban home, making city gardening accessible and enjoyable for everyone."
    },
    {
      icon: Heart,
      title: "Our Passion",
      description: "We believe that plants have the power to transform urban spaces, improve well-being, and connect city dwellers with nature."
    },
    {
      icon: Lightbulb,
      title: "Our Approach",
      description: "As a new company, we're learning and growing alongside our customers, providing fresh perspectives and innovative solutions."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-6">
            About City Roots
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're a fresh new company passionate about bringing the beauty of nature into your urban home. 
            Our mission is to make urban gardening accessible, enjoyable, and rewarding for city dwellers.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  City Roots was born from a simple belief: urban dwellers deserve to experience 
                  the joy and benefits of having plants in their city homes. What started as a 
                  passion for urban gardening has become our mission to bring nature to the city.
                </p>
                <p>
                  We understand that city gardening can seem challenging at first. That's why we're 
                  building a platform that provides not just beautiful plants, but also the tools, 
                  knowledge, and support you need to succeed in your urban gardening journey.
                </p>
                <p>
                  As a new company, we're carefully curating our plant selection for their beauty, 
                  ease of care, and ability to thrive in urban environments. We're working to build 
                  partnerships with trusted growers to ensure quality plants reach your doorstep.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/Peace Lily.jpeg"
                alt="Beautiful Peace Lily plant"
                className="rounded-lg shadow-lg w-full h-80 object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">New</div>
                <div className="text-sm">Fresh Start</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
              What We Stand For
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our core values guide everything we do, from selecting plants to supporting our customers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Passionate plant experts dedicated to helping you grow and thrive.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Urban Gardeners</h3>
                <p className="text-muted-foreground">
                  Our team of passionate urban gardeners and plant enthusiasts are here to help you succeed.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Quality Focus</h3>
                <p className="text-muted-foreground">
                  We're committed to providing quality plants and carefully selecting each one for urban environments.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Customer Care</h3>
                <p className="text-muted-foreground">
                  We're committed to your success with ongoing support and care guidance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">
            Ready to Start Your Urban Plant Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join us as we grow together and transform urban spaces with beautiful plants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-primary">
              <Leaf className="mr-2 h-5 w-5" />
              Shop Plants
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
