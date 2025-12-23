import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Target, Zap, TrendingUp, Search, Shield, BarChart3, ArrowRight, Check } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Keyword Discovery",
      description: "Find hidden keyword opportunities with real search volume, CPC, and competition data."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "SERP Analysis",
      description: "Identify weak competitors and directory placeholders on page one of Google."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Kill Score",
      description: "Proprietary scoring system (0-100) that reveals how easy a keyword is to dominate."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI Analysis",
      description: "Claude-powered insights that tell you exactly why an opportunity is worth pursuing."
    }
  ];

  const steps = [
    { num: "01", title: "Enter your niche or location", desc: "Start with a seed keyword like 'plumber phoenix' or 'roofing dallas'" },
    { num: "02", title: "Filter for money keywords", desc: "Automatically filter by volume (200-1200), CPC ($10-$50+), and competition" },
    { num: "03", title: "Analyze SERP weakness", desc: "See which page one results are directories or weak competitors" },
    { num: "04", title: "Get your Kill Score", desc: "Our algorithm tells you exactly how viable each EMD opportunity is" }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1715614176939-f5c46ae99d04?crop=entropy&cs=srgb&fm=jpg&q=85')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
        
        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-md bg-primary/20 flex items-center justify-center neon-glow">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">EMD Hunter</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-white" data-testid="nav-login-btn">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-primary text-black font-bold hover:bg-primary/90 neon-glow-hover" data-testid="nav-signup-btn">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm mb-6">
              <Zap className="w-4 h-4" />
              Find EMD opportunities in seconds, not hours
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-6">
              Hunt <span className="text-primary neon-text">Killer</span> EMD<br />
              Opportunities
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Discover exact match domain opportunities that can actually rank and make money. 
              Even in markets people swear are "too competitive."
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate('/register')}
                className="bg-primary text-black font-bold text-lg px-8 py-6 hover:bg-primary/90 neon-glow-hover transition-all"
                data-testid="hero-cta-btn"
              >
                Start Hunting Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/login')}
                className="border-white/20 text-white hover:bg-white/5 text-lg px-8 py-6"
              >
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 grid grid-cols-3 gap-8 max-w-2xl"
          >
            {[
              { value: "0-100", label: "Kill Score Range" },
              { value: "$10-50+", label: "Target CPC" },
              { value: "200-1200", label: "Ideal Volume" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary font-mono">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              Find the <span className="text-primary">chinks in the armor</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Page one might look strong, but our analysis reveals which results are actually replaceable.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:neon-glow transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              How EMD Hunter Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Four steps to finding your next money-making domain opportunity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-primary/10 font-mono mb-4">{step.num}</div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-8 right-0 w-16 h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-2xl glass gradient-border"
          >
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Ready to find your killer EMD?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Stop guessing. Start finding real opportunities with data-driven analysis.
            </p>
            <Button 
              onClick={() => navigate('/register')}
              className="bg-primary text-black font-bold text-lg px-8 py-6 hover:bg-primary/90 neon-glow-hover"
              data-testid="cta-btn"
            >
              Start Hunting Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <span className="font-semibold">EMD Hunter</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 EMD Hunter. Find your next money-making domain.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
