import { Box, Card } from "@mui/material";
import "./App.css";
import LabelStepper from "./components/LabelStepper";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <Navbar />
        <Box sx={{ width: "100%" }}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
}


export default App;
