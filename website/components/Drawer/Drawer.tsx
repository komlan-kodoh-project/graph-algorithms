import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export type DrawerProps = Readonly<{
  title: string;
  children: React.ReactNode;
}>;

export function Drawer({ children, title }: DrawerProps) {
  return (
    <Accordion
      disableGutters
      sx={{
        padding: 0,
        color: "#444",
        boxShadow: "none",
        margin: 0,
        backgroundColor: "transparent",
      }}
    >
      <AccordionSummary
        id="panel1-header"
        aria-controls="panel1-content"
        expandIcon={<ExpandMoreIcon />}
        sx={{
          height: "1em",
          margin: 0,
          padding: 0,
        }}
      >
        <h1 className="w-full">{title}</h1>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: "0.3em",
          paddingBottom: "1.2em",
        }}
      >
        {/* @ts-ignore */}
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
