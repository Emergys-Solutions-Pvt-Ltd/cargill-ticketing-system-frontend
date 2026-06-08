import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { useLocation, Link as RouterLink } from "react-router-dom";

export default function LabelStepper() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbNameMap = {
    "/requests": "My Requests",
    "/admin": "User Management",
  };

  return (
    <Stack spacing={2}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          Home
        </Link>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const label = breadcrumbNameMap[to] || value.charAt(0).toUpperCase() + value.slice(1);

          return last ? (
            <Typography key={to} sx={{ color: "text.primary", fontWeight: 500 }}>
              {label}
            </Typography>
          ) : (
            <Link
              underline="hover"
              color="inherit"
              component={RouterLink}
              to={to}
              key={to}
            >
              {label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Stack>
  );
}

