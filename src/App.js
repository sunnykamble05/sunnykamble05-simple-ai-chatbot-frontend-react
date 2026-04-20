import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      {/* You can add more routes here if needed */}
      {/* <Route path="/about" element={<AboutPage />} /> */}
    </Routes>
  );
}

export default App;