import { Settings, X, Save } from "lucide-react";

export default function BrandVoiceModal({ brandVoice, setBrandVoice, onClose }: any) {
  const handleChange = (field: string, value: string) => {
    setBrandVoice((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("collabo_brand_voice", JSON.stringify(brandVoice));
    onClose();
  };

  return (
    <div className="fixed inset-y-0 left-0 w-80 lg:w-96 bg-zinc-950 border-r border-white/10 shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-300">
      <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          Brand Voice
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-lg transition-colors text-zinc-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Company Name</label>
          <input
            type="text"
            className="w-full p-3 border border-white/10 rounded-xl bg-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-zinc-200"
            placeholder="e.g. Acme Corp"
            value={brandVoice.company_name}
            onChange={(e) => handleChange("company_name", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Target Audience</label>
          <textarea
            className="w-full h-24 p-3 border border-white/10 rounded-xl bg-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-zinc-200 resize-none"
            placeholder="e.g. IT Managers at mid-sized tech companies..."
            value={brandVoice.target_audience}
            onChange={(e) => handleChange("target_audience", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Custom AI Rules</label>
          <textarea
            className="w-full h-32 p-3 border border-white/10 rounded-xl bg-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-zinc-200 resize-none"
            placeholder="e.g. Never use emojis. Do not use words like 'revolutionize' or 'synergy'. Always emphasize security."
            value={brandVoice.custom_rules}
            onChange={(e) => handleChange("custom_rules", e.target.value)}
          />
        </div>
      </div>

      <div className="p-6 border-t border-white/10 bg-zinc-950 shrink-0">
        <button onClick={handleSave} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> Save Brand Profile
        </button>
      </div>
    </div>
  );
}