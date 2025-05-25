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
import NavBarBottom from "../components/NavBarBottom";

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

      const { error: dbError } = await supabase.from("images").insert([
        {
          uuid: taskInfo.userid,
          file_path: updatedImagePath,
        },
      ]);

      if (dbError) {
        console.error("Error saving to images table:", dbError);
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
      navigate("/home"); // redirect after success (optional)
    }
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TaskImage imagePath={taskInfo.data.image} />

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
                  <Typography sx={{ fontSize: "10px" }}>Todo</Typography>
                </Button>
              </Tooltip>
              <Tooltip title="In Progress">
                <Button
                  color={taskStatus === "in-progress" ? "primary" : "inherit"}
                  variant={taskStatus === "in-progress" ? "contained" : "outlined"}
                  onClick={() => setTaskStatus("in-progress")}
                  startIcon={<HourglassEmptyIcon />}
                >
                  <Typography sx={{ fontSize: "10px" }}>In Progress</Typography>
                </Button>
              </Tooltip>
              <Tooltip title="Completed">
                <Button
                  color={taskStatus === "completed" ? "primary" : "inherit"}
                  variant={taskStatus === "completed" ? "contained" : "outlined"}
                  onClick={() => setTaskStatus("completed")}
                  startIcon={<CheckCircleIcon />}
                >
                  <Typography sx={{ fontSize: "10px" }}>Completed</Typography>
                </Button>
              </Tooltip>
            </ButtonGroup>
          </Box>

          <SubTask taskInfo={taskInfo} />
          <AddSubTask task={taskInfo} />

          {responseStatus && (
            <Typography
              mt={2}
              color={responseStatus.includes("Error") ? "error" : "success.main"}
            >
              {responseStatus}
            </Typography>
          )}

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
            <Button onClick={handleSubmit} variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Update Task"}
            </Button>
          </Box>
        </Box>

        <NavBarBottom />
        <Box sx={{ marginBottom: 10, height: 10 }} />
      </Container>
    </>
  );
}

export default EditTask;
