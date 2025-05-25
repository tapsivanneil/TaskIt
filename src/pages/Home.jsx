import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext";
import AddTask from "../components/AddTask";
import TaskList from "../components/TaskList";
import NavBar from "../components/NavBar";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import SortByMenu from "../components/SortByMenu";
import SearchIcon from '@mui/icons-material/Search';
import NavBarBottom from "../components/NavBarBottom";

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
} from "@mui/material";

function Home() {
  const { session } = UserAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openAddTask, setOpenAddTask] = useState(false);
  const [sortType, setSortType] = useState();
  const [ascendingValue, setAscendingValue] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleOpen = () => setOpenAddTask(true);
  const handleClose = () => setOpenAddTask(false);

  useEffect(() => {
    if (session === null) {
      navigate("/login");
    }
  }, [session, navigate]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchTasks();
    }
  }, [session?.user?.id, sortType, ascendingValue, searchValue]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchValue(search.toLowerCase());
  };

  const fetchTasks = async () => {
    if (!session || !session.user) return;
    setLoading(true);

    try {
      let query = supabase
        .from("tasks")
        .select("*")
        .eq("userid", session.user.id);

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

  const handleSortChange = (sortType, ascendingValue) => {
    setSortType(sortType);
    console.log(sortType)
    setAscendingValue(ascendingValue)
  };


  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 10 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <div>
            <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 3 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <TextField
                    label="Search tasks"
                    fullWidth
                    size="medium"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ flexGrow: 1 }}
                  />

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

                  <SortByMenu onHandleSort={handleSortChange} />
                </Stack>

            </Box>
            <TaskList tasks={tasks} onTaskDeleted={fetchTasks} />
          </div>
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
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
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

      <Fab
        color="primary"
        aria-label="add"
        onClick={handleOpen}
        sx={{
          position: "fixed",
          bottom: "5%",
          right: "10%",
          transform: "translateX(-50%)",
          zIndex: 1300,
          width: 80,
          height: 80,
          fontSize: 32,
        }}
      >
        <AddIcon sx={{ fontSize: 36 }} />
      </Fab>

        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 600, // optional: controls the width of the bar
            zIndex: 1200,   // ensures it's above most other elements
          }}
        >
          {/* <NavBarBottom /> */}
        </Box>
    </>
  );
}

export default Home;
