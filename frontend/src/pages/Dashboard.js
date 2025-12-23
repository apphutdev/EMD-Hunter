import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Target, Search, TrendingUp, Bookmark, LogOut, 
  ArrowRight, Zap, BarChart3, User 
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, getAuthHeaders } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/opportunities`, {
        headers: getAuthHeaders()
      });
      setOpportunities(response.data);
    } catch (error) {
      console.error('Failed to fetch opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getKillScoreColor = (score) => {
    if (score >= 70) return 'kill-score-high';
    if (score >= 40) return 'kill-score-medium';
    return 'kill-score-low';
  };

  const quickActions = [
    { 
      icon: <Search className="w-6 h-6" />, 
      title: "Keyword Research", 
      desc: "Find money keywords with the right volume and CPC",
      href: "/research",
      color: "primary"
    },
    { 
      icon: <BarChart3 className="w-6 h-6" />, 
      title: "SERP Analysis", 
      desc: "Analyze page one for weak competitors",
      href: "/serp",
      color: "secondary"
    },
    { 
      icon: <Bookmark className="w-6 h-6" />, 
      title: "Saved Opportunities", 
      desc: "View your saved EMD opportunities",
      href: "/opportunities",
      color: "accent"
    }
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="dashboard">
      {/* Header */}
      <header className="border-b border-border/50 bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-md bg-primary/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">EMD Hunter</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/research" className="text-muted-foreground hover:text-white transition-colors">
              Research
            </Link>
            <Link to="/serp" className="text-muted-foreground hover:text-white transition-colors">
              SERP Analysis
            </Link>
            <Link to="/opportunities" className="text-muted-foreground hover:text-white transition-colors">
              Saved
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              {user?.name}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-white"
              data-testid="logout-btn"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Welcome back, <span className="text-primary">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-muted-foreground">
            Ready to find your next killer EMD opportunity?
          </p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {quickActions.map((action, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card 
                className="bg-card border-border/50 hover:border-primary/30 transition-all cursor-pointer group h-full"
                onClick={() => navigate(action.href)}
                data-testid={`quick-action-${action.title.toLowerCase().replace(' ', '-')}`}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-md bg-${action.color}/10 flex items-center justify-center text-${action.color} mb-4 group-hover:neon-glow transition-all`}>
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{action.desc}</p>
                  <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                    Get started <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Recent Opportunities</h2>
            {opportunities.length > 0 && (
              <Link to="/opportunities" className="text-primary text-sm hover:underline">
                View all
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse-neon w-12 h-12 rounded-full border-2 border-primary"></div>
            </div>
          ) : opportunities.length === 0 ? (
            <Card className="bg-card border-border/50">
              <CardContent className="py-12 text-center">
                <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No opportunities saved yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by researching keywords and analyzing SERPs to find your first killer EMD.
                </p>
                <Button 
                  onClick={() => navigate('/research')}
                  className="bg-primary text-black font-bold hover:bg-primary/90"
                >
                  Start Research
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {opportunities.slice(0, 6).map((opp, i) => (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="bg-card border-border/50 hover:border-primary/30 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-mono text-sm text-primary">{opp.keyword}</h4>
                          <p className="text-xs text-muted-foreground">{opp.location}</p>
                        </div>
                        <div className={`text-2xl font-bold font-mono ${getKillScoreColor(opp.kill_score)}`}>
                          {opp.kill_score}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center p-2 rounded bg-muted/30">
                          <div className="font-mono text-foreground">{opp.search_volume}</div>
                          <div className="text-muted-foreground">Vol</div>
                        </div>
                        <div className="text-center p-2 rounded bg-muted/30">
                          <div className="font-mono text-foreground">${opp.cpc}</div>
                          <div className="text-muted-foreground">CPC</div>
                        </div>
                        <div className="text-center p-2 rounded bg-muted/30">
                          <div className="font-mono text-foreground">{Math.round(opp.competition * 100)}%</div>
                          <div className="text-muted-foreground">Comp</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
