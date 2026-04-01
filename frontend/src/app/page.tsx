"use client";

import { useState, useEffect } from "react";
import { Factory, Play, Loader2, CheckCircle, FileText, LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [sourceMaterial, setSourceMaterial] = useState(
    "We are launching 'CloudBox 2.0'. It's an enterprise storage solution for IT admins. Features: AES-256 encryption, 10TB storage, AI search. It is fast and secure."
  );
  const [tone, setTone] = useState("Engaging & Punchy");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      if (isLoginMode) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Check your email for the confirmation link!");
      }
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setResult(null);
  };

  const handleStartProduction = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/generate-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_material: sourceMaterial, tone: tone }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      const finalMarkdown = data.campaign_markdown;
      
      setResult(finalMarkdown);

      if (user) {
        const { error: dbError } = await supabase.from('campaigns').insert([
          {
            user_id: user.id,
            source_material: sourceMaterial,
            tone: tone,
            campaign_markdown: finalMarkdown
          }
        ]);
        
        if (dbError) {
          console.error("Failed to save campaign to database:", dbError);
        }
      }

    } catch (err: any) {
      setError(err.message || "An error occurred while connecting");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  if (!user) {
    return (
      <div className="min-h-screen flex bg-white">
        <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-center p-16 relative overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/20 blur-3xl rounded-full"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/20 blur-3xl rounded-full"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
                <Factory className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Content Factory</h1>
            </div>
            <h2 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              Scale your marketing <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">with autonomous AI.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed">
              Upload raw notes and let our multi-agent system research, write, and edit your entire multi-channel campaign in seconds.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12">
          <div className="max-w-md w-full">
            <div className="flex justify-center lg:hidden mb-8">
              <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                <Factory className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLoginMode ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-gray-500 mb-8">
              {isLoginMode ? "Enter your details to access your workspace." : "Start generating content in seconds."}
            </p>
            
            <form onSubmit={handleAuth} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input 
                  type="email" 
                  required 
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-gray-900 bg-gray-50/50" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input 
                  type="password" 
                  required 
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-gray-900 bg-gray-50/50" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                />
              </div>
              
              {authError && (
                <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                  ⚠️ {authError}
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={authLoading} 
                className="w-full py-3.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-600/10 flex justify-center items-center disabled:opacity-70"
              >
                {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLoginMode ? "Sign In" : "Create Account")}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                {isLoginMode ? "Don't have an account?" : "Already have an account?"}{" "}
                <button 
                  onClick={() => {
                    setIsLoginMode(!isLoginMode);
                    setAuthError(null);
                  }} 
                  className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <header className="mb-8 border-b pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
             <Factory className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Collabo</h1>
        </div>
        <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-500" />
            Source Material
          </h2>
          
          <textarea
            className="w-full h-48 p-4 border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4 transition-all"
            value={sourceMaterial}
            onChange={(e) => setSourceMaterial(e.target.value)}
            placeholder="Paste your product notes, transcripts, or features here..."
          />

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand Tone</label>
            <select 
              className="w-full p-3.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
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
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-600/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Agents are working...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start Production Line
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">
              ⚠️ {error}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-4 border-b pb-4">The Agent Room</h2>
          
          {!isLoading && !result && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <Factory className="w-16 h-16 mb-4 opacity-20" />
              <p>Upload source material to begin production.</p>
            </div>
          )}

          {isLoading && (
            <div className="flex-1 flex flex-col justify-center space-y-6 px-8">
               <div className="flex items-center gap-4 text-blue-600 bg-blue-50 p-4 rounded-xl">
                 <Loader2 className="w-6 h-6 animate-spin" />
                 <span className="font-medium">Lead Researcher is analyzing facts..</span>
               </div>
               <div className="flex items-center gap-4 text-gray-400 p-4">
                 <Loader2 className="w-6 h-6" />
                 <span>Creative Copywriter is drafting..</span>
               </div>
               <div className="flex items-center gap-4 text-gray-400 p-4">
                 <Loader2 className="w-6 h-6" />
                 <span>Editor-in-Chief is auditing tone..</span>
               </div>
            </div>
          )}

          {result && !isLoading && (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-green-700 font-semibold mb-4 bg-green-50 p-4 rounded-xl border border-green-200">
                <CheckCircle className="w-5 h-5" />
                Campaign Approved and Saved to Database
              </div>
              
              <div className="flex-1 p-5 bg-gray-50 border border-gray-200 rounded-xl overflow-y-auto whitespace-pre-wrap font-mono text-sm h-[400px]">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}