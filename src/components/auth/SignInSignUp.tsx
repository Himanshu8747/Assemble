import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  login,
  signUp,
  googleSignIn,
  selectCurrentUser,
} from "../../store/userSlice";
import { AppDispatch } from "../../store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export function SignInSignUp() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

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
      navigate("/");
    } catch (err) {
      console.error(isLogin ? "Login failed:" : "Sign up failed:", err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await dispatch(googleSignIn()).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Google sign-in failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md overflow-hidden">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {isLogin ? "Welcome Back!" : "Create an Account"}
          </h2>
          {currentUser && (
            <p className="text-center mb-4">
              Logged in as: {currentUser.name || currentUser.email}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {!isLogin && (
              <div>
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            <Button type="submit" className="w-full">
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>
          <Button className="w-full mt-4" onClick={handleGoogleSignIn}>
            Sign in with Google
          </Button>
          <p
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-center text-blue-600 cursor-pointer mt-4"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
