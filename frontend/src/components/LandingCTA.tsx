"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Cpu, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LandingCTA() {
  return (
    <section className="relative w-full bg-zinc-950 overflow-hidden flex flex-col items-center text-center pt-32 pb-12">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_100%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[400px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] bg-purple-600/10 blur-[150px] rounded-t-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl mx-4 group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-[3.2rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
        
        <div className="relative p-10 md:p-20 rounded-[3rem] bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 backdrop-blur-2xl overflow-hidden flex flex-col items-center shadow-2xl">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4" />
            <span>Zero configuration required</span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.1]">
            Ready to do{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
              less?
            </span>
          </h2>
          
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join the elite teams automating their content pipelines with specialized agent swarms. Stop typing, start directing.
          </p>

          <Link href="/dashboard" className="inline-flex group/btn relative items-center gap-3 px-10 py-5 bg-white text-zinc-950 rounded-full font-bold text-lg tracking-wide hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Launch Workspace
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
          </Link>

        </div>
      </motion.div>

      <footer className="w-full max-w-7xl mx-auto mt-32 px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-zinc-500 relative z-10">
        <div className="flex items-center gap-2 font-bold text-zinc-300">
          Collabo
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="https://github.com/polkboban/collabo" className="hover:text-white transition-colors">GitHub</a>
        </div>
        <p>© 2026 Collabo</p>
      </footer>

    </section>
  );
}