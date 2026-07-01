import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const fieldValue = (value) =>
  value === undefined || value === null || value === "" ? "-" : value;

function ReadOnlyField({ label, value }) {
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          mb: 0.75,
          fontWeight: 700,
          color: "text.secondary",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <TextField
        fullWidth
        value={fieldValue(value)}
        InputProps={{ readOnly: true }}
        variant="outlined"
        size="small"
        sx={{
          pointerEvents: "none",
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            bgcolor: "background.paper",
          },
          "& .MuiInputBase-input": {
            fontWeight: 500,
          },
        }}
      />
    </Box>
  );
}

function Section({ title, fields }) {
  return (
    <Box>
      <Typography
        sx={{
          fontWeight: 700,
          color: "text.primary",
          mb: 2,
          textDecoration: "underline",
          textDecorationColor: "#1B3D41",
          textUnderlineOffset: "10px",
        }}
      >
        {title}
      </Typography>
      <Grid container spacing={2}>
        {fields.map((field) => (
          <Grid item xs={12} md={6} key={field.label}>
            <ReadOnlyField label={field.label} value={field.value} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function DetailsForm({ request, user }) {
  const incidentType = String(request?.id || "").startsWith("INC")
    ? "Incident"
    : "Service Request";
  const openedDate = request?.created;
  const closedDate = request?.status === "Closed" ? request?.updated : "";

  const sections = [
    {
      title: "Console Client Details",
      fields: [
        { label: "HR", value: request?.department || "HR" },
        { label: "Contact", value: request?.assignee },
        { label: "Incident Staff Email", value: user?.email },
      ],
    },
    {
      title: "Console-Task Details",
      fields: [
        { label: "Template", value: request?.template || "Standard Task" },
        { label: "Task Category", value: request?.category },
        { label: "More Info", value: request?.department || request?.title },
        { label: "Description", value: request?.title },
        {
          label: "Resolution",
          value:
            request?.resolution ||
            (request?.status === "Closed" ? "Resolved" : ""),
        },
        { label: "Incident / Service Request", value: incidentType },
        { label: "Transaction Count", value: request?.comments?.length || 0 },
      ],
    },
    {
      title: "Status and Priority Details",
      fields: [
        { label: "Impact", value: request?.impact },
        { label: "Urgency", value: request?.urgency },
        { label: "Priority", value: request?.priority },
        { label: "Status", value: request?.status },
        { label: "Follow Up", value: request?.followUp || "No" },
        {
          label: "First Call Resolution",
          value: request?.firstCallResolution || "No",
        },
      ],
    },
    {
      title: "Date and Time Details",
      fields: [
        { label: "Opened Date", value: openedDate },
        { label: "Due Date", value: request?.dueDate },
        { label: "Scheduled Start", value: request?.scheduledStart },
        { label: "Scheduled End", value: request?.scheduledEnd },
        { label: "Closed Date", value: closedDate },
      ],
    },
    {
      title: "Assignment Details",
      fields: [
        { label: "Queue", value: request?.queue || request?.department },
        { label: "Staff", value: request?.assignee },
      ],
    },
  ];

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 3,
        backgroundImage: "none",
        border: "none"
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Grid container spacing={3}>
          {sections.map((section, index) => (
            <Grid item xs={12} key={section.title}>
              <Section title={section.title} fields={section.fields} />
              {index < sections.length - 1 && <Divider sx={{ mt: 3 }} />}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default DetailsForm;
