import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import Task from "./Task";

function TaskList({ tasks, onTaskDeleted }) {
  const navigate = useNavigate();
  const { session } = UserAuth();

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2, // spacing between cards (theme spacing * 2)
        justifyContent: "center",
      }}
    >
      {tasks.map((task) => (
        <Box
          key={task.id}
          sx={{
            flex: "1 1 300px", // grow, shrink, basis
            maxWidth: 450,
            minWidth: 250,
          }}
        >
          <Task taskInfo={task} onTaskDeleted={onTaskDeleted} />
        </Box>
      ))}
    </Box>
  );
}

export default TaskList;
