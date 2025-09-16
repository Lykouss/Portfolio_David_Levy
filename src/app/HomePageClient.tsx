// src/app/HomePageClient.tsx
"use client";

import { motion } from 'framer-motion';
import Typewriter from "@/components/Typewriter";
import SocialIcons from "@/components/SocialIcons";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';
import ContactSection from '@/components/ContactSection';

export default function HomePageClient() {
  return (
    // A div container agora não é mais necessária aqui, pois cada seção a gerencia
    <>
      {/* Seção Hero (permanece igual) */}
      <motion.section
        id="home"
        className="min-h-screen flex flex-col items-center justify-center text-center container mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-title text-5xl md:text-7xl font-bold uppercase tracking-wider">
          David Levy
        </h1>
        <div className="mt-4">
          <Typewriter />
        </div>
        <SocialIcons />
      </motion.section>

      <AboutSection />

       <ProjectsSection />

       <SkillsSection />

       <ContactSection />
    </>
  );
}