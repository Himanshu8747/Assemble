import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import Hero from "./components/features/Hero";
import Features from "./components/features/Features";
import { SignInSignUp } from "./components/auth/SignInSignUp";
import CodeEditor from "./components/code-editor/editor";
import { CommunityPage } from "./components/community/ComunityPage";
import { Projects } from "./components/projects/Projects";
import { ProjectDetails } from "./components/projects/ProjectDetails";
import EnhancedLiveChat from "./components/community/EnhancedLiveChat";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/features" element={<Features />} />
          <Route path="/auth" element={<SignInSignUp />} />
          <Route path="/editor" element={<CodeEditor />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/projects" element={<Projects />} />
          <Route 
            path="/chatBoard" 
            element={
              <ProtectedRoute>
                <EnhancedLiveChat currentUser={user!} />
              </ProtectedRoute>
            } 
          />
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;

