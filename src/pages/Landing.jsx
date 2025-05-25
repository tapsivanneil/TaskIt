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
    <>
      <CssBaseline />

      {/* Header */}
      <AppBar position="static" color="primary">
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

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 10,
          textAlign: "center",
        }}
      >
        <Container sx={{width: "100%", height: "70h"}}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Organize. Focus. Conquer.
          </Typography>
          <Typography variant="h6" mb={4}>
            TaskIt helps you take control of your day with powerful yet simple task management.
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ my: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Why TaskIt?
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
              <Typography variant="h6" mt={2}>
                Track Your Progress
              </Typography>
              <Typography>
                Visualize your task status with ease — from to-do to done.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
              <ScheduleIcon color="info" sx={{ fontSize: 40 }} />
              <Typography variant="h6" mt={2}>
                Stay on Schedule
              </Typography>
              <Typography>
                Plan your day and set priorities without the overwhelm.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
              <DeleteSweepIcon color="error" sx={{ fontSize: 40 }} />
              <Typography variant="h6" mt={2}>
                Clean Up Fast
              </Typography>
              <Typography>
                Archive or delete tasks effortlessly. Keep things tidy.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: "grey.900",
          color: "white",
          py: 4,
          textAlign: "center",
          mt: 10,
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} TaskIt. All rights reserved.
        </Typography>
      </Box>
    </>
  );
}

export default Landing;
