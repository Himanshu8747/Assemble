import { MainLayout } from "@/layouts/MainLayout";
import Hero from "./components/features/Hero";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Features from "./components/features/Features";
import { SignInSignUp } from "./components/auth/SignInSignUp";
import CodeEditor from "./components/code-editor/editor";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Hero/>} />
          <Route path="/features" element={<Features/>} />
          <Route path="/auth" element={<SignInSignUp/>} />
          <Route path="/editor" element={<CodeEditor/>} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
