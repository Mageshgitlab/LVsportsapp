import React from 'react';
import { useCarnivalStore } from '../../store/carnivalStore';
import { AdminAuth } from './AdminAuth';
import { AdminLayout } from './AdminLayout';

export const AdminPortal: React.FC = () => {
  const { adminAuthenticated, setAdminAuthenticated } = useCarnivalStore();

  if (!adminAuthenticated) {
    return <AdminAuth onSuccess={() => setAdminAuthenticated(true)} />;
  }

  return <AdminLayout />;
};
