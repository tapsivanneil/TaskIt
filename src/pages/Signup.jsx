// src/pages/Signup.jsx
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
  CircularProgress,
} from "@mui/material";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signUpNewUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signUpNewUser(email, password, name);

      if (result.success) {
        navigate("/login");
      } else {
        setError(result.error.message);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        height: "100vh",             // Full viewport height
        display: "flex",
        alignItems: "center",        // Vertical center
        justifyContent: "center",    // Horizontal center
      }}
    >
      <Box
        component="form"
        onSubmit={handleSignUp}
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        <Typography variant="h5" fontWeight="bold" textAlign="center">
          Sign up today!
        </Typography>

        <TextField
          label="Name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          autoComplete="name"
        />

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
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          Sign Up
        </Button>

          <Typography variant="body2" textAlign="center">
          Already have an account?{" "}
          <MuiLink component={Link} to="/login" underline="hover">
            Sign in
          </MuiLink>
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Container>
  );
};

export default Signup;
