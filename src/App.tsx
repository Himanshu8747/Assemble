'use client'
import { useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import Hero from "./components/features/Hero";
import CodeEditor from "./components/code-editor/editor";

function App() {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <MainLayout>
      {showEditor ? (
        <CodeEditor />
      ) : (
        <Hero onGetStarted={() => setShowEditor(true)} />
      )}
    </MainLayout>
  );
}

export default App;
