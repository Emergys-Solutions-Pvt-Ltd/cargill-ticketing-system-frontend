import { useEffect, useState } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import App from "./App";
import RequestDetails from "./pages/private/Requests/RequestDetails";
import UserProfile from "./pages/private/Profile/UserProfile";
import UserList from "./pages/private/UAM/User/UserList";
import RequestList from "./pages/private/Requests/RequestList";
import UserDetails from "./pages/private/UAM/User/UserDetails";
import RoleDetails from "./pages/private/UAM/Roles/RoleDetails";
import Login from "./pages/public/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeContextProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { initMockData } from "./utils/rbacData";
import Rbac from "./pages/private/RBAC/Rbac";
import DepartmentDetails from "./pages/private/RBAC/DepartmentDetails/DepartmentDetails";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/requests" replace />,
      },
      {
        path: "requests",
        element: <RequestList />,
      },
      {
        path: "requests/:requestId",
        element: <RequestDetails />,
      },
      {
        path: "profile",
        element: <UserProfile />,
      },
      {
        path: "admin",
        element: <UserList />,
      },
      {
        path: "admin/users/:userId",
        element: <UserDetails />,
      },
      {
        path: "admin/roles/:roleName",
        element: <RoleDetails />,
      },
      {
        path: "uam",
        element: <UserList />,
      },
      {
        path: "uam/users/:userId",
        element: <UserDetails />,
      },
      {
        path: "uam/roles/:roleName",
        element: <RoleDetails />,
      },
      {
        path: "rbac",
        element: <Rbac />,
      },
      {
        path: "rbac/departments/:departmentId",
        element: <DepartmentDetails />,
      },
    ],
  },
]);

function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initMockData().then(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #1B3D41 0%, #0E2325 100%)",
          color: "#ffffff",
          fontFamily: "Outfit, Inter, sans-serif",
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 300, letterSpacing: "-0.5px" }}
        >
          Cargilll
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "rgba(255, 255, 255, 0.6)", fontWeight: 500 }}
        >
          Initializing Enterprise Service Portal...
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeContextProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default Index;
