import { useState, useRef, useEffect } from "react";
import { Layers, Loader2, Wand2, Feather, AlertCircle, ChevronDown, Check, LayoutGrid, Settings2, Hash, Link as LinkIcon, X } from "lucide-react";
export default function CampaignInput({
  sourceMaterial, setSourceMaterial, tone, setTone, isLoading, error, handleStartProduction
}: any) {
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const availableChannels = ["Blog Post", "Twitter Thread", "Email Teaser", "LinkedIn Post"];
  
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    "Blog Post", "Twitter Thread", "Email Teaser"
  ]);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [creativity, setCreativity] = useState(70);
  const [keywords, setKeywords] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");

  const toggleChannel = (channel: string) => {
    setSelectedChannels((prev) => 
      prev.includes(channel) 
        ? prev.filter((c) => c !== channel) 
        : [...prev, channel] 
    );
  };
  
  const toneOptions = [
    "Professional & Trustworthy",
    "Engaging & Punchy",
    "Technical & Authoritative",
    "Casual & Friendly"
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative bg-zinc-900/40 p-2 sm:p-6 rounded-3xl shadow-2xl border border-white/5 backdrop-blur-xl flex flex-col h-full ring-1 ring-white/10 group">
      <h2 className="text-lg font-medium mb-6 flex items-center gap-3 text-white">
        <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
          <Layers className="w-4 h-4" />
        </div>
        Source Material
      </h2>
      
      <div className="relative mb-6 group/textarea">
        <textarea
          className="w-full h-36 p-4 border border-zinc-800 rounded-2xl bg-zinc-950/50 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-zinc-300 placeholder:text-zinc-600 resize-none shadow-inner custom-scrollbar"
          value={sourceMaterial} onChange={(e) => setSourceMaterial(e.target.value)}
          placeholder="Paste your product notes, transcripts, or raw ideas here..."
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-indigo-500 group-hover/textarea:w-1/2 transition-all duration-500 opacity-0 group-hover/textarea:opacity-100 rounded-full" />
      </div>

      <div className="mb-8" ref={dropdownRef}>
        <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-3">
          <Feather className="w-4 h-4" /> Brand Tone
        </label>
        
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full p-4 border rounded-2xl flex items-center justify-between transition-all duration-300 shadow-inner group
              ${isDropdownOpen ? 'bg-zinc-900 border-indigo-500/50 ring-1 ring-indigo-500/50' : 'bg-zinc-950/50 border-zinc-800 hover:bg-zinc-900 hover:border-white/10'}`}
          >
            <span className={tone ? 'text-zinc-100' : 'text-zinc-500'}>
              {tone || "Select a tone..."}
            </span>
            <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-500 ease-[cubic-bezier(0.87,_0,_0.13,_1)] ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <div 
            className={`absolute z-50 w-full mt-2 p-1.5 bg-zinc-950 border border-white/10 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] origin-top transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
              ${isDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
          >
            {toneOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => { setTone(option); setIsDropdownOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${tone === option ? 'bg-indigo-500/10 text-indigo-300' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'}`}
              >
                {option}
                {tone === option && <Check className="w-4 h-4 animate-in zoom-in" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-3">
          <LayoutGrid className="w-4 h-4" /> Output Channels
        </label>
        <div className="flex flex-wrap gap-3">
          {availableChannels.map((channel) => {
            const isSelected = selectedChannels.includes(channel);
            return (
              <button
                key={channel}
                type="button"
                onClick={() => toggleChannel(channel)}
                className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 flex items-center gap-2 
                  ${isSelected ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300 shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]' : 'bg-zinc-950/50 border-zinc-800 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 hover:border-white/10'}`}
              >
                <div className={`flex items-center justify-center w-4 h-4 rounded-md transition-all duration-300 ${isSelected ? 'bg-indigo-500 text-white' : 'border border-zinc-700'}`}>
                  {isSelected && <Check className="w-3 h-3 animate-in zoom-in" />}
                </div>
                {channel}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-8">
        <button
          type="button"
          onClick={() => setShowAdvanced(true)}
          className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <Settings2 className="w-4 h-4" />
          Configure Advanced Settings
        </button>

        {showAdvanced && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
              onClick={() => setShowAdvanced(false)} 
            />
            
            <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-indigo-400" /> 
                  Advanced Settings
                </h3>
                <button 
                  type="button" 
                  onClick={() => setShowAdvanced(false)}
                  className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors border border-white/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-zinc-400 mb-3">
                    <span>Model Creativity</span>
                    <span className="text-indigo-400 font-mono">{creativity}%</span>
                  </label>
                  <input
                    type="range" min="0" max="100" value={creativity}
                    onChange={(e) => setCreativity(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                  />
                  <div className="flex justify-between text-xs text-zinc-600 mt-2 font-medium">
                    <span>Strict & Factual</span>
                    <span>Highly Creative</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                    <Hash className="w-4 h-4" /> Target Keywords
                  </label>
                  <input
                    type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)}
                    placeholder="zero-trust, scalable, next-gen..."
                    className="w-full p-3 border border-zinc-800 rounded-xl bg-zinc-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-zinc-300 placeholder:text-zinc-600 text-sm shadow-inner"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                    <LinkIcon className="w-4 h-4" /> Call to Action URL
                  </label>
                  <input
                    type="url" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)}
                    placeholder="https://your-site.com"
                    className="w-full p-3 border border-zinc-800 rounded-xl bg-zinc-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-zinc-300 placeholder:text-zinc-600 text-sm shadow-inner"
                  />
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setShowAdvanced(false)}
                className="w-full mt-8 py-3 bg-zinc-100 hover:bg-white text-zinc-900 font-bold rounded-xl transition-colors shadow-lg"
              >
                Apply Settings
              </button>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={() => handleStartProduction(selectedChannels, { creativity, keywords, ctaUrl })}
        disabled={isLoading || !sourceMaterial || selectedChannels.length === 0}
        className="relative w-full py-4 px-4 bg-zinc-100 text-zinc-900 font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.4)]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 opacity-0 transition-opacity duration-500 hover:opacity-10" />
        
        {isLoading ? (
          <><Loader2 className="w-5 h-5 animate-spin text-indigo-600" /> <span className="animate-pulse">Orchestrating Agents...</span></>
        ) : (
          <><Wand2 className="w-5 h-5 text-indigo-600" /> Start Production Line</>
        )}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl text-sm backdrop-blur-sm flex items-start gap-2 animate-in fade-in slide-in-from-bottom-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-indigo-500 group-hover:w-1/2 transition-all duration-500 opacity-0 group-hover:opacity-100 rounded-full" />
    </div>
  );
}