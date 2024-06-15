import "@mantine/core/styles.css";
import '@mantine/dates/styles.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Clients from "./routes/Clients"
import Layout from "./routes/Layout";
import NoMatch from "./routes/NoMatch";
import Reports from "./routes/Reports";
import Movies from "./routes/Movies";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/users" element={<Clients />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
