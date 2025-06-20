import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  AppBar,
  Toolbar,
  Link as MuiLink,
  Paper,
} from "@mui/material";

import TaskIcon from "@mui/icons-material/Task";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { signInUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    const { session, error } = await signInUser(email, password);

    if (error) {
      setError(error);
      setTimeout(() => setError(""), 3000);
    } else {
      navigate("/home");
    }

    if (session) {
      setError("");
    }
  };

    const handleHomeClick = () => {
    navigate("/");
    };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #90caf9 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
          <AppBar position="fixed" sx={{backgroundColor: "transparent", boxShadow: 0}}>
          <Toolbar>
            <TaskIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="div" onClick={handleHomeClick} sx={{ flexGrow: 1 } }>
              TaskIt
            </Typography>
          </Toolbar>
        </AppBar>

      <Paper
        elevation={4}
        sx={{
          maxWidth: 400,
          width: "100%",
          padding: 4,
          borderRadius: 3,
          backgroundColor: "#ffffff",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSignIn}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
            Welcome Back
          </Typography>

          <TextField
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            autoComplete="email"
          />

          <TextField
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            autoComplete="current-password"
          />

          <Button variant="contained" type="submit" fullWidth sx={{ mt: 1 }}>
            Log in
          </Button>

          <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
            Don't have an account?{" "}
            <MuiLink component={Link} to="/signup" underline="hover">
              Sign up
            </MuiLink>
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
