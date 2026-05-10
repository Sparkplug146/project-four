import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import QuestionDetails from "./pages/QuestionDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/questions/:id" element={<QuestionDetails />} />
      </Routes>
    </BrowserRouter>
  );
}