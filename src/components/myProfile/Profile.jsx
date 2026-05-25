import {
  Box,
  Avatar,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import profileImg from "../../assets/profile_avatar.png";

const Profile = () => {
  const user = {
    name: "Saurabh Patil",
    role: "Senior Software Engineer",
    location: "Pune, India",
    email: "saurabh.patil@example.com",
    phone: "+91 98765 43210",
    website: "saurabhpatil.dev",
    bio: "Passionate developer with 5+ years of experience in building modern web applications using React, Node.js, and Cloud technologies. I love creating intuitive user experiences and solving complex architectural challenges.",
    stats: [
      { label: "Projects", value: "24" },
      { label: "Followers", value: "1.2k" },
      { label: "Following", value: "850" },
    ],
  };

  return (
    <Box className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Profile Card */}
        <Card className="overflow-hidden border-none shadow-xl rounded-2xl mb-8">
          <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            <Tooltip title="Edit Cover Photo" arrow>
              <IconButton
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                size="small"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>

          <CardContent className="relative pt-0 pb-8 px-6 md:px-12">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 md:-mt-16 mb-6 gap-6">
              <div className="relative">
                <Avatar
                  src={profileImg}
                  sx={{
                    width: 160,
                    height: 160,
                    border: "5px solid white",
                    boxShadow:
                      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                  }}
                  className="bg-white"
                />
              </div>

              <div className="flex-1 text-center md:text-left mb-2">
                <Typography
                  variant="h4"
                  className="font-bold text-slate-800 tracking-tight"
                >
                  {user.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-1"
                >
                  {user.role}
                </Typography>
                <div className="flex items-center justify-center md:justify-start gap-3 mt-2 text-slate-400">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <LocationIcon fontSize="inherit" />
                    {user.location}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <Grid container spacing={4}>
          {/* Left Column: About & Personal Info */}
          <Grid item xs={12} md={8}>
            <Stack spacing={4}>
              <Card className="border-none shadow-lg rounded-2xl">
                <CardContent className="p-8">
                  <Typography
                    variant="h6"
                    className="font-bold text-slate-800 mb-6"
                  >
                    Professional Experience
                  </Typography>
                  <Stack spacing={4}>
                    {[
                      {
                        title: "Senior Software Engineer",
                        company: "Tech Global Solutions",
                        period: "2021 - Present",
                        desc: "Leading the frontend development team in building enterprise-level SaaS products using React and TypeScript.",
                      },
                      {
                        title: "Software Developer",
                        company: "Innova Digital",
                        period: "2018 - 2021",
                        desc: "Developed responsive web interfaces and integrated RESTful APIs for various client projects.",
                      },
                    ].map((job, idx) => (
                      <div
                        key={idx}
                        className="relative pl-8 border-l-2 border-slate-100 last:border-0 pb-2"
                      >
                        <div className="absolute top-0 -left-[9px] w-4 h-4 rounded-full bg-indigo-500 border-4 border-white shadow-sm" />
                        <Typography
                          variant="subtitle1"
                          className="font-bold text-slate-800 leading-snug"
                        >
                          {job.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="text-indigo-600 font-semibold mb-2"
                        >
                          {job.company} •{" "}
                          <span className="text-slate-400 font-medium">
                            {job.period}
                          </span>
                        </Typography>
                        <Typography variant="body2" className="text-slate-600">
                          {job.desc}
                        </Typography>
                      </div>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Right Column: Contact Details */}
          <Grid item xs={12} md={4}>
            <Card className="border-none shadow-lg rounded-2xl sticky top-8">
              <CardContent className="p-8">
                <Typography
                  variant="h6"
                  className="font-bold text-slate-800 mb-6"
                >
                  Personal Information
                </Typography>

                <Stack spacing={3}>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <EmailIcon fontSize="small" />
                    </div>
                    <div>
                      <Typography
                        variant="caption"
                        className="text-slate-400 font-bold uppercase tracking-wider block"
                      >
                        Email
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-slate-700 font-medium font-mono"
                      >
                        {user.email}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                      <PhoneIcon fontSize="small" />
                    </div>
                    <div>
                      <Typography
                        variant="caption"
                        className="text-slate-400 font-bold uppercase tracking-wider block"
                      >
                        Phone
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-slate-700 font-medium"
                      >
                        {user.phone}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                      <websiteIcon fontSize="small" />
                    </div>
                    <div>
                      <Typography
                        variant="caption"
                        className="text-slate-400 font-bold uppercase tracking-wider block"
                      >
                        Website
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-blue-600 font-medium hover:underline cursor-pointer"
                      >
                        {user.website}
                      </Typography>
                    </div>
                  </div>

                  <Divider className="my-2 opacity-60" />

                  <div className="space-y-4">
                    <Typography
                      variant="subtitle2"
                      className="font-bold text-slate-800"
                    >
                      Skills
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "React",
                        "TypeScript",
                        "Node.js",
                        "Tailwind CSS",
                        "MUI",
                        "AWS",
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Box>
  );
};

export default Profile;
