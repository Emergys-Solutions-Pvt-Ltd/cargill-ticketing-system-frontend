import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import RequestDetails from "./pages/private/Requests/RequestDetails";
import UserProfile from "./pages/private/Profile/UserProfile";
import UserList from "./pages/private/UAM/User/UserList";
import RequestList from "./pages/private/Requests/RequestList";
import UserDetails from "./pages/private/UAM/User/UserDetails";
import RoleDetails from "./pages/private/UAM/Roles/RoleDetails";
import Login from "./pages/public/Login/Login";
import Home from "./pages/private/Home/Home";
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
        element: <Home />,
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
