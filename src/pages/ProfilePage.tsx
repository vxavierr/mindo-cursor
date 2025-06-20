
import React from 'react';
import NavigationLayout from '@/components/layout/NavigationLayout';

const ProfilePage = () => {
  return (
    <NavigationLayout activeNavItem="profile">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-3">
            Seu Perfil
          </h2>
          <p className="text-gray-500 mb-12 font-light">
            Gerencie suas configurações e dados
          </p>
          <div className="bg-white rounded-3xl p-8" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)' }}>
            <p className="text-gray-400">Funcionalidade em desenvolvimento...</p>
          </div>
        </div>
      </div>
    </NavigationLayout>
  );
};

export default ProfilePage;
