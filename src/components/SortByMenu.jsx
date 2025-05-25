import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Fab } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';


export default function SortByMenu({ sort, onHandleSort }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const {sortBy, setSortBy} = React.useState(true)
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSort = (type) => {
    onHandleSort(type);  // Pass sort type back to parent
    handleClose();
  };

  return (
    <div>
      <Button
        id="sort-button"
        aria-controls={open ? 'sort-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <SortIcon />
      </Button>
      <Menu
        id="sort-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'sort-button',
        }}
      >
        <MenuItem onClick={() => onHandleSort("inserted_at", true)}>Date Ascending</MenuItem>
        <MenuItem onClick={() => onHandleSort("inserted_at", false)}>Date Descending</MenuItem>

      </Menu>
    </div>
  );
}
