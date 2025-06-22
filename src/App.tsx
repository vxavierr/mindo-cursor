
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import CleanHome from './pages/CleanHome';
import Dashboard from './components/Dashboard';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import ReviewsPage from './pages/ReviewsPage';
import NotFound from './pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import EnhancedHome from "@/pages/EnhancedHome";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<EnhancedHome />} />
            <Route path="/clean" element={<CleanHome />} />
            <Route path="/original" element={<Index />} />
            <Route path="/dashboard" element={
              <Dashboard 
                user={{ name: 'Usuário' }}
                onLogout={() => console.log('Logout')}
                toggleTheme={() => console.log('Toggle theme')}
                darkMode={false}
              />
            } />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
