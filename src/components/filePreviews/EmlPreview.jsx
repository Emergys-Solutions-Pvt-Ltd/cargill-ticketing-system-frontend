import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export default function EmlPreview({ file }) {
  if (!file) return null;

  return (
    <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, overflow: "hidden", bgcolor: "background.paper" }}>
      <Box sx={{ bgcolor: "action.hover", borderBottom: "1px solid", borderColor: "divider", px: 3, py: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "text.primary" }}>
          Email Message ({file.type.toUpperCase()} Viewer)
        </Typography>
        <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "4px", backgroundColor: "rgba(217, 119, 6, 0.15)", color: "#d97706", fontWeight: "bold" }}>
          Active Thread
        </span>
      </Box>
      
      <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider", bgcolor: "action.hover" }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "text.primary" }}>
              <strong>From:</strong> security_compliance@cargil.com
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "text.primary" }}>
              <strong>To:</strong> ashish.shende@cargil.com, developer_lead@cargil.com
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "text.primary" }}>
              <strong>Date:</strong> May 20, 2026, 10:45 AM
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold", color: "primary.main" }}>
              Subject: Access Authorization Clearance - SXR QA Scan
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ p: 4, minHeight: "250px", bgcolor: "#ffffff", color: "#334155" }}>
        <Typography variant="body2" sx={{ mb: 2, color: "#1e293b", lineHeight: 1.6 }}>
          Hi Ashish,
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "#1e293b", lineHeight: 1.6 }}>
          The security compliance committee has formally reviewed your DAST assessment scan request for the SXR QA environment (Ref: REQ000123465). 
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "#1e293b", lineHeight: 1.6 }}>
          Clearance has been granted subject to testing protocols outlined in the attached scan_requirements checklists. Please ensure that all activities are logged and that the network gateway is monitored throughout the scan interval.
        </Typography>
        <Typography variant="body2" sx={{ mb: 4, color: "#1e293b", lineHeight: 1.6 }}>
          Let us know if you encounter any access blocks.
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: "italic", color: "#64748b" }}>
          Best regards,<br />
          <strong>Cargil Security & Compliance Board</strong><br />
          Minneapolis Operations Center
        </Typography>
      </Box>
    </Box>
  );
}
