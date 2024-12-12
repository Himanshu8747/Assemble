'use client'
import { MainLayout } from "@/layouts/MainLayout";
import Hero from "./components/features/Hero";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Features from "./components/features/Features";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Hero/>} />
          <Route path="/features" element={<Features/>} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
