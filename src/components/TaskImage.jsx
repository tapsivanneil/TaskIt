import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function TaskImage({ imagePath }) {
  const [publicUrl, setPublicUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!imagePath) return;
    
    const { data, error } = supabase
      .storage
      .from("images") // replace with your bucket name
      .getPublicUrl(imagePath);

    if (error) {
      console.error("Supabase URL error:", error.message);
      setError(error.message);
    } else {
      setPublicUrl(data.publicUrl);
    }
  }, [imagePath]);

  if (error) return <p>Error loading image: {error}</p>;
  if (!publicUrl) return <p>Loading image...</p>;

  return (
    <>
      <img
        src={publicUrl}
        alt="Task"
        style={{
        width: "100%",
        height: "400px",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        objectFit: "cover"

      }}
        onError={(e) => {
          console.error("Image load error", e);
          e.target.src = "/fallback.png"; // Optional fallback
        }}
        
      />
    </>
  );
}

export default TaskImage;
