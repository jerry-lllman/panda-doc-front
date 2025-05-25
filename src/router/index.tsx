import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/Layout';
import NotFoundPage from '../pages/NotFoundPage';
import DocumentPage from '@/pages/DocumentPage';

// Define the router with all routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: ':id',
        element: <DocumentPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  }
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
} 