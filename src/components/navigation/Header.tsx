import { Button } from '@/components/ui/button';
import { GithubIcon, MenuIcon, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { logoutUser } from '../../store/authSlice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <MenuIcon className="h-5 w-5" />
          </Button>
          <Link to="/" className="text-xl font-bold">Assemble</Link>
        </div>
        <nav className="hidden md:flex items-center space-x-4">
          {user && <Link to='/editor'>Code Editor</Link>}
          <Link to="/features">Features</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/community">Community</Link>
          <Link to="/chatBoard">Chat</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <a href="https://github.com/Himanshu8747/Assemble" target="_blank" rel="noopener noreferrer">
            <GithubIcon className="h-5 w-5" />
          </a>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <span>Signed in as {user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button>Sign In / Sign Up</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

