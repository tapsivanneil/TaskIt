import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  AppBar,
  Toolbar,
  CssBaseline,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import TaskIcon from "@mui/icons-material/Task";

function Landing() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />

      <AppBar position="static">
        <Toolbar>
          <TaskIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TaskIt
          </Typography>
          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #90caf9 100%)",
          color: "white",
          py: 10,
          textAlign: "center",
        }}
      >
        <Container sx={{ width: "100%" }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Organize. Focus. Conquer.
          </Typography>
          <Typography variant="h6" mb={4}>
            TaskIt helps you take control of your day with powerful yet simple task management.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/signup")}
            sx={{
              backgroundColor: "white",
              color: "primary.main",
              borderRadius: 5,
              transition: "transform 0.3s ease, background-color 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      <Container sx={{ my: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Why Choose TaskIt?
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            justifyContent: "center",
            alignItems: "stretch",
            flexWrap: "wrap",
          }}
        >
          {[
            {
              icon: <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />,
              title: "Track Your Progress",
              description:
                "Visualize your progress from start to finish. Track task completion at a glance.",
            },
            {
              icon: <ScheduleIcon color="info" sx={{ fontSize: 40 }} />,
              title: "Stay on Schedule",
              description:
                "Keep your day organized and on time. Manage deadlines without stress.",
            },
            {
              icon: <DeleteSweepIcon color="error" sx={{ fontSize: 40 }} />,
              title: "Declutter with Ease",
              description:
                "Archive or delete finished tasks in a tap. Stay focused with a tidy workspace.",
            },
          ].map((feature, idx) => (
            <Paper
              key={idx}
              elevation={3}
              sx={{
                minWidth: { xs: 250, sm: 250 },
                maxWidth: "auto",
                p: 4,
                textAlign: "center",
                flex: "1 1 auto",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {feature.icon}
              <Typography variant="h6" mt={2}>
                {feature.title}
              </Typography>
              <Typography>{feature.description}</Typography>
            </Paper>
          ))}
        </Box>
      </Container>

      <Box
        component="footer"
        sx={{
          bgcolor: "grey.900",
          color: "white",
          py: 4,
          textAlign: "center",
          mt: "auto",
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} TaskIt. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default Landing;
