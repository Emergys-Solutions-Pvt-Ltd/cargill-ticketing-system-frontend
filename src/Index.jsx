import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import MyRequest from "./pages/MyRequest";
import Profile from "./components/myProfile/Profile";
import AdminRBAC from "./pages/AdminRBAC";
import RequestList from "./pages/RequestList";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Profile />,
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
        path: "admin",
        element: <AdminRBAC />,
      },
    ],
  },
]);



function Index() {
  return <RouterProvider router={router} />;
}

export default Index;
