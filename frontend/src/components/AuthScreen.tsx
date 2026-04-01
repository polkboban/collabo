import { Factory, Loader2 } from "lucide-react";

export default function AuthScreen({
  email, setEmail, password, setPassword, isLoginMode, setIsLoginMode,
  authLoading, authError, handleAuth
}: any) {
  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100 font-sans">
      <div className="hidden lg:flex w-1/2 bg-zinc-900/50 flex-col justify-center p-16 relative overflow-hidden border-r border-white/5">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/15 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl shadow-lg">
              <Factory className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Content Factory</h1>
          </div>
          <h2 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight text-white">
            Scale your marketing <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">with autonomous AI.</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-md leading-relaxed">
            Upload raw notes and let our multi-agent system research, write, and edit your entire multi-channel campaign in seconds.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 relative">
        <div className="max-w-md w-full relative z-10">
          <div className="flex justify-center lg:hidden mb-8">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl shadow-lg">
              <Factory className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            {isLoginMode ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-zinc-400 mb-8">
            {isLoginMode ? "Enter your details to access your workspace." : "Start generating content in seconds."}
          </p>
          
          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email address</label>
              <input 
                type="email" required 
                className="w-full p-3.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white bg-zinc-900/50 placeholder:text-zinc-600" 
                value={email} onChange={(e) => setEmail(e.target.value)} 
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
              <input 
                type="password" required 
                className="w-full p-3.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white bg-zinc-900/50 placeholder:text-zinc-600" 
                value={password} onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
              />
            </div>
            
            {authError && (
              <div className="p-4 bg-red-500/10 text-red-400 text-sm rounded-xl border border-red-500/20 flex items-center gap-2">
                ⚠️ {authError}
              </div>
            )}
            
            <button 
              type="submit" disabled={authLoading} 
              className="w-full py-3.5 mt-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/20 flex justify-center items-center disabled:opacity-50"
            >
              {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLoginMode ? "Sign In" : "Create Account")}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-400">
              {isLoginMode ? "Don't have an account?" : "Already have an account?"}{" "}
              <button 
                onClick={() => { setIsLoginMode(!isLoginMode); }} 
                className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
              >
                {isLoginMode ? "Sign up for free" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}