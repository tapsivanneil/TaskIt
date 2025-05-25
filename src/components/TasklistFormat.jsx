import * as React from "react";
import {
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  ButtonGroup,
  Button,
  Stack,
  Box,
  Divider,
  Collapse,
} from "@mui/material";
import { red } from "@mui/material/colors";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext";
import TaskImage from "./TaskImage";
import SubTask from "./SubTask";
import TaskImageList from "./TaskImageList"; 

function TasklistFormat({ taskInfo, onTaskDeleted }) {
  const [expanded, setExpanded] = React.useState(false);
  const [taskStatus, setTaskStatus] = React.useState("todo");

  React.useEffect(() => {
    const statusMap = { 1: "todo", 2: "in-progress", 3: "completed" };
    setTaskStatus(statusMap[taskInfo.data.taskStatus] || "todo");
  }, [taskInfo]);

  const { session } = UserAuth();
  const firstLetter = session?.user?.email?.charAt(0) || "";
  const navigate = useNavigate();
  const location = useLocation();

  const handleExpandClick = () => setExpanded(!expanded);

  const deleteTask = async (id) => {
    const { data: task, error: fetchError } = await supabase
      .from("tasks")
      .select("data")
      .eq("id", id)
      .single();
    if (fetchError || !task?.data) {
      console.error("Error fetching task before update:", fetchError || "No data");
      return;
    }
    const updatedData = { ...task.data, taskStatus: 4 };
    const { error: updateError } = await supabase
      .from("tasks")
      .update({ data: updatedData })
      .eq("id", id);
    if (updateError) console.error("Error updating task:", updateError);
    else onTaskDeleted();
  };

  const permanentDeleteTask = async (id) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) console.error("Error permanently deleting task:", error);
    else onTaskDeleted();
  };

  const editTask = () => navigate("/edittask", { state: { taskInfo } });

  const handleStatusChange = async (newStatus) => {
    setTaskStatus(newStatus);
    const statusNumberMap = { todo: 1, "in-progress": 2, completed: 3 };
    const updatedTaskData = {
      ...taskInfo.data,
      taskStatus: statusNumberMap[newStatus],
    };

    const { error } = await supabase
      .from("tasks")
      .update({ data: updatedTaskData })
      .eq("id", taskInfo.id);

    if (error) console.error("Error updating task status:", error);
  };

  return (
    <Box sx={{ width: "100%", py: 2 }}>
      <Stack direction="row" spacing={2} alignItems="flex-start" width="100%">
        {/* Left: Task Image (if any) */}
        {taskInfo.data.image ? (
          <Box sx={{ width: 100, height: 100, flexShrink: 0 }}>
            <TaskImageList imagePath={taskInfo.data.image} />
          </Box>
        ) : (
          <Box sx={{ width: 100, height: 100, backgroundColor: "#f0f0f0", flexShrink: 0 }} />
        )}

        {/* Right: Text & Actions */}
        <Box flex={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">{taskInfo.data.title}</Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(taskInfo.updated_at).toLocaleString()}
            </Typography>
                      {/* Status Buttons */}
                
                <Box mt={1}>
                  <ButtonGroup size="small" variant="outlined">
                    <Tooltip title="Todo">
                      <Button
                        color={taskStatus === "todo" ? "primary" : "inherit"}
                        variant={taskStatus === "todo" ? "contained" : "outlined"}
                        onClick={() => handleStatusChange("todo")}
                        startIcon={<RadioButtonUncheckedIcon />}
                      >
                        <Typography sx={{ fontSize: "10px" }}>Todo</Typography>
                      </Button>
                    </Tooltip>
                    <Tooltip title="In Progress">
                      <Button
                        color={taskStatus === "in-progress" ? "primary" : "inherit"}
                        variant={taskStatus === "in-progress" ? "contained" : "outlined"}
                        onClick={() => handleStatusChange("in-progress")}
                        startIcon={<HourglassEmptyIcon />}
                      >
                        <Typography sx={{ fontSize: "10px" }}>In Progress</Typography>
                      </Button>
                    </Tooltip>
                    <Tooltip title="Completed">
                      <Button
                        color={taskStatus === "completed" ? "primary" : "inherit"}
                        variant={taskStatus === "completed" ? "contained" : "outlined"}
                        onClick={() => handleStatusChange("completed")}
                        startIcon={<CheckCircleIcon />}
                      >
                        <Typography sx={{ fontSize: "10px" }}>Completed</Typography>
                      </Button>
                    </Tooltip>
                  </ButtonGroup>
                </Box>



          </Stack>

          <Typography variant="body2" color="text.secondary" mt={1}>
            {taskInfo.data.description}
          </Typography>

          {/* Expand Subtasks & Actions */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
            <Button
              size="small"
              onClick={handleExpandClick}
              endIcon={
                <ExpandMoreIcon
                  sx={{
                    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "0.3s",
                  }}
                />
              }
            >
              {expanded ? "Hide Subtasks" : "Show Subtasks"}
            </Button>

            <Stack direction="row" spacing={1}>
              <IconButton color="primary" onClick={editTask}>
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() =>
                  location.pathname === "/home"
                    ? deleteTask(taskInfo.id)
                    : permanentDeleteTask(taskInfo.id)
                }
              >
                {location.pathname === "/home" ? <DeleteIcon /> : <DeleteForeverIcon />}
              </IconButton>
            </Stack>
          </Stack>

          {/* SubTasks */}
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box mt={2}>
              <SubTask taskInfo={taskInfo} />
            </Box>
          </Collapse>
        </Box>
      </Stack>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}

export default TasklistFormat;
