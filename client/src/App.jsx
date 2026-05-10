import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import QuestionDetails from "./pages/QuestionDetails";
import AskQuestion from "./pages/AskQuestion";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/questions/:id" element={<QuestionDetails />} />
        <Route path="/ask" element={<AskQuestion />} />
      </Routes>
    </BrowserRouter>
  );
}