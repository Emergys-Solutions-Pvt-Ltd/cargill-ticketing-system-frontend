import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

export default function DocPreview({ file }) {
  if (!file) return null;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "400px", py: 2 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          bgcolor: "#ffffff", 
          color: "#000000", 
          p: 6, 
          width: "100%", 
          maxWidth: "650px", 
          minHeight: "400px", 
          borderRadius: 1, 
          border: "1px solid #e2e8f0",
          fontFamily: '"Times New Roman", Times, serif'
        }}
      >
        <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mb: 1, color: "#1e3a8a", letterSpacing: "0.05em" }}>
          ACCESS AUTHORIZATION SHEET
        </Typography>
        <Typography variant="subtitle2" align="center" sx={{ mb: 4, color: "#64748b", fontWeight: "bold" }}>
          CARGIL SYSTEMS • SECURITY COMPLIANCE
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body1" paragraph sx={{ mb: 1.5, color: "#000000" }}>
          <strong>Date:</strong> May 20, 2026
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 1.5, color: "#000000" }}>
          <strong>Request Ref:</strong> REQ000123465
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 1.5, color: "#000000" }}>
          <strong>Authorized Activity:</strong> Dynamic Application Scan (DAST Audit)
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 1.5, color: "#000000" }}>
          <strong>Target Environment:</strong> SXR QA Environment
        </Typography>
        <Typography variant="body1" sx={{ mt: 4, lineHeight: 1.8, fontSize: "1.05rem", color: "#000000" }}>
          This document formally validates compliance clearance and grants authorization to perform vulnerability testing. Activities are restricted to non-production endpoints. Ensure logging monitoring is active prior to initialization.
        </Typography>
        <Typography variant="body1" sx={{ mt: 5, fontStyle: "italic", textAlign: "right", color: "#000000" }}>
          Approved by: Security Compliance Board
        </Typography>
      </Paper>
    </Box>
  );
}
