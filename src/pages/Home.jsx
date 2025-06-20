import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext";

// Components
import AddTask from "../components/AddTask";
import TaskList from "../components/TaskList";
import NavBar from "../components/NavBar";
import NavBarBottom from "../components/NavBarBottom";
import SortByMenu from "../components/SortByMenu";

// Icons & MUI
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useMediaQuery, useTheme } from "@mui/material";
import {
  Container,
  Box,
  TextField,
  Stack,
  CircularProgress,
  Button,
  Modal,
  Fade,
  Backdrop,
  Typography,
} from "@mui/material";

function Home() {
  const { session } = UserAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [openAddTask, setOpenAddTask] = useState(false);
  const [sortType, setSortType] = useState();
  const [ascendingValue, setAscendingValue] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // sm = 600px and below


  // Navigate to login if not authenticated
  useEffect(() => {
    if (session === null) navigate("/login");
  }, [session, navigate]);

  // Fetch tasks when dependencies change
  useEffect(() => {
    if (session?.user?.id) fetchTasks();
  }, [session?.user?.id, sortType, ascendingValue, searchValue]);

  // Fetch task data from Supabase
  const fetchTasks = async () => {
    if (!session || !session.user) return;
    setLoading(true);

    try {
      let query = supabase
        .from("tasks")
        .select("*")
        .eq("userid", session.user.id)
        .filter("data->>taskStatus", "neq", "4");

      if (sortType === "inserted_at" || sortType === "updated_at") {
        query = query.order(sortType, { ascending: ascendingValue });
      }

      const { data, error } = await query;

      if (error) throw error;

      const filtered = data.filter((task) => {
        const { title = "", description = "", subTasks = [] } = task.data || {};
        return (
          title.toLowerCase().includes(searchValue) ||
          description.toLowerCase().includes(searchValue) ||
          subTasks.some(
            (sub) =>
              typeof sub === "string" &&
              sub.toLowerCase().includes(searchValue)
          )
        );
      });

      setTasks(filtered);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle sort option
  const handleSortChange = (type, ascending) => {
    setSortType(type);
    setAscendingValue(ascending);
  };

  // Handle search form
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchValue(search.toLowerCase());
  };

  // Modal controls
  const handleOpen = () => setOpenAddTask(true);
  const handleClose = () => setOpenAddTask(false);

  return (
    <>
      <Box sx={{
        width: "100%",
        background: "linear-gradient(to right, #f9f9f9, #e0f7fa)",
        display: "flex",
        height: "1000px"
      }}>

      <NavBar />

        <Container
          maxWidth="md"
          sx={{
            mt: 10,
            mb: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: -2
          }}
        >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : tasks.length > 0 ? (
          <>
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{ width: "100%", maxWidth: "700px" }}
            >
              
            <Stack direction="row" spacing={2} alignItems="center" sx={{ width: isMobile? "90%": "100%", mb: 2, bgcolor: "white", px: 2, py: 2, boxShadow: 5, borderRadius: 2, marginLeft: isMobile? 0: 0  }}>
              <TextField
                label="Search tasks"
                fullWidth
                size="medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ flexGrow: 1 }}
              />

              <SortByMenu onHandleSort={handleSortChange} />

              <Button
                type="submit"
                variant="contained"
                sx={{
                  minWidth: 0,
                  width: 90,
                  height: 52,
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SearchIcon />
              </Button>

              
            </Stack>
            <TaskList tasks={tasks} onTaskDeleted={fetchTasks} />

          </Box>
          </>

        ) : (
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            mt={5}
          >
            No tasks found. Try creating a new one or adjust your search.
          </Typography>
        )}
        
        <Modal
          open={openAddTask}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{ backdrop: { timeout: 500 } }}
        >
          <Fade in={openAddTask}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "90%", sm: 400 },
                p: 4,
                borderRadius: 10,
              }}
            >
              <AddTask
                onTaskAdded={() => {
                  fetchTasks();
                  handleClose();
                }}
              />
            </Box>
          </Fade>
        </Modal>
      </Container>

      <NavBarBottom onAddTaskClick={handleOpen} />
      
      </Box>
    </>
  );
}

export default Home;
