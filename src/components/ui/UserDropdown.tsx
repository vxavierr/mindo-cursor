import React from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserDropdownProps {
  variant?: 'mobile' | 'desktop';
  className?: string;
}

export function UserDropdown({ variant = 'desktop', className = '' }: UserDropdownProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={`p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 ${className}`}>
            <UserIcon className="w-5 h-5 text-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-black/80 backdrop-blur-xl border border-white/20" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-white">
                {getUserName()}
              </p>
              <p className="text-xs leading-none text-white/60">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/20" />
          <DropdownMenuItem onClick={() => navigate('/profile')} className="text-white/80 hover:text-white hover:bg-white/10">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/20" />
          <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/20">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 ${className}`}>
          <UserIcon className="w-5 h-5 text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-black/80 backdrop-blur-xl border border-white/20" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">
              {getUserName()}
            </p>
            <p className="text-xs leading-none text-white/60">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/20" />
        <DropdownMenuItem onClick={() => navigate('/profile')} className="text-white/80 hover:text-white hover:bg-white/10">
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/20" />
        <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/20">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 