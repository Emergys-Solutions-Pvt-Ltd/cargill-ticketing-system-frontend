import { Box } from "@mui/material";
import "./App.css";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          backgroundColor: "background.default",
          overflow: "hidden",
        }}
      >
        <Navbar />
        <Box
          sx={{
            flex: 1,
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </>
  );
}

export default App;
