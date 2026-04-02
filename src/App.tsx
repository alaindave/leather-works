import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import LoginPage from "./components/LoginPage";
import { Stack } from "react-bootstrap";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Stack>
        <LoginPage />
        <Footer />
      </Stack>
    </>
  );
}

export default App;
