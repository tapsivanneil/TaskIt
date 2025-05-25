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
  Link as MuiLink,
  Paper,
} from "@mui/material";

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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f9f9f9, #e0f7fa)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
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
