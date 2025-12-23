import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import KillScoreGauge from '../components/KillScoreGauge';
import { 
  Target, Search, Loader2, LogOut, User, ExternalLink,
  Shield, AlertTriangle, CheckCircle, Bookmark, Sparkles, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const SERPAnalysis = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const { user, logout, getAuthHeaders } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [keyword, setKeyword] = useState(urlKeyword ? decodeURIComponent(urlKeyword) : '');
  const [serpData, setSerpData] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  useEffect(() => {
    if (urlKeyword) {
      handleAnalyze();
    }
  }, [urlKeyword]);

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    if (!keyword.trim()) {
      toast.error('Please enter a keyword');
      return;
    }

    setLoading(true);
    setAiAnalysis(null);
    try {
      const response = await axios.post(
        `${API_URL}/api/serp/analyze`,
        { keyword, location_name: 'United States' },
        { headers: getAuthHeaders() }
      );
      setSerpData(response.data);
      if (response.data.source === 'mock') {
        toast.info('Using demo data. Configure DataForSEO API for real SERP data.');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAIAnalysis = async () => {
    if (!serpData) return;
    
    setAiLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/ai/analyze`,
        {
          keyword,
          serp_data: serpData.results,
          keyword_data: { keyword, search_volume: 500, cpc: 25, competition: 0.5 }
        },
        { headers: getAuthHeaders() }
      );
      setAiAnalysis(response.data.analysis);
      if (response.data.source === 'error') {
        toast.error('AI analysis failed. Please try again.');
      }
    } catch (error) {
      toast.error('AI analysis failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveOpportunity = async () => {
    if (!serpData) return;
    
    setSaving(true);
    try {
      await axios.post(
        `${API_URL}/api/opportunities`,
        {
          keyword,
          location: 'United States',
          search_volume: 500,
          cpc: 25,
          competition: 0.5,
          kill_score: serpData.kill_score,
          serp_results: serpData.results,
          ai_analysis: aiAnalysis
        },
        { headers: getAuthHeaders() }
      );
      toast.success('Opportunity saved!');
    } catch (error) {
      toast.error('Failed to save opportunity');
    } finally {
      setSaving(false);
    }
  };

  const getResultIcon = (result) => {
    if (result.is_directory) {
      return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    }
    if (result.is_replaceable) {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
    return <Shield className="w-4 h-4 text-red-400" />;
  };

  const getResultBadge = (result) => {
    if (result.is_directory) {
      return <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">Directory</span>;
    }
    if (result.is_replaceable) {
      return <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">Replaceable</span>;
    }
    return <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">Strong</span>;
  };

  return (
    <div className="min-h-screen bg-background" data-testid="serp-analysis">
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
            <Link to="/serp" className="text-primary font-medium">
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
              onClick={() => { logout(); navigate('/'); }}
              className="text-muted-foreground hover:text-white"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            SERP <span className="text-primary">Analysis</span>
          </h1>
          <p className="text-muted-foreground mb-6">
            Analyze page one to find replaceable results and calculate the Kill Score.
          </p>

          <form onSubmit={handleAnalyze}>
            <Card className="bg-card border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="Enter keyword to analyze (e.g., plumber phoenix)"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="h-12 pl-10 bg-black/20 border-border focus:border-primary"
                        data-testid="serp-keyword-input"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 px-8 bg-primary text-black font-bold hover:bg-primary/90 neon-glow-hover"
                    data-testid="analyze-serp-btn"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze SERP
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {serpData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-3 gap-6"
            >
              {/* Kill Score Card */}
              <div className="lg:col-span-1">
                <Card className="bg-card border-border/50 sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg">Kill Score</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <KillScoreGauge score={serpData.kill_score} />
                    
                    <div className="mt-6 space-y-3">
                      <Button
                        onClick={handleAIAnalysis}
                        disabled={aiLoading}
                        variant="outline"
                        className="w-full border-secondary/30 text-secondary hover:bg-secondary/10"
                        data-testid="ai-analysis-btn"
                      >
                        {aiLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Get AI Analysis
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={handleSaveOpportunity}
                        disabled={saving}
                        className="w-full bg-primary text-black font-bold hover:bg-primary/90"
                        data-testid="save-opportunity-btn"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-4 h-4 mr-2" />
                            Save Opportunity
                          </>
                        )}
                      </Button>
                    </div>

                    {/* AI Analysis */}
                    {aiAnalysis && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 rounded-lg bg-secondary/10 border border-secondary/20 text-left"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-secondary" />
                          <span className="text-sm font-medium text-secondary">AI Analysis</span>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {aiAnalysis}
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* SERP Results */}
              <div className="lg:col-span-2">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>Page One Results</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {serpData.results.filter(r => r.is_replaceable).length} / {serpData.results.length} replaceable
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {serpData.results.map((result, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`p-4 rounded-lg border transition-all ${
                          result.is_replaceable 
                            ? 'border-green-500/30 bg-green-500/5' 
                            : result.is_directory
                            ? 'border-yellow-500/30 bg-yellow-500/5'
                            : 'border-border/50 bg-card'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded bg-muted/50 font-mono text-sm font-bold">
                            {result.rank}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {getResultIcon(result)}
                              <span className="font-mono text-sm text-primary truncate">
                                {result.domain}
                              </span>
                              {getResultBadge(result)}
                            </div>
                            <h4 className="text-sm font-medium mb-1 line-clamp-1">{result.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">{result.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>DA: <span className="font-mono text-foreground">{result.domain_rank || 'N/A'}</span></span>
                              <span>Links: <span className="font-mono text-foreground">{result.backlinks?.toLocaleString() || 'N/A'}</span></span>
                              <a 
                                href={result.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                Visit <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && !serpData && (
          <Card className="bg-card border-border/50">
            <CardContent className="py-12 text-center">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Enter a keyword to analyze</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We'll analyze the top 10 results and calculate a Kill Score showing how 
                replaceable the current rankings are with an EMD.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default SERPAnalysis;
