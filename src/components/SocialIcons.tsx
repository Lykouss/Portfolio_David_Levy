// src/components/SocialIcons.tsx

"use client";
import { motion } from 'framer-motion';

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.016-.66.59-1.18 1.22-1.18.634 0 1.205.52 1.22 1.18 0 .652-.586 1.18-1.22 1.18-.634 0-1.205-.52-1.22-1.18zM13.39 14.339V9.44c0-1.42-.3-2.52-1.87-2.52-.91 0-1.39.49-1.62.95h-.02v-.81H7.88v7.225h2.446v-3.57c0-.9.18-1.77 1.29-1.77 1.09 0 1.12 1.04 1.12 1.84v3.5h2.446z"/></svg>
);

export default function SocialIcons() {
  return (
    <div className="flex justify-center space-x-6 mt-8">
      <motion.a
        href="http://github.com/Lykouss" target="_blank" rel="noopener noreferrer"
        whileHover={{ y: -4, scale: 1.1 }}
        className="text-text-muted hover:text-accent transition-colors"
      >
        <GitHubIcon />
      </motion.a>
      <motion.a
        href="http://linkedin.com/in/david-levy-790030349" target="_blank" rel="noopener noreferrer"
        whileHover={{ y: -4, scale: 1.1 }}
        className="text-text-muted hover:text-accent transition-colors"
      >
        <LinkedInIcon />
      </motion.a>
    </div>
  );
}