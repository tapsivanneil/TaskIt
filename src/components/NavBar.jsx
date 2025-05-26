import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { UserAuth } from "../context/AuthContext";

function NavBar() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { session, signOut } = UserAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
      handleMenuClose();
    } catch (err) {
      console.log(err);
      setError("An unexpected error occurred.");
    }
  };

  const handleHomeClick = () => {
    navigate("/home");
    handleMenuClose();
  };

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar sx={{ justifyContent: "space-between", 
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #90caf9 100%)",

      }}>
        {!isMobile && (
          <Typography sx={{ mr: 2 }}>
            {session?.user?.email}
          </Typography>
        )}
        
        <Typography
          variant="h6"
          onClick={handleHomeClick}
          sx={{ cursor: "pointer", flexGrow: 1, textAlign: "center", ml: isMobile? 4 : -5 }}
        >
        
           TaskIt
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
              size="large"
            >
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              keepMounted
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {session
                ? [
                    <MenuItem key="email" disabled>
                      {session.user.email}
                    </MenuItem>,
                    <MenuItem key="signout" onClick={handleSignOut}>
                      Sign Out
                    </MenuItem>,
                  ]
                : [
                    <MenuItem
                      key="signin"
                      onClick={() => {
                        navigate("/login");
                        handleMenuClose();
                      }}
                    >
                      Sign In
                    </MenuItem>,
                    <MenuItem
                      key="signup"
                      onClick={() => {
                        navigate("/signup");
                        handleMenuClose();
                      }}
                    >
                      Sign Up
                    </MenuItem>,
                  ]}
            </Menu>
          </>
        ) : (
          session && (
            <Box>
              <Button
                color="inherit"
                variant="outlined"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </Box>
          )
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
