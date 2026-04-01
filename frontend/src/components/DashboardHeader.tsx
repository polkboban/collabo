    import { Factory, LogOut } from "lucide-react";

export default function DashboardHeader({ handleSignOut }: { handleSignOut: () => void }) {
  return (
    <header className="mb-8 border-b border-white/10 pb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
           <Factory className="w-6 h-6 text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Collabo</h1>
      </div>
      <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-sm font-medium">
        <LogOut className="w-4 h-4" /> Sign Out
      </button>
    </header>
  );
}