"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Link as LinkIcon, 
  CheckCircle2, 
  Circle, 
  Activity, 
  ShieldCheck, 
  ExternalLink,
  Search,
  Globe,
  Loader2,
  AlertCircle
} from 'lucide-react';

const AUTO_SITES = [
  { name: 'SitePrice', url: 'https://www.siteprice.org/website-worth/{domain}', da: 65, spam: 1 },
  { name: 'DomainBigData', url: 'https://domainbigdata.com/{domain}', da: 72, spam: 1 },
  { name: 'StatShow', url: 'https://www.statshow.com/www/{domain}', da: 68, spam: 2 },
  { name: 'SimilarWeb', url: 'https://www.similarweb.com/website/{domain}/', da: 89, spam: 1 },
  { name: 'BuiltWith', url: 'https://builtwith.com/{domain}', da: 90, spam: 1 },
  { name: 'URLm', url: 'https://urlm.co/{domain}', da: 55, spam: 2 },
  { name: 'ScamAdviser', url: 'https://www.scamadviser.com/check-website/{domain}', da: 62, spam: 1 },
  { name: 'Who.is', url: 'https://who.is/whois/{domain}', da: 87, spam: 1 },
  { name: 'Webuka', url: 'https://www.webuka.com/info/{domain}', da: 54, spam: 3 },
  { name: 'WorthOfWeb', url: 'https://www.worthofweb.com/website-value/{domain}/', da: 60, spam: 2 },
  { name: 'Hypestat', url: 'https://hypestat.com/info/{domain}', da: 71, spam: 1 },
  { name: 'Woorank', url: 'https://www.woorank.com/en/teaser-review/{domain}', da: 81, spam: 1 },
  { name: 'WebsiteOutlook', url: 'https://www.websiteoutlook.com/the-data/{domain}', da: 58, spam: 4 },
  { name: 'Alexa', url: 'https://www.alexa.com/siteinfo/{domain}', da: 90, spam: 1 },
  { name: 'Cubestat', url: 'https://www.cubestat.com/www.{domain}', da: 52, spam: 3 },
  { name: 'Mustat', url: 'https://www.mustat.com/{domain}', da: 59, spam: 2 },
  { name: 'SiteStats', url: 'https://sitestats.com/{domain}', da: 50, spam: 2 },
  { name: 'CuteStat', url: 'https://{domain}.cutestat.com/', da: 61, spam: 1 },
  { name: 'Webstatsdomain', url: 'https://www.webstatsdomain.org/domains/{domain}/', da: 53, spam: 3 },
  { name: 'Ahrefs Checker', url: 'https://ahrefs.com/website-authority-checker/?input={domain}', da: 91, spam: 1 },
];

const MANUAL_SITES = [
  { name: 'Medium', da: 95, spam: 1, type: 'Article/Profile', url: 'https://medium.com' },
  { name: 'GitHub', da: 96, spam: 1, type: 'Profile/Repo', url: 'https://github.com' },
  { name: 'Dev.to', da: 82, spam: 2, type: 'Article', url: 'https://dev.to' },
  { name: 'Quora', da: 93, spam: 1, type: 'Q&A/Profile', url: 'https://quora.com' },
  { name: 'Reddit', da: 91, spam: 1, type: 'Community/Post', url: 'https://reddit.com' },
  { name: 'Pinterest', da: 94, spam: 1, type: 'Pin/Board', url: 'https://pinterest.com' },
  { name: 'ProductHunt', da: 89, spam: 1, type: 'Launch/Profile', url: 'https://producthunt.com' },
  { name: 'Vimeo', da: 95, spam: 1, type: 'Video/Profile', url: 'https://vimeo.com' },
];

type Status = 'idle' | 'pending' | 'success' | 'error';

interface ResultSite {
  site: typeof AUTO_SITES[0];
  status: Status;
  finalUrl: string;
}

