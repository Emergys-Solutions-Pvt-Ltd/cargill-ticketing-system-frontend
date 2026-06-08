import Box from "@mui/material/Box";

export default function HtmlPreview({ file }) {
  if (!file) return null;

  return (
    <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, overflow: "hidden", bgcolor: "background.paper" }}>
      <Box sx={{ bgcolor: "action.hover", borderBottom: "1px solid", borderColor: "divider", px: 2, py: 1, display: "flex", gap: 2, alignItems: "center" }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ef4444" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#10b981" }} />
        </Box>
        <Box sx={{ flexGrow: 1, bgcolor: "background.default", border: "1px solid", borderColor: "divider", borderRadius: "10px", px: 1.5, py: 0.25, fontSize: "0.75rem", color: "text.secondary", fontFamily: "monospace" }}>
          file:///c:/Cargil/{file.name}
        </Box>
      </Box>
      <Box sx={{ p: 4, minHeight: "350px", bgcolor: "#ffffff", color: "#000000" }}>
        <h1 style={{ margin: "0 0 10px 0", color: "#1e3a8a", borderBottom: "2px solid #e2e8f0", paddingBottom: "5px", fontSize: "1.5rem" }}>
          Security Vulnerability Audit Report
        </h1>
        <p style={{ margin: "0 0 15px 0", fontSize: "0.9rem", color: "#475569" }}>
          <strong>Scan Date:</strong> May 24, 2026 • <strong>Scope:</strong> External Gateway Services
        </p>
        <div style={{ padding: "12px", backgroundColor: "#fef2f2", borderLeft: "4px solid #ef4444", borderRadius: "4px", marginBottom: "15px" }}>
          <h3 style={{ margin: "0 0 5px 0", color: "#991b1b", fontSize: "1rem" }}>
            Medium Vulnerability Identified
          </h3>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#7f1d1d", lineHeight: 1.5 }}>
            Session cookie missing secure flag attribute. Users traversing unencrypted channels might expose authentication tokens.
          </p>
        </div>
        <h4 style={{ margin: "15px 0 5px 0", fontSize: "1rem" }}>System Audit Trace Checklist</h4>
        <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#334155" }}>
          <li>Cross-Origin Resource Sharing (CORS): <strong>Verified</strong></li>
          <li>SQL Injection Protection validation: <strong>Passed</strong></li>
          <li>XSS Content Security Policy (CSP): <strong>Passed</strong></li>
        </ul>
      </Box>
    </Box>
  );
}
