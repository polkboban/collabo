import { FileText, Loader2, Sparkles } from "lucide-react";

export default function CampaignInput({
  sourceMaterial, setSourceMaterial, tone, setTone, isLoading, error, handleStartProduction
}: any) {
  return (
    <div className="bg-zinc-900/50 p-6 rounded-2xl shadow-xl border border-white/5 backdrop-blur-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
        <FileText className="w-5 h-5 text-blue-400" />
        Source Material
      </h2>
      
      <textarea
        className="w-full h-48 p-4 border border-white/10 rounded-xl bg-zinc-950 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none mb-4 transition-all text-zinc-200 placeholder:text-zinc-600 resize-none shadow-inner"
        value={sourceMaterial} onChange={(e) => setSourceMaterial(e.target.value)}
        placeholder="Paste your product notes, transcripts, or features here..."
      />

      <div className="mb-6">
        <label className="block text-sm font-medium text-zinc-400 mb-2">Brand Tone</label>
        <select 
          className="w-full p-3.5 border border-white/10 rounded-xl bg-zinc-950 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all text-zinc-200 shadow-inner appearance-none cursor-pointer"
          value={tone} onChange={(e) => setTone(e.target.value)}
        >
          <option value="Professional & Trustworthy">Professional & Trustworthy</option>
          <option value="Engaging & Punchy">Engaging & Punchy</option>
          <option value="Technical & Authoritative">Technical & Authoritative</option>
          <option value="Casual & Friendly">Casual & Friendly</option>
        </select>
      </div>

      <button
        onClick={handleStartProduction}
        disabled={isLoading || !sourceMaterial}
        className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
      >
        {isLoading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Agents are working...</>
        ) : (
          <><Sparkles className="w-5 h-5" /> Start Production Line</>
        )}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm backdrop-blur-sm">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}