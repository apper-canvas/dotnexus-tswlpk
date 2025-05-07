import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

const Home = () => {
  // Icon components
  const GameControllerIcon = getIcon('GameController');
  const TrophyIcon = getIcon('Trophy');
  const UsersIcon = getIcon('Users');

  return (
    <div className="space-y-8">
      <section className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Connect the Dots
          </h1>
          <p className="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
            The classic pen-and-paper game reimagined for the digital age. Draw lines, complete squares, and outscore your opponent!
          </p>
        </motion.div>
      </section>

      <MainFeature />

      <section className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-light/20 mb-4">
              <GameControllerIcon className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Strategic Gameplay</h3>
            <p className="text-surface-600 dark:text-surface-400">
              Plan your moves carefully to claim squares while preventing your opponent from scoring.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary-light/20 mb-4">
              <TrophyIcon className="text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Competitive Challenge</h3>
            <p className="text-surface-600 dark:text-surface-400">
              Track scores and compete for the title of DotNexus champion with friends and family.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 mb-4">
              <UsersIcon className="text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Two-Player Fun</h3>
            <p className="text-surface-600 dark:text-surface-400">
              Designed for head-to-head gameplay, take turns making strategic moves against your opponent.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;