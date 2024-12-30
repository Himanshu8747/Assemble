import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import Hero from "./components/features/Hero";
import Features from "./components/features/Features";
import { SignInSignUp } from "./components/auth/SignInSignUp";
import CodeEditor from "./components/code-editor/editor";
import { CommunityPage } from "./components/community/ComunityPage";
import { Projects } from "./components/projects/Projects";
import { ProjectDetails } from "./components/projects/ProjectDetails";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import LiveChat from "./components/chat/LiveChat";

function App() {
  const user = useSelector((state: RootState) => state.users.currentUser);

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Hero />} />
          <Route path="/features" element={<Features />} />
          <Route path="/auth" element={<SignInSignUp />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectDetails />} />

          <Route
            path="/editor"
            element={
              <ProtectedRoute isAuthenticated={!!user}>
                <CodeEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chatBoard"
            element={
              <ProtectedRoute isAuthenticated={!!user}>
                <LiveChat currentUser={user!} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
