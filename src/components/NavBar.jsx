
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

function NavBar(){

    return(
        <>
            <Button variant="text">
                <Link to="/">Home</Link>
            </Button>
            <Button variant="text">
                <Link to="/login">Logout</Link>
            </Button>

        </>

    )
}

export default NavBar;