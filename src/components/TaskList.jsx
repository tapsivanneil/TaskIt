import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import Task from "./Task";
import TasklistFormat from "./TasklistFormat";
import { useMediaQuery, useTheme } from "@mui/material";

function TaskList({ tasks, onTaskDeleted }) {
  const navigate = useNavigate();
  const { session } = UserAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // sm = 600px and below

  return (
    <>
  
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row", // column for mobile, row for desktop
          flexWrap: isMobile ? "nowrap" : "wrap",     // no wrapping on mobile
          justifyContent: isMobile ? "center" : "flex-start",
          alignItems: isMobile ? "center" : "stretch",
          marginBottom: 20
        }}
      >
        {tasks.map((task) => (
          <Box
            key={task.id}
            sx={{
              flex: isMobile ? "1 1 auto" : "1 1 100%", // full width row on desktop
              minWidth: isMobile ? 370 : 370,
              width: isMobile ? "100%" : "auto",
              margin: 'auto',
              marginBottom: 2
            }}
          >
            {isMobile ? (
              <Task taskInfo={task} onTaskDeleted={onTaskDeleted} />
            ) : (
              <TasklistFormat taskInfo={task} onTaskDeleted={onTaskDeleted} />
            )}
          </Box>
        ))}
      </Box>

      <Box sx={{marginBottom: "20px", height: 20}}>
        
      </Box>  
    </>


  );

}

export default TaskList;
