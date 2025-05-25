import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import StatusRadioGroup from "./StatusRadioGroup";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

function SubTask({ taskInfo }) {
  const subTasks = taskInfo?.data?.subTasks || [];
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    const initialStatuses = {};
    subTasks.forEach((st) => {
      let statusStr = "todo";
      if (st.status === 2) statusStr = "in-progress";
      else if (st.status === 3) statusStr = "completed";
      initialStatuses[st.id] = statusStr;
    });
    setStatuses(initialStatuses);
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

    const updatedSubTasks = subTasks.map((subTask) => {
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

  return (
    <List sx={{ width: "100%" }}>
      {subTasks.map((subTask) => (
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
              xs: "100%"
            },
          }}
        >
          <ListItemText
            primary={
              <Typography
                variant="subtitle1"
                component="span"
                sx={{ fontWeight: 300, fontSize: "14px" }}
              >
                {subTask.name}
              </Typography>
            }
            sx={{
              width: "100%",
              mb: { xs: 1, sm: 0 },
            }}
          />

            <Box sx={{ ml: "auto" }}>
            <StatusRadioGroup
              subTask={subTask}
              status={statuses[subTask.id]}
              onStatusChange={handleStatusChange}
            />
          </Box>
        </ListItem>

      ))}
    </List>
  );
}

export default SubTask;
