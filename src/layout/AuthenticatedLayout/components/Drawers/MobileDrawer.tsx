import { Drawer } from "@mui/material";
import React from "react";

type Props = {
  container?: (() => HTMLElement) | undefined;
  mobileOpen?: boolean;
  handleDrawerTransitionEnd?: () => void;
  drawerWidth?: number;
  handleDrawerClose?: () => void;
  children?: React.ReactNode;
};

const MobileDrawer = ({
  container,
  mobileOpen,
  handleDrawerTransitionEnd,
  drawerWidth,
  handleDrawerClose,
  children,
}: Props) => {
  return (
    <React.Fragment>
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "block", md: "none" },
          "& .MuiDrawer-paper": {
            MuiBoxSizing: "border-MuiBox",
            width: drawerWidth,
          },
        }}
      >
        {children}
      </Drawer>
    </React.Fragment>
  );
};

export default MobileDrawer;
