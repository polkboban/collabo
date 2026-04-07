import { LogOut, CircleGauge, Clock, Settings } from "lucide-react"; 

export default function DashboardHeader({ handleSignOut, onOpenHistory, onOpenBrandVoice }: any) {
  return (
    <header className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500/20 rounded-xl border border-white shadow-inner">
          <CircleGauge className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white">Collabo</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenHistory}
          className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 py-2 px-4 rounded-xl transition-all border border-white/5 shadow-sm"
        >
          <Clock className="w-4 h-4" />
          History
        </button>
        <button 
          onClick={onOpenBrandVoice}
          className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 py-2 px-4 rounded-xl transition-all border border-white/5 shadow-sm"
        >
          <Settings className="w-4 h-4" />
          Brand
        </button>
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 py-2 px-4 rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </header>
  );
}