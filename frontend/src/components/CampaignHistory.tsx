import { Clock, X, FileText } from "lucide-react";

export default function CampaignHistory({ history, onClose, onLoad }: any) {
  return (
    <div className="fixed inset-y-0 right-0 w-80 lg:w-96 bg-zinc-950 border-l border-white/10 shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Campaign History
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-lg transition-colors text-zinc-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {history.length === 0 ? (
          <div className="text-center text-zinc-500 mt-10">
            <Clock className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p>No past campaigns found.</p>
          </div>
        ) : (
          history.map((item: any, index: number) => (
            <div 
              key={item.id || index} 
              onClick={() => onLoad(item)}
              className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl cursor-pointer hover:bg-zinc-800 hover:border-white/10 transition-all group"
            >
              <div className="flex items-start gap-3 mb-3">
                <FileText className="w-4 h-4 text-zinc-500 mt-1 group-hover:text-blue-400 transition-colors shrink-0" />
                <p className="text-sm text-zinc-300 line-clamp-2 leading-relaxed">
                  {item.source_material}
                </p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                  {item.tone}
                </span>
                <span className="text-xs text-zinc-600 font-mono">
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Previous'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}