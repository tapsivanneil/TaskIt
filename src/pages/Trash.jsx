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
} from "@mui/material";

function Trash() {
  const { session } = UserAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openAddTask, setOpenAddTask] = useState(false);
  const [sortType, setSortType] = useState();
  const [ascendingValue, setAscendingValue] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // sm = 600px and below

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

//   console.log(session.user.id)

  const fetchTasks = async () => {
    if (!session || !session.user) return;
    setLoading(true);

    try {
      let query = supabase
        .from("tasks")
        .select("*")
        .eq("userid", session.user.id)
        .filter("data->>taskStatus", "eq", "4");

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
        
    <Box sx={{
    width: "100%",
    background: "linear-gradient(to right, #f9f9f9, #e0f7fa)",
    display: "flex",

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
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <div>
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
                p: 4,
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

export default Trash;
