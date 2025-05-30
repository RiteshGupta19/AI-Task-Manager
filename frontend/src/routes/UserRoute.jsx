import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserLayout = lazy(() => import('../layouts/UserLayout'));
const Dashboard = lazy(() => import('../pages/User/UserDashboard'));
const CreateTask = lazy(() => import('../pages/User/CreateTask'));
const EditTask = lazy(() => import('../pages/User/EditTask'));
const ManageTask = lazy(() => import('../pages/User/ManageTask'));

const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/signin" replace />;
};

export const UserRoutes = {
  path: '/user',
  element: <ProtectedLayout />,
  children: [
    {
      element: <UserLayout />, // Layout with Sidebar and Outlet
      children: [
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'create-task', element: <CreateTask /> },
         { path: 'edit-task/:id', element: <EditTask /> },
        { path: 'manage-task', element: <ManageTask /> },
        { path: '', element: <Navigate to="dashboard" replace /> }, 
      ],
    },
  ],
};
