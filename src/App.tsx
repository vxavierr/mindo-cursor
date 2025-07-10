import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import ReviewsPage from './pages/ReviewsPage';
import TrashPage from './pages/TrashPage';
import NotFound from './pages/NotFound';
import AuthPage from './pages/AuthPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Home from "@/pages/Home";
import { LearningCardLayoutProvider } from '@/components/learning/LearningCardLayoutContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
// Componente principal de rotas
function AppContent() {
  return (
    <>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/search" element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        } />
        <Route path="/reviews" element={
          <ProtectedRoute>
            <ReviewsPage />
          </ProtectedRoute>
        } />
        <Route path="/trash" element={
          <ProtectedRoute>
            <TrashPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <LearningCardLayoutProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </LearningCardLayoutProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
