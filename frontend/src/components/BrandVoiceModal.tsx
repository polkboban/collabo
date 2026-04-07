import { Mic2, X, Info } from "lucide-react";

export default function BrandVoiceModal({ brandVoice, setBrandVoice, onClose }: any) {
  
  const handleSave = () => {
    localStorage.setItem("collabo_brand_voice", JSON.stringify(brandVoice));
    onClose();
  };

  return (
    <div className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-zinc-950 border-l border-white/5 z-50 shadow-[-30px_0_60px_-15px_rgba(0,0,0,0.6)] animate-in slide-in-from-right-full duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col">
      
      {/* Sticky Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0 bg-zinc-950/80 backdrop-blur-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Mic2 className="w-5 h-5 text-indigo-400" />
          </div>
          Global Brand Voice
        </h2>
        <button 
          onClick={onClose} 
          className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors border border-white/5 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-sm text-indigo-200/80 leading-relaxed">
            These rules act as global guardrails for the AI. They will be applied to every single campaign you generate.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Company/Product Name</label>
            <input
              type="text"
              value={brandVoice.company_name}
              onChange={(e) => setBrandVoice({ ...brandVoice, company_name: e.target.value })}
              className="w-full p-3 border border-zinc-800 rounded-xl bg-zinc-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-zinc-300 placeholder:text-zinc-600 shadow-inner"
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Target Audience</label>
            <input
              type="text"
              value={brandVoice.target_audience}
              onChange={(e) => setBrandVoice({ ...brandVoice, target_audience: e.target.value })}
              className="w-full p-3 border border-zinc-800 rounded-xl bg-zinc-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-zinc-300 placeholder:text-zinc-600 shadow-inner"
              placeholder="e.g. Enterprise IT Managers"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Mandatory Rules & Terminology</label>
            <textarea
              value={brandVoice.custom_rules}
              onChange={(e) => setBrandVoice({ ...brandVoice, custom_rules: e.target.value })}
              className="w-full h-40 p-4 border border-zinc-800 rounded-xl bg-zinc-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all text-zinc-300 placeholder:text-zinc-600 resize-none shadow-inner custom-scrollbar"
              placeholder="e.g. Never use the word 'cheap'. Always capitalize 'CloudBox'."
            />
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="p-6 border-t border-white/5 bg-zinc-950 shrink-0">
        <button
          onClick={handleSave}
          className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]"
        >
          Save Global Configuration
        </button>
      </div>
    </div>
  );
}