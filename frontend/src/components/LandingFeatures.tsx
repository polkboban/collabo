"use client";

import { motion } from "framer-motion";
import { LayoutGrid, SlidersHorizontal, Sparkles, Terminal, FileText, X, Mail } from "lucide-react";

export default function LandingFeatures() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 z-30">
      
      {/* Background glow for the whole section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative text-center mb-24 space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 text-xs font-medium mb-4"
        >
          <Sparkles className="w-3 h-3 text-indigo-400" />
          Powered by Agent Swarms
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight"
        >
          An entire agency, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            boxed into one workflow.
          </span>
        </motion.h2>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[340px]">
        
        {/* CARD 1: Multi-Channel Output (Spans 2 columns) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-2 relative group rounded-[2.5rem] bg-zinc-900/40 border border-white/5 overflow-hidden flex flex-col justify-between p-10 hover:bg-zinc-900/60 transition-all duration-500 ring-1 ring-inset ring-white/5 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Animated Inner Visual: Floating Stack */}
          <div className="relative z-10 h-32 w-full flex items-center justify-center -mt-4 mb-4">
            <div className="relative w-full max-w-sm h-full flex items-center justify-center">
              {/* Blog Post */}
              <motion.div 
                className="absolute w-48 h-16 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center gap-3 px-4 shadow-xl z-30"
                animate={{ y: [0, -8, 0], rotate: [-2, -2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><FileText className="w-4 h-4" /></div>
                <div className="h-2 w-20 bg-zinc-800 rounded-full" />
              </motion.div>
              {/* Twitter Thread */}
              <motion.div 
                className="absolute w-48 h-16 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center gap-3 px-4 shadow-xl z-20"
                animate={{ y: [0, 8, 0], rotate: [4, 4, 4], x: 40 }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="p-2 bg-sky-500/20 rounded-lg text-sky-400"><X className="w-4 h-4" /></div>
                <div className="h-2 w-16 bg-zinc-800 rounded-full" />
              </motion.div>
              {/* Email Teaser */}
              <motion.div 
                className="absolute w-48 h-16 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center gap-3 px-4 shadow-xl z-10"
                animate={{ y: [0, 4, 0], rotate: [-6, -6, -6], x: -40 }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Mail className="w-4 h-4" /></div>
                <div className="h-2 w-24 bg-zinc-800 rounded-full" />
              </motion.div>
            </div>
          </div>

          <div className="relative z-10 mt-auto">
            <div className="flex items-center gap-2 text-indigo-400 font-medium mb-3">
              <LayoutGrid className="w-5 h-5" /> Output Channels
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Simultaneous Generation</h3>
            <p className="text-zinc-400 leading-relaxed max-w-md">Spin up Blog Posts, Twitter Threads, and Email Teasers all at once. The swarm tailors the same core idea to multiple platforms perfectly.</p>
          </div>
        </motion.div>

        {/* CARD 2: Advanced Control */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="relative group rounded-[2.5rem] bg-zinc-900/40 border border-white/5 overflow-hidden flex flex-col justify-between p-10 hover:bg-zinc-900/60 transition-all duration-500 ring-1 ring-inset ring-white/5 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Animated Inner Visual: Glowing Slider */}
          <div className="relative z-10 h-32 flex flex-col justify-center mb-4 group-hover:scale-105 transition-transform duration-500">
             <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl relative">
                <div className="absolute inset-0 bg-purple-500/5 rounded-2xl animate-pulse" />
                <div className="flex items-center justify-between text-xs font-medium text-zinc-500 mb-3 relative z-10">
                  <span>Creativity</span>
                  <span className="text-purple-400 font-mono">70%</span>
                </div>
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden relative z-10 border border-zinc-800">
                  <motion.div 
                    initial={{ width: "0%" }}
                    whileInView={{ width: "70%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_15px_#a855f7]" 
                  />
                </div>
             </div>
          </div>

          <div className="relative z-10 mt-auto">
            <div className="flex items-center gap-2 text-purple-400 font-medium mb-3">
              <SlidersHorizontal className="w-5 h-5" /> Tone Engine
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Precision Control</h3>
            <p className="text-zinc-400 leading-relaxed">Dial in the exact brand voice, strict factual limits, and targeted keywords before the swarm deploys.</p>
          </div>
        </motion.div>

        {/* CARD 3: The Agent Room (Spans all 3 columns) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="md:col-span-3 relative group rounded-[2.5rem] bg-zinc-900/40 border border-white/5 overflow-hidden flex flex-col justify-end p-10 md:p-12 hover:bg-zinc-900/60 transition-all duration-500 ring-1 ring-inset ring-white/5 shadow-2xl min-h-[400px]"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Animated Inner Visual: Agent Room UI Simulation */}
          <div className="absolute top-10 left-10 md:left-[20%] right-10 md:right-10 h-64 bg-zinc-950 border border-zinc-800 rounded-t-2xl p-6 shadow-2xl opacity-80 group-hover:opacity-100 group-hover:translate-y-2 transition-all duration-700">
            {/* Mock Header Tabs */}
            <div className="flex gap-3 border-b border-zinc-800 pb-4 mb-4">
               <div className="px-4 py-1.5 bg-indigo-500 text-white text-xs font-medium rounded-lg shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]">Blog_Post.md</div>
               <div className="px-4 py-1.5 bg-zinc-900 text-zinc-500 border border-zinc-800 text-xs font-medium rounded-lg">Twitter_Thread.md</div>
            </div>
            {/* Simulated Markdown Typing effect */}
            <div className="space-y-3 font-mono text-sm text-zinc-400">
               <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-indigo-400 font-bold"># Understanding Zero-Trust Architecture</motion.div>
               <motion.div initial={{ width: "0%" }} whileInView={{ width: "80%" }} transition={{ duration: 1, delay: 0.8 }} className="h-2 bg-zinc-800 rounded overflow-hidden"><div className="h-full bg-zinc-700 w-full" /></motion.div>
               <motion.div initial={{ width: "0%" }} whileInView={{ width: "60%" }} transition={{ duration: 1, delay: 1 }} className="h-2 bg-zinc-800 rounded overflow-hidden"><div className="h-full bg-zinc-700 w-full" /></motion.div>
               <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.5 }} className="pt-2 text-purple-400">## Core Principles</motion.div>
               <div className="flex items-center gap-2 pt-1">
                 <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.7 }} className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                 <motion.div initial={{ width: "0%" }} whileInView={{ width: "40%" }} transition={{ duration: 0.5, delay: 1.8 }} className="h-2 bg-zinc-800 rounded overflow-hidden"><div className="h-full bg-zinc-700 w-full" /></motion.div>
               </div>
            </div>
            
            {/* Decorative Fade Out */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-zinc-950 to-transparent" />
          </div>

          <div className="relative z-10 mt-auto md:w-1/2">
            <div className="flex items-center gap-2 text-emerald-400 font-medium mb-3">
              <Terminal className="w-5 h-5" /> The Agent Room
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">Distraction-Free Editing</h3>
            <p className="text-zinc-400 leading-relaxed text-lg">Review the swarm's output in a beautiful markdown environment. Regenerate sections on the fly, copy instantly, or export directly to your CMS.</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}