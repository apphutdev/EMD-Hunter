import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Target, LogOut, User, Trash2, ExternalLink, Loader2, Bookmark
} from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const SavedOpportunities = () => {
  const navigate = useNavigate();
  const { user, logout, getAuthHeaders } = useAuth();
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState([]);
  const [deleting, setDeleting] = useState(null);

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
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await axios.delete(`${API_URL}/api/opportunities/${id}`, {
        headers: getAuthHeaders()
      });
      setOpportunities(opportunities.filter(o => o.id !== id));
      toast.success('Opportunity deleted');
    } catch (error) {
      toast.error('Failed to delete opportunity');
    } finally {
      setDeleting(null);
    }
  };

  const getKillScoreColor = (score) => {
    if (score >= 70) return 'kill-score-high';
    if (score >= 40) return 'kill-score-medium';
    return 'kill-score-low';
  };

  const getKillScoreBg = (score) => {
    if (score >= 70) return 'bg-green-500/10 border-green-500/30';
    if (score >= 40) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  return (
    <div className="min-h-screen bg-background" data-testid="saved-opportunities">
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
            <Link to="/opportunities" className="text-primary font-medium">
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
              onClick={() => { logout(); navigate('/'); }}
              className="text-muted-foreground hover:text-white"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Saved <span className="text-primary">Opportunities</span>
          </h1>
          <p className="text-muted-foreground">
            Your saved EMD opportunities with Kill Scores and analysis.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse-neon w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-primary/20"></div>
            </div>
          </div>
        ) : opportunities.length === 0 ? (
          <Card className="bg-card border-border/50">
            <CardContent className="py-12 text-center">
              <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No saved opportunities yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Research keywords and analyze SERPs to find opportunities worth saving.
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {opportunities.map((opp, i) => (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className={`bg-card border transition-all hover:shadow-lg ${getKillScoreBg(opp.kill_score)}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-mono text-lg text-primary mb-1">{opp.keyword}</h3>
                          <p className="text-xs text-muted-foreground">{opp.location}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold font-mono ${getKillScoreColor(opp.kill_score)}`}>
                            {opp.kill_score}
                          </div>
                          <div className="text-xs text-muted-foreground">Kill Score</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-2 rounded bg-muted/30">
                          <div className="font-mono text-sm text-foreground">{opp.search_volume.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Volume</div>
                        </div>
                        <div className="text-center p-2 rounded bg-muted/30">
                          <div className="font-mono text-sm text-foreground">${opp.cpc}</div>
                          <div className="text-xs text-muted-foreground">CPC</div>
                        </div>
                        <div className="text-center p-2 rounded bg-muted/30">
                          <div className="font-mono text-sm text-foreground">{Math.round(opp.competition * 100)}%</div>
                          <div className="text-xs text-muted-foreground">Comp</div>
                        </div>
                      </div>

                      {opp.ai_analysis && (
                        <div className="mb-4 p-3 rounded bg-secondary/10 border border-secondary/20">
                          <p className="text-xs text-muted-foreground line-clamp-3">{opp.ai_analysis}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/serp/${encodeURIComponent(opp.keyword)}`)}
                          className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View SERP
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(opp.id)}
                          disabled={deleting === opp.id}
                          className="border-destructive/30 text-destructive hover:bg-destructive/10"
                        >
                          {deleting === opp.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>

                      <div className="mt-3 text-xs text-muted-foreground">
                        Saved {new Date(opp.created_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedOpportunities;
