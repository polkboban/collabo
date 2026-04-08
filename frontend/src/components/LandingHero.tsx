"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles, Cpu, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingHero() {
  const router = useRouter();
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 sm:px-6 lg:px-8">
      
      {/* Background Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Dynamic Glowing Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/30 blur-[120px] rounded-full pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" 
      />

      <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-32 left-[15%] p-4 bg-zinc-900/50 border border-indigo-500/30 rounded-2xl backdrop-blur-md shadow-[0_0_30px_rgba(99,102,241,0.15)] hidden md:block">
        <Cpu className="w-6 h-6 text-indigo-400" />
      </motion.div>
      <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute bottom-40 right-[15%] p-4 bg-zinc-900/50 border border-purple-500/30 rounded-2xl backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.15)] hidden md:block">
        <Wand2 className="w-6 h-6 text-purple-400" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-12 flex flex-col items-center gap-2 text-indigo-400/70 text-xs uppercase tracking-widest font-bold"
      >
        <ArrowDown className="w-4 h-4 animate-bounce" />
        <span>Initialize Swarm</span>
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto text-center mt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>The Next Generation of Content Production</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8 leading-[1.1]"
        >
          Tools promised efficiency. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
            Collabo delivers autonomy.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light"
        >
          Stop chasing threads and doing digital paper-pushing. Collabo turns your raw ideas into a multi-channel production line in seconds.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-16 z-10"
      >
        <button 
          onClick={() => router.push('/dashboard')} 
          className="group relative px-8 py-4 bg-zinc-100 text-zinc-950 rounded-full font-bold text-lg tracking-wide hover:scale-105 transition-all duration-300 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(99,102,241,0.4)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 opacity-0 transition-opacity duration-500 group-hover:opacity-20" />
          Start Production
        </button>
      </motion.div>
      
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-zinc-950 to-transparent z-20 pointer-events-none" />
    </div>
  );
}