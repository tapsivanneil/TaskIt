import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Box } from "@mui/material";

function TaskImageList({ imagePath }) {
  const [publicUrl, setPublicUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!imagePath) return;

    const { data, error } = supabase
      .storage
      .from("images") // Your Supabase bucket name
      .getPublicUrl(imagePath);

    if (error) {
      console.error("Supabase URL error:", error.message);
      setError(error.message);
    } else {
      setPublicUrl(data.publicUrl);
    }
  }, [imagePath]);

  if (error) {
    return (
      <Box
        sx={{
          width: 100,
          height: 100,
          backgroundColor: "#fdd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
        }}
      >
        Error
      </Box>
    );
  }

  if (!publicUrl) {
    return (
      <Box
        sx={{
          width: 100,
          height: 100,
          backgroundColor: "#eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
        }}
      >
        Loading...
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={publicUrl}
      alt="Task"
      sx={{
        width: 100,
        height: 100,
        objectFit: "cover",
        borderRadius: 1,
        backgroundColor: "#f9f9f9",
      }}
      onError={(e) => {
        console.error("Image load error", e);
        e.target.src = "/fallback.png"; // Optional fallback
      }}
    />
  );
}

export default TaskImageList;
