import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserDropdownProps {
  variant?: 'mobile' | 'desktop';
  className?: string;
}

export function UserDropdown({ variant = 'desktop', className = '' }: UserDropdownProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    setIsOpen(false);
    await signOut();
    navigate('/auth');
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const getUserName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';
  };

  if (!user) return null;

  if (variant === 'mobile') {
    return (
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 ${className}`}
        >
          <UserIcon className="w-5 h-5 text-white" />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/30 z-40"
                transition={{ duration: 0.1 }}
              />

              {/* Menu Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-56 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 p-3 z-50"
              >
                {/* User Info */}
                <div className="flex items-center space-x-3 mb-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">
                      {getUserInitials(user.email || '')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{getUserName()}</p>
                    <p className="text-white/60 text-xs">{user.email}</p>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProfileClick}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-all group"
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 opacity-80 group-hover:opacity-100 flex items-center justify-center">
                      <UserIcon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium">Perfil</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/30 transition-all group"
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 opacity-80 group-hover:opacity-100 flex items-center justify-center">
                      <LogOut className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium">Sair</span>
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 ${className}`}
      >
        <UserIcon className="w-5 h-5 text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 z-40"
              transition={{ duration: 0.1 }}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 mt-2 w-64 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 p-4 z-50"
            >
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {getUserInitials(user.email || '')}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{getUserName()}</p>
                  <p className="text-white/60 text-xs">{user.email}</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleProfileClick}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 opacity-80 group-hover:opacity-100 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">Perfil</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/30 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 opacity-80 group-hover:opacity-100 flex items-center justify-center">
                    <LogOut className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">Sair</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 