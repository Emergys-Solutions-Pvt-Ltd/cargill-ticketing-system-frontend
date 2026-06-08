import { useState, useEffect } from "react";
import Box from "@mui/material/Box";

export default function TxtPreview({ file }) {
  const [txtContent, setTxtContent] = useState("Loading document content...");
  const [prevFile, setPrevFile] = useState(null);

  if (file !== prevFile) {
    setPrevFile(file);
    setTxtContent("Loading document content...");
  }

  useEffect(() => {
    if (file) {
      fetch(`/docs/${file.name}`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to load file");
          return res.text();
        })
        .then(text => setTxtContent(text))
        .catch(() => {
          setTxtContent(
            "Cargil Ticketing System - Security Scan Requirements Checklist\n" +
            "------------------------------------------------------------\n" +
            "1. Verify CORS policies on all SXR QA endpoints.\n" +
            "2. Run dynamic application scan against HTTP API.\n" +
            "3. Validate session timeout parameters.\n" +
            "4. Verify SSL/TLS cipher suites.\n" +
            "5. Check RBAC roles for privilege escalation holes.\n" +
            "6. Verify encryption settings for sensitive parameters."
          );
        });
    }
  }, [file]);

  return (
    <Box 
      sx={{ 
        bgcolor: "background.paper", 
        p: 3, 
        borderRadius: 3, 
        border: "1px solid",
        borderColor: "divider",
        fontFamily: "monospace", 
        whiteSpace: "pre-wrap",
        maxHeight: "450px", 
        overflow: "auto",
        color: "text.primary"
      }}
    >
      {txtContent}
    </Box>
  );
}
