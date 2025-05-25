import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import SubTask from "./SubTask";
import DrawSharpIcon from '@mui/icons-material/DrawSharp';

import {
  TextField,
  Button,
  Typography,
  Box,
  Stack,
} from "@mui/material";

function AddSubTask({ task }) {
  const [subTask, setSubTask] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleAddSubTask = async (e) => {
    e.preventDefault();

    const newSubTask = {
      id: crypto.randomUUID(), // unique ID
      name: subTask,
      status: 1,
    };

    const currentSubTasks = task.data.subTasks || [];
    const updatedSubTasks = [...currentSubTasks, newSubTask];

    const updatedData = {
      ...task.data,
      subTasks: updatedSubTasks,
    };

    const { error } = await supabase
      .from("tasks")
      .update({ data: updatedData })
      .eq("id", task.id);

    if (error) {
      console.error(error.message);
      setStatus("Error adding subtask");
    } else {
      setStatus("Subtask added!");
      setSubTask("");
      navigate("/home");
    }
  };

  return (
    <>
      {/* Display existing subtasks */}
      <SubTask taskInfo={{ task }} />

      {/* Add subtask form */}
      <Box component="form" onSubmit={handleAddSubTask} sx={{ mt: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Subtask"
            variant="outlined"
            value={subTask}
            onChange={(e) => setSubTask(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary">
            <DrawSharpIcon />
          </Button>
        </Stack>
        {status && (
          <Typography variant="body2" color={status.includes("Error") ? "error" : "success.main"} sx={{ mt: 1 }}>
            {status}
          </Typography>
        )}
      </Box>
    </>
  );
}

export default AddSubTask;
