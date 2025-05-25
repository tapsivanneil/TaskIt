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
      setTimeout(() => {
        setError("");
      }, 3000);
    } else {
      navigate("/");
    }

    if (session) {
      setError("");
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        height: "100vh",            // full viewport height
        display: "flex",
        alignItems: "center",       // vertical center
        justifyContent: "center",   // horizontal center
      }}
    >
      <Box
        component="form"
        onSubmit={handleSignIn}
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        <Typography variant="h5" fontWeight="bold" textAlign="center">
          Log in
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

        <Button variant="contained" type="submit" fullWidth>
          Sign In
        </Button>

        <Typography variant="body2" textAlign="center">
          Don't have an account yet?{" "}
          <MuiLink component={Link} to="/signup" underline="hover">
            Sign up
          </MuiLink>
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Container>
  );
};

export default Login;

