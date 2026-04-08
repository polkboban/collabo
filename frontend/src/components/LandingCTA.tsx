"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Cpu } from "lucide-react";
import Link from "next/link";

export default function LandingCTA() {
  return (
    <section className="relative w-full bg-zinc-950 overflow-hidden flex flex-col items-center text-center pt-32 pb-12">
      
      {/* Massive Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-indigo-600/20 blur-[150px] pointer-events-none rounded-t-full" />

      {/* Glassmorphism CTA Card */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-4xl mx-4 p-12 md:p-20 rounded-[3rem] bg-zinc-900/40 border border-white/10 backdrop-blur-2xl ring-1 ring-indigo-500/20 shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

        <div className="flex justify-center mb-6">
          <div className="p-4 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 text-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            <Zap className="w-8 h-8" />
          </div>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
          Ready to do less?
        </h2>
        
        <p className="text-xl text-zinc-400 mb-10 max-w-xl mx-auto">
          Join the elite teams automating their content pipelines with specialized agent swarms.
        </p>

        <Link href="/dashboard" className="inline-flex group relative items-center gap-3 px-10 py-5 bg-indigo-500 text-white rounded-full font-bold text-lg tracking-wide hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)]">
          <span className="relative z-10 flex items-center gap-2">
            Launch Workspace
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
      </motion.div>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto mt-32 px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500 relative z-10">
        <div className="flex items-center gap-2 font-bold text-zinc-300">
          <Cpu className="w-5 h-5 text-indigo-500" /> Collabo
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Twitter</a>
        </div>
        <p>© 2026 Collabo Labs. Swarm active.</p>
      </footer>

    </section>
  );
}