import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Slider } from '../components/ui/slider';
import { 
  Target, Search, ArrowRight, Loader2, LogOut, User,
  TrendingUp, DollarSign, BarChart3, Filter, ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const KeywordResearch = () => {
  const navigate = useNavigate();
  const { user, logout, getAuthHeaders } = useAuth();
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const [searchParams, setSearchParams] = useState({
    seed_keyword: '',
    location_name: 'United States',
    min_volume: 200,
    max_volume: 1200,
    min_cpc: 10,
    max_cpc: null,
    limit: 50
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchParams.seed_keyword.trim()) {
      toast.error('Please enter a seed keyword');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/keywords/search`,
        searchParams,
        { headers: getAuthHeaders() }
      );
      setKeywords(response.data.keywords || []);
      if (response.data.source === 'mock') {
        toast.info('Using demo data. Configure DataForSEO API for real data.');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = (keyword) => {
    navigate(`/serp/${encodeURIComponent(keyword.keyword)}`);
  };

  const getCompetitionColor = (comp) => {
    if (comp >= 0.7) return 'text-red-400';
    if (comp >= 0.4) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getCPCIndicator = (cpc) => {
    if (cpc >= 50) return { label: 'High-Ticket', color: 'bg-purple-500/20 text-purple-400' };
    if (cpc >= 30) return { label: 'Contractor', color: 'bg-blue-500/20 text-blue-400' };
    if (cpc >= 10) return { label: 'Service', color: 'bg-green-500/20 text-green-400' };
    return { label: 'Low-Ticket', color: 'bg-gray-500/20 text-gray-400' };
  };

  return (
    <div className="min-h-screen bg-background" data-testid="keyword-research">
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
            <Link to="/research" className="text-primary font-medium">
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
            Keyword <span className="text-primary">Research</span>
          </h1>
          <p className="text-muted-foreground mb-6">
            Find money keywords with the right volume, CPC, and competition levels.
          </p>

          <form onSubmit={handleSearch}>
            <Card className="bg-card border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="Enter seed keyword (e.g., plumber phoenix, roofing dallas)"
                        value={searchParams.seed_keyword}
                        onChange={(e) => setSearchParams({ ...searchParams, seed_keyword: e.target.value })}
                        className="h-12 pl-10 bg-black/20 border-border focus:border-primary"
                        data-testid="seed-keyword-input"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="h-12 border-border hover:bg-white/5"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 px-8 bg-primary text-black font-bold hover:bg-primary/90 neon-glow-hover"
                    data-testid="search-btn"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        Search
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid md:grid-cols-3 gap-6 pt-4 border-t border-border/50"
                    >
                      <div className="space-y-4">
                        <Label className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          Search Volume Range
                        </Label>
                        <div className="px-2">
                          <Slider
                            value={[searchParams.min_volume, searchParams.max_volume]}
                            onValueChange={([min, max]) => setSearchParams({ ...searchParams, min_volume: min, max_volume: max })}
                            min={50}
                            max={5000}
                            step={50}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>{searchParams.min_volume}</span>
                            <span>{searchParams.max_volume}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-primary" />
                          Minimum CPC
                        </Label>
                        <div className="px-2">
                          <Slider
                            value={[searchParams.min_cpc]}
                            onValueChange={([val]) => setSearchParams({ ...searchParams, min_cpc: val })}
                            min={1}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>${searchParams.min_cpc}</span>
                            <span>$100+</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-primary" />
                          Results Limit
                        </Label>
                        <div className="px-2">
                          <Slider
                            value={[searchParams.limit]}
                            onValueChange={([val]) => setSearchParams({ ...searchParams, limit: val })}
                            min={10}
                            max={100}
                            step={10}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>{searchParams.limit} keywords</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </form>
        </motion.div>

        {/* Results */}
        {keywords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Found <span className="text-primary">{keywords.length}</span> opportunities
              </h2>
            </div>

            <Card className="bg-card border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="keywords-table">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="text-left p-4 font-medium text-muted-foreground">Keyword</th>
                      <th className="text-center p-4 font-medium text-muted-foreground">Volume</th>
                      <th className="text-center p-4 font-medium text-muted-foreground">CPC</th>
                      <th className="text-center p-4 font-medium text-muted-foreground">Type</th>
                      <th className="text-center p-4 font-medium text-muted-foreground">Competition</th>
                      <th className="text-center p-4 font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.map((kw, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                      >
                        <td className="p-4">
                          <span className="font-mono text-sm">{kw.keyword}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="font-mono text-primary">{kw.search_volume.toLocaleString()}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="font-mono">${kw.cpc.toFixed(2)}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`text-xs px-2 py-1 rounded ${getCPCIndicator(kw.cpc).color}`}>
                            {getCPCIndicator(kw.cpc).label}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`font-mono ${getCompetitionColor(kw.competition)}`}>
                            {Math.round(kw.competition * 100)}%
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAnalyze(kw)}
                            className="border-primary/30 text-primary hover:bg-primary/10"
                            data-testid={`analyze-${i}`}
                          >
                            Analyze SERP
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && keywords.length === 0 && (
          <Card className="bg-card border-border/50">
            <CardContent className="py-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Start your keyword research</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Enter a seed keyword like "plumber phoenix" or "roofing dallas" to find money keywords
                with the right volume and CPC for EMD opportunities.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default KeywordResearch;
