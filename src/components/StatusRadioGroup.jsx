import React from "react";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked"; // todo
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"; // in-progress
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // completed

const statusOptions = [
  { label: "Todo", value: "todo", icon: <RadioButtonUncheckedIcon /> },
  { label: "In Progress", value: "in-progress", icon: <HourglassEmptyIcon /> },
  { label: "Completed", value: "completed", icon: <CheckCircleIcon /> },
];

export default function StatusRadioGroup({ subTask, status, onStatusChange }) {
  return (
    <ButtonGroup size="small" aria-label="status button group">
      {statusOptions.map(({ label, value, icon }) => (
        <Tooltip key={value} title={label}>
          <Button
            onClick={() => onStatusChange(subTask.id, value)}
            variant={status === value ? "contained" : "outlined"}
            color={status === value ? "primary" : "inherit"}
            startIcon={icon}
          >
           
            {/* {label} */}
          </Button>
        </Tooltip>
      ))}
    </ButtonGroup>
  );
}
