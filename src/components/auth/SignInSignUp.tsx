import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { signUp, login, googleSignIn } from '../../store/authSlice';
import { AppDispatch, RootState } from '../../store/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GithubIcon } from 'lucide-react';

export function SignInSignUp() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await dispatch(login({ email, password })).unwrap();
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords don't match");
        }
        await dispatch(signUp({ email, password })).unwrap();
      }
      navigate('/');
    } catch (err) {
      console.error(isLogin ? 'Login failed:' : 'Sign up failed:', err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await dispatch(googleSignIn()).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Google sign in failed:', err);
    }
  };

  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className="flex items-center justify-center mb-[10%] mt-10">
      <Card className="w-full max-w-md overflow-hidden">
        <CardContent className="p-0">
          <div className="relative w-full h-full">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, x: isLogin ? -100 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 100 : -100 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <h2 className="text-2xl font-bold mb-6 text-center">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
                  </Button>
                </form>
                <div className="mt-4 text-center">
                  <button
                    onClick={toggleForm}
                    className="text-sm text-blue-600 hover:underline focus:outline-none"
                  >
                    {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
                  </button>
                </div>
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <GithubIcon className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                </div>
                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

