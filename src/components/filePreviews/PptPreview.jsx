import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const pptxSlides = [
  {
    title: "Cargil System Audit",
    subtitle: "Preliminary Assessment Report",
    content: [
      "Author: Security Operations Team",
      "Assessment Date: May 20, 2026",
      "Status: Under Compliance Review"
    ]
  },
  {
    title: "Audit Scope & Methodology",
    subtitle: "What was scanned",
    content: [
      "Dynamic scan on SXR QA environment",
      "Authorization checklist verification",
      "Role-Based Access Control (RBAC) validations"
    ]
  },
  {
    title: "Key Findings Summary",
    subtitle: "Initial review details",
    content: [
      "No critical security gaps identified",
      "CORS headers and SSL ciphers conform to Cargil policy",
      "Minor documentation warnings cleared"
    ]
  }
];

export default function PptPreview({ file }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevFile, setPrevFile] = useState(null);

  if (file !== prevFile) {
    setPrevFile(file);
    setCurrentSlide(0);
  }

  if (!file) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box 
        sx={{ 
          bgcolor: "#0f172a", 
          color: "#ffffff", 
          p: 5, 
          borderRadius: 4, 
          minHeight: "300px", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center", 
          alignItems: "center",
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.08)",
          position: "relative"
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, color: "#38bdf8" }}>
          {pptxSlides[currentSlide].title}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#94a3b8", mb: 4, fontStyle: "italic" }}>
          {pptxSlides[currentSlide].subtitle}
        </Typography>
        <Box sx={{ display: "inline-block", textAlign: "left" }}>
          {pptxSlides[currentSlide].content.map((bullet, bIdx) => (
            <Typography key={bIdx} variant="body1" sx={{ color: "#e2e8f0", mb: 1 }}>
              • {bullet}
            </Typography>
          ))}
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
        <Button 
          variant="outlined" 
          disabled={currentSlide === 0} 
          onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
        >
          Previous Slide
        </Button>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Slide {currentSlide + 1} of {pptxSlides.length}
        </Typography>
        <Button 
          variant="outlined" 
          disabled={currentSlide === pptxSlides.length - 1} 
          onClick={() => setCurrentSlide(prev => Math.min(pptxSlides.length - 1, prev + 1))}
        >
          Next Slide
        </Button>
      </Box>
    </Box>
  );
}
