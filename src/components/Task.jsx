import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext";
import TaskImage from "./TaskImage";
import SubTask from "./SubTask";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'; // for permanent deletion


import { useLocation } from "react-router-dom";


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}));

function Task({ taskInfo, onTaskDeleted }) {
  const [expanded, setExpanded] = React.useState(false);
  const [taskStatus, setTaskStatus] = React.useState("todo");

  React.useEffect(() => {
    const statusMap = {
      1: "todo",
      2: "in-progress",
      3: "completed",
    };
    setTaskStatus(statusMap[taskInfo.data.taskStatus] || "todo");
  }, [taskInfo]);

  const { session } = UserAuth();
  const firstLetter = session?.user?.email ? session?.user?.email.charAt(0) : "";

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const navigate = useNavigate();

const deleteTask = async (id) => {
  // Step 1: Fetch the existing task
  const { data: task, error: fetchError } = await supabase
    .from("tasks")
    .select("data")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Error fetching task before update:", fetchError);
    return;
  }

  if (!task || !task.data) {
    console.error("No task data found for id:", id, "Fetched task:", task);
    return;
  }

  // Step 2: Safely update only the taskStatus
  const updatedData = {
    ...task.data,
    taskStatus: 4,
  };

  // Step 3: Update the task with the modified data object
  const { error: updateError } = await supabase
    .from("tasks")
    .update({ data: updatedData })
    .eq("id", id);

  if (updateError) {
    console.error("Error updating task:", updateError);
  } else {
    console.log("Task updated successfully with data:", updatedData);
    onTaskDeleted();
  }
};


  const permanentDeleteTask = async (id) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error permanently deleting task:", error);
    } else {
      console.log("Task permanently deleted.");
      onTaskDeleted(); //
    }
  };

  const editTask = () => {
    navigate("/edittask", { state: { taskInfo } });
  };

  const handleStatusChange = async (newStatus) => {
    setTaskStatus(newStatus);

    const statusNumberMap = {
      todo: 1,
      "in-progress": 2,
      completed: 3,
    };

    const updatedTaskData = {
      ...taskInfo.data,
      taskStatus: statusNumberMap[newStatus],
    };

    const { error } = await supabase
      .from("tasks")
      .update({ data: updatedTaskData })
      .eq("id", taskInfo.id);

    if (error) {
      console.error("Error updating task status:", error);
    } else {
      console.log("Task status updated successfully");
    }
  };

  return (
      <Card sx={{ maxWidth: 400, m: 2 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="user">
              {firstLetter}
            </Avatar>
          }
          title={taskInfo.data.title}
          subheader={new Date(taskInfo.updated_at).toLocaleString()}
        />
        <TaskImage imagePath={taskInfo.data.image} />
        <CardContent>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            {taskInfo.data.description}
          </Typography>

          {/* Task status button group */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2}}>
            <ButtonGroup size="small" variant="outlined" aria-label="task status">
              <Tooltip title="Todo">
                <Button 
                  color={taskStatus === "todo" ? "primary" : "inherit"}
                  variant={taskStatus === "todo" ? "contained" : "outlined"}
                  onClick={() => handleStatusChange("todo")}
                  startIcon={<RadioButtonUncheckedIcon />}
                >
                  <Typography sx={{ fontSize: '10px' }}>
                      Todo
                  </Typography>
                  
                </Button>
              </Tooltip>
              <Tooltip title="In Progress">
                <Button
                  color={taskStatus === "in-progress" ? "primary" : "inherit"}
                  variant={taskStatus === "in-progress" ? "contained" : "outlined"}
                  onClick={() => handleStatusChange("in-progress")}
                  startIcon={<HourglassEmptyIcon />}
                >
                  <Typography sx={{ fontSize: '10px' }}>
                      In Progress
                  </Typography>
                </Button>
              </Tooltip>
              <Tooltip title="Completed">
                <Button
                  color={taskStatus === "completed" ? "primary" : "inherit"}
                  variant={taskStatus === "completed" ? "contained" : "outlined"}
                  onClick={() => handleStatusChange("completed")}
                  startIcon={<CheckCircleIcon />}
                >
                  <Typography sx={{ fontSize: '10px' }}>
                      Completed
                  </Typography>
                </Button>
              </Tooltip>
            </ButtonGroup>
          </Box>

        </CardContent>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <SubTask taskInfo={taskInfo} />
          </CardContent>
        </Collapse>

        <CardActions sx={{ justifyContent: "flex-end" }}>

          

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show subtasks"
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

          {/* Right side: Edit and Delete icons */}
          <Stack direction="row" spacing={1}>
            <IconButton
              aria-label="edit task"
              color="primary"
              onClick={editTask}
            >
              <EditIcon />
            </IconButton>

            <IconButton
              aria-label="delete task"
              color="error"
              onClick={() => {
                if (location.pathname === "/home") {
                  deleteTask(taskInfo.id);
                } else if (location.pathname === "/trash") {
                  permanentDeleteTask(taskInfo.id);
                }
              }}
            >
              {location.pathname === "/home" ? (
                <DeleteIcon
                  onClick={() => deleteTask(taskInfo.id)}
                  sx={{ cursor: "pointer" }}
                />
              ) : (
                <DeleteForeverIcon
                  onClick={() => permanentDeleteTask(taskInfo.id)}
                  sx={{ cursor: "pointer" }}
                />
              )}
            </IconButton>
          </Stack>
        </Stack>

        </CardActions>
      </Card>
  );
}

export default Task;
