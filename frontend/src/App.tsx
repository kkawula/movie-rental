import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./routes/Home";
import Clients from "./routes/Clients";
import Layout from "./routes/Layout";
import NoMatch from "./routes/NoMatch";
import Reports from "./routes/Reports";
import Movies from "./routes/Movies";
import Rentals from "./routes/Rentals";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/reports" />} />
          <Route path="/users" element={<Clients />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
