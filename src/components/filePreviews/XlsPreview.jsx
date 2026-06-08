import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function XlsPreview({ file }) {
  if (!file) return null;

  return (
    <Box sx={{ bgcolor: "background.paper", borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
      <Box sx={{ bgcolor: "#10b981", color: "#ffffff", px: 2, py: 1, display: "flex", gap: 3, alignItems: "center" }}>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          Cargil Excel Viewer
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, fontSize: "0.75rem", opacity: 0.9 }}>
          <span>File</span>
          <span>Home</span>
          <span>Insert</span>
          <span>Data</span>
        </Box>
      </Box>
      <Box sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 600, borderCollapse: "collapse", "& td, & th": { border: "1px solid", borderColor: "divider", p: 1, fontSize: "0.8rem" } }}>
          <TableHead sx={{ bgcolor: "action.hover" }}>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold", width: 50 }}>Row</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>A (Audit Item)</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>B (Category)</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>C (Scope)</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>D (Status)</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>E (Assigned)</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>F (Completion)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              { item: "CORS Checking", cat: "Security Policy", scope: "SXR QA environment", stat: "PASS", who: "Ashish Shende", pct: "100%" },
              { item: "SSL Ciphers check", cat: "Infrastructure", scope: "API Endpoint", stat: "PASS", who: "Ops Team", pct: "100%" },
              { item: "RBAC Matrix Verify", cat: "Identity Control", scope: "UAM Portal", stat: "IN PROGRESS", who: "Admin", pct: "50%" },
              { item: "Vulnerability DAST Scan", cat: "Pen Testing", scope: "External Web Service", stat: "PENDING", who: "Security Team", pct: "0%" },
              { item: "Data encryption audits", cat: "Database Security", scope: "SQL Database", stat: "PENDING", who: "DB Admin", pct: "0%" },
            ].map((row, idx) => (
              <TableRow key={idx}>
                <TableCell align="center" sx={{ bgcolor: "action.hover", fontWeight: "bold" }}>{idx + 1}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>{row.item}</TableCell>
                <TableCell>{row.cat}</TableCell>
                <TableCell>{row.scope}</TableCell>
                <TableCell>
                  <span style={{ 
                    padding: "2px 6px", 
                    borderRadius: "4px", 
                    fontSize: "0.7rem", 
                    fontWeight: "bold",
                    backgroundColor: row.stat === "PASS" ? "rgba(16, 185, 129, 0.15)" : row.stat === "IN PROGRESS" ? "rgba(59, 130, 246, 0.15)" : "rgba(245, 158, 11, 0.15)",
                    color: row.stat === "PASS" ? "#10b981" : row.stat === "IN PROGRESS" ? "#3b82f6" : "#f59e0b"
                  }}>
                    {row.stat}
                  </span>
                </TableCell>
                <TableCell>{row.who}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{row.pct}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Box sx={{ bgcolor: "action.hover", borderTop: "1px solid", borderColor: "divider", px: 2, py: 0.5, display: "flex", gap: 2, fontSize: "0.75rem", color: "text.secondary" }}>
        <span style={{ fontWeight: "bold", borderBottom: "2px solid #10b981", color: "#10b981", paddingBottom: "2px" }}>Sheet1</span>
        <span>Audit Summary</span>
        <span>+</span>
      </Box>
    </Box>
  );
}
