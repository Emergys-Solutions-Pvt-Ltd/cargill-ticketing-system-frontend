import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import MyRequest from "./pages/MyRequest";
import Profile from "./components/myProfile/Profile";
import AdminRBAC from "./pages/AdminRBAC";
import RequestList from "./pages/RequestList";
import UserDetails from "./pages/UserDetails";
import RoleDetails from "./pages/RoleDetails";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeContextProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

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
        path: "",
        element: <MyRequest />,
      },
      {
        path: "requests",
        element: <RequestList />,
      },
      {
        path: "requests/:requestId",
        element: <MyRequest />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "admin",
        element: <AdminRBAC />,
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
        element: <AdminRBAC />,
      },
    ],
  },
]);

function Index() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default Index;
