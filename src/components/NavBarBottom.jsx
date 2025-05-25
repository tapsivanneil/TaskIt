import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; // Or use AddIcon
import { Box, Fab } from '@mui/material';

export default function NavBarBottom({ onAddTaskClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState("Home");

  useEffect(() => {
    if (location.pathname === "/trash") {
      setValue("Trash");
    } else {
      setValue("Home");
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === "Trash") {
      navigate("/trash");
    } else {
      navigate("/home");
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 600,
          zIndex: 1200,
        }}
      >
        <BottomNavigation
          showLabels // <-- This enables labels
          sx={{ width: "100%" }}
          value={value}
          onChange={handleChange}
        >
          <BottomNavigationAction label="Home" value="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Trash" value="Trash" icon={<DeleteIcon />} />
        </BottomNavigation>

          {location.pathname === "/home" || location.pathname === "/trash" ? (
          
             <Fab
                color="primary"
                onClick={onAddTaskClick}
                sx={{
                  position: "absolute",
                  top: -30,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 1300,
                }}
              >
                <EditIcon />
              </Fab>
                ) : (
                     <>
                     </>
               )}

      </Box>
    </>
  );
}
