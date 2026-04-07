import { History, X, Clock, ChevronRight } from "lucide-react";

export default function CampaignHistory({ history, onClose, onLoad }: any) {
  return (
    <div className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-zinc-950 border-l border-white/5 z-50 shadow-[-30px_0_60px_-15px_rgba(0,0,0,0.6)] animate-in slide-in-from-right-full duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col">
      
      <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0 bg-zinc-950/80 backdrop-blur-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <History className="w-5 h-5 text-indigo-400" />
          </div>
          Campaign History
        </h2>
        <button 
          onClick={onClose} 
          className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors border border-white/5 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500">
            <Clock className="w-12 h-12 mb-4 opacity-50" />
            <p>No campaigns generated yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((campaign: any) => (
              <button
                key={campaign.id}
                onClick={() => onLoad(campaign)}
                className="w-full text-left p-4 bg-zinc-900/50 hover:bg-zinc-800/80 border border-white/5 hover:border-white/10 rounded-2xl transition-all group flex items-center justify-between"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm text-white font-medium truncate mb-1">
                    {campaign.source_material}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="bg-zinc-800 px-2 py-0.5 rounded-md">
                      {campaign.tone}
                    </span>
                    <span>
                      {new Date(campaign.created_at).toLocaleDateString(undefined, { 
                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-zinc-950 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-white/5">
                  <ChevronRight className="w-4 h-4 text-indigo-400" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}