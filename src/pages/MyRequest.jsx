import { Box, Typography } from "@mui/material";
import LabTabs from "../components/LabTabs";

function MyRequest() {
  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Number
          </Typography>
          <Typography variant="body2">12345678</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 5 }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Created
            </Typography>
            <Typography variant="body2">4mon ago</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Updated
            </Typography>
            <Typography variant="body2">4min ago</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              State
            </Typography>
            <Typography variant="body2">Closed</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: 1 }}>
        <Typography variant="h6">
          Request to initiate dynamic scan on SXR QA Environment
        </Typography>
      </Box>
      <Box><LabTabs/></Box>
    </Box>
  );
}

export default MyRequest;
