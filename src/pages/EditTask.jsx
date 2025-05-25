import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import NavBar from "../components/NavBar";
import SubTask from "../components/SubTask";
import AddSubTask from "../components/AddSubTask";
import TaskImage from "../components/TaskImage";
import { v4 as uuidv4 } from "uuid";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  ButtonGroup,
  Tooltip,
  CircularProgress,
} from "@mui/material";

import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function EditTask() {
  const location = useLocation();
  const { taskInfo } = location.state || {};

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("todo");
  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);

  const navigate = useNavigate();

  const statusStringToNumber = {
    todo: 1,
    "in-progress": 2,
    completed: 3,
  };

  const statusNumberToString = {
    1: "todo",
    2: "in-progress",
    3: "completed",
  };

  useEffect(() => {
    if (taskInfo) {
      setTitle(taskInfo.data.title || "");
      setDescription(taskInfo.data.description || "");
      setTaskStatus(statusNumberToString[taskInfo.data.taskStatus] || "todo");
    }
  }, [taskInfo]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseStatus("");

    let updatedImagePath = taskInfo.data.image || null;

    if (newImageFile) {
      const fileName = `${taskInfo.userid}/${uuidv4()}_${newImageFile.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, newImageFile);

      if (uploadError) {
        console.error("Image upload failed:", uploadError);
        setResponseStatus("Image upload failed");
        setLoading(false);
        return;
      }

      updatedImagePath = data.path;

      // Optional: update media table if you track images separately
      const { error: dbError } = await supabase.from("media").insert([
        {
          user_id: taskInfo.userid,
          file_path: updatedImagePath,
        },
      ]);

      if (dbError) {
        console.error("Error saving to media table:", dbError);
      }
    }

    const updatedTaskData = {
      ...taskInfo.data,
      title,
      description,
      taskStatus: statusStringToNumber[taskStatus],
      image: updatedImagePath,
    };

    const { error } = await supabase
      .from("tasks")
      .update({ data: updatedTaskData })
      .eq("id", taskInfo.id);

    setLoading(false);

    if (error) {
      console.error("Error updating task:", error);
      setResponseStatus("Error updating task");
    } else {
      setResponseStatus("Task updated successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Task
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Display current image */}
          <TaskImage imagePath={taskInfo.data.image} />

          {/* Upload new image */}
          <Button variant="outlined" component="label">
            Upload New Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>

          <TextField
            label="Task Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Task Description"
            variant="outlined"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            fullWidth
          />

          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <ButtonGroup size="medium" variant="outlined" aria-label="task status">
              <Tooltip title="Todo">
                <Button
                  color={taskStatus === "todo" ? "primary" : "inherit"}
                  variant={taskStatus === "todo" ? "contained" : "outlined"}
                  onClick={() => setTaskStatus("todo")}
                  startIcon={<RadioButtonUncheckedIcon />}
                >
                  Todo
                </Button>
              </Tooltip>
              <Tooltip title="In Progress">
                <Button
                  color={taskStatus === "in-progress" ? "primary" : "inherit"}
                  variant={taskStatus === "in-progress" ? "contained" : "outlined"}
                  onClick={() => setTaskStatus("in-progress")}
                  startIcon={<HourglassEmptyIcon />}
                >
                  In Progress
                </Button>
              </Tooltip>
              <Tooltip title="Completed">
                <Button
                  color={taskStatus === "completed" ? "primary" : "inherit"}
                  variant={taskStatus === "completed" ? "contained" : "outlined"}
                  onClick={() => setTaskStatus("completed")}
                  startIcon={<CheckCircleIcon />}
                >
                  Completed
                </Button>
              </Tooltip>
            </ButtonGroup>
          </Box>

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Update Task"}
          </Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Subtasks
          </Typography>
          <SubTask taskInfo={taskInfo} />
          <AddSubTask task={taskInfo} />
        </Box>

        {responseStatus && (
          <Typography
            mt={2}
            color={responseStatus.includes("Error") ? "error" : "success.main"}
          >
            {responseStatus}
          </Typography>
        )}
      </Container>
    </>
  );
}

export default EditTask;
