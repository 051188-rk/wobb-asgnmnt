import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SearchPage } from "@/pages/SearchPage";
import { ProfileDetailPage } from "@/pages/ProfileDetailPage";
import loaderGif from "@/assets/loader.gif";

function App() {
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, []);

  if (appLoading) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-black flex flex-col items-center justify-center z-50 select-none">
        <img
          src={loaderGif}
          alt="VibeCheck Loading..."
          className="w-64 h-64 object-contain"
        />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/profile/:username" element={<ProfileDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
