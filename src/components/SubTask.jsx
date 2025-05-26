import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import StatusRadioGroup from "./StatusRadioGroup";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete"; // MUI delete icon

function SubTask({ taskInfo }) {
  const subTasks = taskInfo?.data?.subTasks || [];
  const [statuses, setStatuses] = useState({});
  const [localSubTasks, setLocalSubTasks] = useState(subTasks); // new local state

  useEffect(() => {
    const initialStatuses = {};
    subTasks.forEach((st) => {
      let statusStr = "todo";
      if (st.status === 2) statusStr = "in-progress";
      else if (st.status === 3) statusStr = "completed";
      initialStatuses[st.id] = statusStr;
    });
    setStatuses(initialStatuses);
    setLocalSubTasks(subTasks); // reset localSubTasks when taskInfo updates
  }, [taskInfo]);

  const handleStatusChange = async (subTaskId, newStatus) => {
    setStatuses((prev) => ({
      ...prev,
      [subTaskId]: newStatus,
    }));

    const statusNumberMap = {
      todo: 1,
      "in-progress": 2,
      completed: 3,
    };

    const updatedSubTasks = localSubTasks.map((subTask) => {
      if (subTask.id === subTaskId) {
        return {
          ...subTask,
          status: statusNumberMap[newStatus],
        };
      }
      return subTask;
    });

    const updatedTaskData = {
      ...taskInfo.data,
      subTasks: updatedSubTasks,
    };

    const { error } = await supabase
      .from("tasks")
      .update({ data: updatedTaskData })
      .eq("id", taskInfo.id);

    if (error) {
      console.error("Error updating subtask status:", error);
    } else {
      console.log("Subtask status updated successfully");
    }
  };

  const handleDeleteSubTask = async (subTaskId) => {
    const updatedSubTasks = localSubTasks.filter((st) => st.id !== subTaskId);

    const updatedTaskData = {
      ...taskInfo.data,
      subTasks: updatedSubTasks,
    };

    const { error } = await supabase
      .from("tasks")
      .update({ data: updatedTaskData })
      .eq("id", taskInfo.id);

    if (error) {
      console.error("Error deleting subtask:", error);
    } else {
      setLocalSubTasks(updatedSubTasks);
      const updatedStatuses = { ...statuses };
      delete updatedStatuses[subTaskId];
      setStatuses(updatedStatuses);
      console.log("Subtask deleted successfully");
    }
  };

  return (
    <List sx={{ width: "100%" }}>
      {localSubTasks.map((subTask) => (
        <ListItem
          key={subTask.id}
          divider
          disableGutters
          sx={{
            px: 2,
            py: 1,
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            justifyContent: {
              xs: "flex-start",
              sm: "space-between",
            },
            width: {
              xs: "100%",
            },
          }}
        >
          <ListItemText
            primary={
              <Typography
                variant="subtitle1"
                component="span"
                sx={{
                  fontWeight: 300,
                  fontSize: "14px",
                  textDecoration:
                    statuses[subTask.id] === "completed" ? "line-through" : "none",
                }}
              >
                {subTask.name}
              </Typography>
            }
            sx={{
              width: "100%",
              mb: { xs: 1, sm: 0 },
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
            <StatusRadioGroup
              subTask={subTask}
              status={statuses[subTask.id]}
              onStatusChange={handleStatusChange}
            />
            <IconButton
              aria-label="delete"
              onClick={() => handleDeleteSubTask(subTask.id)}
              size="small"
              sx={{ ml: 1 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </ListItem>
      ))}
    </List>
  );
}

export default SubTask;
