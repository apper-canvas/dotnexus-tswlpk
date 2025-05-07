import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  // Icon components
  const HomeIcon = getIcon('Home');
  const FrownIcon = getIcon('Frown');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4"
    >
      <div className="mb-8">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 0.5,
            type: "spring",
            stiffness: 200
          }}
          className="w-24 h-24 mx-auto rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-primary-light dark:text-primary"
        >
          <FrownIcon size={48} />
        </motion.div>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold mb-4">Page Not Found</h1>
      
      <p className="text-xl md:text-2xl text-surface-600 dark:text-surface-300 mb-8 max-w-md">
        Oops! Looks like the dots didn't connect to this page.
      </p>
      
      <Link to="/">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary flex items-center gap-2"
        >
          <HomeIcon size={20} />
          Return Home
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default NotFound;