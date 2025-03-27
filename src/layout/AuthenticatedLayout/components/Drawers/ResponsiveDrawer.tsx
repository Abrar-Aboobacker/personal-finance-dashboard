import React from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
// import HeaderAppBar from "../HeaderAppBar";
import MobileDrawer from "./MobileDrawer";
import DesktopDrawer from "./DesktopDrawer";
import DrawerContent from "./DrawerContent";
import HeaderAppBar from "../HeaderAppBar";

// Define the drawer width
const drawerWidth = 300;

interface Props {
  /**
   * Optional function to retrieve the window object.
   * Remove this when copying and pasting into your project.
   */

  window?: () => Window;
}

const ResponsiveDrawer: React.FC<Props> = (props: Props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  // Handle drawer close action
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  // Reset isClosing state after drawer transition ends
  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  // Toggle drawer open/close state
  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  // Drawer content with AppLogo and menu items

  // Container for the drawer, used for mobile view
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Header AppBar */}
      <HeaderAppBar handleDrawerToggle={handleDrawerToggle} />

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mail folders"
      >
        {/* Mobile drawer */}
        <MobileDrawer
          container={container}
          drawerWidth={drawerWidth}
          handleDrawerClose={handleDrawerClose}
          handleDrawerTransitionEnd={handleDrawerTransitionEnd}
          mobileOpen={mobileOpen}
        >
          <DrawerContent drawerWidth={drawerWidth} />
        </MobileDrawer>
        {/* Desktop drawer */}
        <DesktopDrawer drawerWidth={drawerWidth}>
          <DrawerContent drawerWidth={drawerWidth} />
        </DesktopDrawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />

        <Outlet />
      </Box>
    </Box>
  );
};

export default ResponsiveDrawer;