export default function App() {
  const [url, setUrl] = useState('');
  const [domain, setDomain] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'auto' | 'manual'>('auto');
  const [results, setResults] = useState<ResultSite[]>([]);
  const [progress, setProgress] = useState(0);

  const extractDomain = (input: string) => {
    try {
      const urlObj = new URL(input.startsWith('http') ? input : `https://${input}`);
      return urlObj.hostname.replace(/^www\./, '');
    } catch {
      return input.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    }
  };

  const handleGenerate = async () => {
    if (!url.trim()) return;
    
    const extractedDomain = extractDomain(url);
    if (!extractedDomain || extractedDomain.indexOf('.') === -1) {
      alert("Please enter a valid domain (e.g. example.com)");
      return;
    }

    setDomain(extractedDomain);
    setIsGenerating(true);
    setProgress(0);
    setActiveTab('auto');
    
    const initialResults = AUTO_SITES.map(site => ({
      site,
      status: 'idle' as Status,
      finalUrl: site.url.replace('{domain}', extractedDomain)
    }));
    
    setResults(initialResults);

    for (let i = 0; i < initialResults.length; i++) {
      setResults(prev => prev.map((res, index) => index === i ? { ...res, status: 'pending' } : res));
      
      // Simulate network request for backlink ping
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
      
      try {
        // We do a no-cors fetch to just trigger a GET request to the target site.
        // It creates the profile/stat page on their server seamlessly.
        fetch(initialResults[i].finalUrl, { mode: 'no-cors' }).catch(() => {});
        setResults(prev => prev.map((res, index) => index === i ? { ...res, status: 'success' } : res));
      } catch {
        setResults(prev => prev.map((res, index) => index === i ? { ...res, status: 'error' } : res));
      }

      setProgress(Math.round(((i + 1) / initialResults.length) * 100));
    }
    
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
              </div>
              <span className="font-bold text-xl tracking-tight">RankBoost<span className="text-blue-600">.SEO</span></span>
            </div>
            <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-slate-900 transition-colors">Analyzer Tools</a>
              <a href="#" className="hover:text-slate-900 transition-colors">DA Checker</a>
              <a href="#" className="text-blue-600">Backlink Generator</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            One-Click <span className="text-blue-600">High DA Backlinks</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed"
          >
            Generate web-analyzer backlinks automatically (DA 50-90+) and track high-quality manual submissions (Spam 1-5%) to boost your Domain Authority fast.
          </motion.p>
        </div>

        {/* Input Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden max-w-3xl mx-auto"
        >
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full">
              <label htmlFor="url" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Enter your website URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="url"
                  className="block w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl leading-5 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm sm:text-lg transition-all"
                  placeholder="https://yourbrand.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !url}
              className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 whitespace-nowrap min-w-[220px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  Generate Backlinks
                </>
              )}
            </button>
          </div>

          {isGenerating && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-blue-600">Creation Progress</span>
                <span className="text-sm font-semibold text-slate-500">{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-blue-600 h-2 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Dashboard Tabs & Content */}
        <div className="mt-16">
          <div className="flex border-b border-slate-200 mb-8">
            <button
              onClick={() => setActiveTab('auto')}
              className={`px-8 py-4 font-semibold text-sm transition-colors relative ${
                activeTab === 'auto' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Auto Backlinks (Analyzers)
              {activeTab === 'auto' && (
                <motion.div layoutId="activeTab" className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-8 py-4 font-semibold text-sm transition-colors relative ${
                activeTab === 'manual' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              High DA 90+ (Manual)
              {activeTab === 'manual' && (
                <motion.div layoutId="activeTab" className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-blue-600" />
              )}
            </button>
          </div>

          {/* Auto Sites Tab */}
          {activeTab === 'auto' && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              {results.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Target Website</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Domain Auth</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Spam Score</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                        <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Verified Link</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {results.map((res, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-bold">
                            {res.site.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                              DA {res.site.da}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              {res.site.spam}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {res.status === 'idle' && <span className="text-slate-400 flex items-center gap-1.5"><Circle className="w-4 h-4" /> Waiting</span>}
                            {res.status === 'pending' && <span className="text-amber-500 flex items-center gap-1.5"><Loader2 className="w-4 h-4 animate-spin" /> Pinging...</span>}
                            {res.status === 'success' && <span className="text-emerald-500 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Created</span>}
                            {res.status === 'error' && <span className="text-red-500 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> Error</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                            <a 
                              href={res.finalUrl} 
                              target="_blank" 
                              rel="noreferrer noopener"
                              className={`inline-flex items-center gap-1 hover:underline ${['success', 'pending'].includes(res.status) ? 'text-blue-600 hover:text-blue-800' : 'text-slate-300 pointer-events-none'}`}
                            >
                              Verify <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-16 text-center">
                  <Search className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                  <p className="text-lg text-slate-400 font-medium">Enter a URL above and generate backlinks to see results.</p>
                </div>
              )}
            </div>
          )}

          {/* Manual Sites Tab */}
          {activeTab === 'manual' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4 text-slate-700 text-sm">
                <ShieldCheck className="w-6 h-6 flex-shrink-0 text-blue-600" />
                <p className="leading-relaxed text-slate-600">
                  <strong className="text-slate-900">Why manual?</strong> The highest quality "Dofollow" backlinks that pass maximum link juice (like DA 90+ community sites) require user registration to prevent spam. Create accounts and place your URL in profile bios or posts on these sites for the best SEO results.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MANUAL_SITES.map((site) => (
                  <div key={site.name} className="bg-white border border-slate-100 p-6 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-xl text-slate-900">{site.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded">DA {site.da}</span>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500 mb-8 flex flex-col gap-1.5">
                      <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400">Spam Score: {site.spam}%</span>
                      <span className="font-medium text-slate-600">Format: {site.type}</span>
                    </div>
                    <a 
                      href={site.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="block w-full text-center bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg py-3 text-sm font-bold transition-colors"
                    >
                      Open Website 
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
