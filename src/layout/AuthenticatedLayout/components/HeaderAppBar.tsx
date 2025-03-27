import React, { useRef } from "react";
import { AppBar, IconButton, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HeaderNav from "./HeaderNav";

type Props = {
  handleDrawerToggle: () => void;
};
const drawerWidth = 240;

const HeaderAppBar = ({ handleDrawerToggle }: Props) => {
  const toolbarRef = useRef(null);

  return (
    <React.Fragment>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: "none",
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: "none",
        }}
      ></AppBar>
    </React.Fragment>
  );
};

export default HeaderAppBar;
