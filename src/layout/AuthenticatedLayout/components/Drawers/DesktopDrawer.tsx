import React, { useRef } from "react";
import { Drawer } from "@mui/material";

type Props = {
  drawerWidth: number;
  children: React.ReactNode;
};

const DesktopDrawer = ({ drawerWidth, children }: Props) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  return (
    <React.Fragment>
      <Drawer
        variant="permanent"
        PaperProps={{
          ref: drawerRef,
          sx: {
            borderRight: "none",
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        sx={{
          display: { xs: "none", sm: "none", md: "block" },
          width: drawerWidth,
        }}
        open
      >
        {children}
      </Drawer>
    </React.Fragment>
  );
};

export default DesktopDrawer;
