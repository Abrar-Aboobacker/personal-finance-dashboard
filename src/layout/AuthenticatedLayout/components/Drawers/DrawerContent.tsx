import React from "react";
import { Box, List, Toolbar, useTheme } from "@mui/material";

import DrawerItem from "./DrawerItem";
import { wholeMenu } from "../../data";


export interface Props {
  drawerWidth: number;
}

const DrawerContent: React.FC<Props> = ({ drawerWidth }) => {
  const theme = useTheme();

  return (
    <Box>
      <Toolbar
        style={{
          position: "sticky",
          background: theme.palette.background.paper,
          top: "0",
          zIndex: "99",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {/* <AppLogo /> */}
      </Toolbar>
      <List
        style={{
          padding: "0px  10px",
          height: "calc(70vh - 10px)",
          marginBottom: "100px",
        }}
      >
        {wholeMenu.map((item, index) => (
          <DrawerItem item={item} key={index} />
        ))}
      </List>
      <Toolbar
        style={{
          position: "sticky",
          width: drawerWidth,
          background: theme.palette.background.paper,
          bottom: "0",
          zIndex: "99",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          WebkitBoxShadow: "-1px -9px 6px -3px rgba(219,219,219,0.32)",
          MozBoxShadow: "-1px -9px 6px -3px rgba(219,219,219,0.32)",
          boxShadow: "-1px -9px 6px -3px rgba(219,219,219,0.32)",
        }}
      >
        {/* <Logout /> */}
      </Toolbar>
    </Box>
  );
};

export default DrawerContent;
