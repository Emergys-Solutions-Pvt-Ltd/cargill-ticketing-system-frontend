import { Box, Card } from "@mui/material";
import "./App.css";
import LabelStepper from "./components/LabelStepper";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Box>
        <Navbar />
        <Box sx={{ width: "20%", margin: 3 }}>
          <LabelStepper />
        </Box>
        <Card variant="outlined" sx={{ margin: 3 }}>
          <Outlet />
        </Card>
      </Box>
    </>
  );
}

export default App;
