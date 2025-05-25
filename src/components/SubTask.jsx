import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import StatusRadioGroup from "./StatusRadioGroup";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

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

  if (subTasks.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
        No subtasks found
      </Typography>
    );
  }

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {subTasks.map((subTask) => (
        <ListItem
          key={subTask.id}
          divider
          secondaryAction={
            <StatusRadioGroup
              subTask={subTask}
              status={statuses[subTask.id]}
              onStatusChange={handleStatusChange}
            />
          }
          alignItems="flex-start"
        >
          <ListItemText
            primary={
              <Typography variant="subtitle1" component="span">
                {subTask.name}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}

export default SubTask;
