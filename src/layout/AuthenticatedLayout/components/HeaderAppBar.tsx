import React from "react";
import { AppBar,} from "@mui/material";


type Props = {
  handleDrawerToggle: () => void;
};
const drawerWidth = 240;

const HeaderAppBar = ({ handleDrawerToggle }: Props) => {
 

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
