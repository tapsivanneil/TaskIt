import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Alert,
} from "@mui/material";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";

function AddTask({ onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responseStatus, setResponseStatus] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const { session } = UserAuth();
  const userID = session?.user?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userID) {
      setResponseStatus("User not authenticated.");
      return;
    }

    let imagePath = null;

    if (imageFile) {
      const fileName = `${userID}/${uuidv4()}_${imageFile.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error("Upload failed:", uploadError);
        setResponseStatus("Image upload failed");
        return;
      }

      imagePath = data.path;

      const { error: dbError } = await supabase.from("media").insert([
        {
          user_id: userID,
          file_path: imagePath,
        },
      ]);

      if (dbError) {
        console.error("Error saving to media table:", dbError);
      }
    }

    const taskData = {
      title,
      description,
      taskStatus: "Todo",
      image: imagePath,
      userid: userID,
    };

    const { error } = await supabase.from("tasks").insert([
      {
        userid: userID,
        data: taskData,
      },
    ]);

    if (error) {
      console.error("Insert failed:", error.message);
      setResponseStatus(`Error inserting task: ${error.message}`);
    } else {
      setResponseStatus("Task added!");
      setTitle("");
      setDescription("");
      setImageFile(null);
      if (onTaskAdded) onTaskAdded();
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4, maxWidth: 500, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Add New Task
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
            multiline
            rows={3}
          />
          <Button variant="outlined" component="label">
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </Button>
          <Button variant="contained" type="submit" color="primary">
            Add Task
          </Button>
          {responseStatus && (
            <Alert severity={responseStatus.includes("Error") ? "error" : "success"}>
              {responseStatus}
            </Alert>
          )}
        </Stack>
      </form>
    </Paper>
  );
}

export default AddTask;
