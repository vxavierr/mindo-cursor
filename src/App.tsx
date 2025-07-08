import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import Home from "@/pages/Home";
import { LearningCardLayoutProvider } from '@/components/learning/LearningCardLayoutContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <LearningCardLayoutProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LearningCardLayoutProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
