import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};