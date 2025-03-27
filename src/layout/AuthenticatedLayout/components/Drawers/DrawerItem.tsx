import React, { useEffect, useRef } from "react";
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import CircleIcon from "@mui/icons-material/Circle";
import { useLocation, useNavigate } from "react-router-dom";
import { IWholeMenuProps } from "../../data";

type Props = {
  item: IWholeMenuProps;
};

const DrawerItem = ({ item }: Props) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const IconComponent = item.icon;
  const [open, setOpen] = React.useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const isActiveLocation = (route: string) => location.pathname === `/${route}`;
  const isMainActive = isActiveLocation(item.route ?? "");
  const isSubActive =
    item.menus?.some((subItem:any) => isActiveLocation(subItem.route ?? "")) ??
    false;

  useEffect(() => {
    if (isSubActive) {
      setOpen(true);
    }
  }, [isSubActive]);

  const handleClick = () => {
    if (item.menus && item.menus?.length > 0) {
      setOpen((prevOpen) => !prevOpen);
    } else {
      navigate(`/${item.route}`);
    }
  };

  const handleSubItemClick = (route: string) => {
    navigate(`/${route}`);
  };

  const renderSubItems = () =>
    item.menus?.map((subItem) => {
      const isActive = isActiveLocation(subItem.route ?? "");
      return (
        <ListItemButton
          onClick={() => handleSubItemClick(subItem.route ?? "")}
          key={subItem.id}
          sx={{
            pl: "40px",
            borderRadius: "10px",
            // backgroundColor: isActive ? theme.palette.dark.light : "none",
          }}
        >
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <CircleIcon
              style={{ fontSize: "0.3em", color: isActive ? "#000" : "#888" }}
            />
          </ListItemIcon>
          <ListItemText
            primary={subItem.title}
            primaryTypographyProps={{
              fontSize: "0.8em",
              fontWeight: "bold",
              // color: isActive ? theme.palette.dark.contrastText : "#888",
            }}
          />
        </ListItemButton>
      );
    });

  return (
    <>
      <ListItem
        key={item.id}
        disablePadding
        sx={{
          margin: "8px 5px",
          borderRadius: "20px",
          backgroundColor:
            isMainActive || isSubActive ? theme.palette.secondary.main : "",
        }}
      >
        <ListItemButton onClick={handleClick}>
          <ListItemIcon
            sx={{
              minWidth: "30px",
            }}
          >
            <IconComponent
              style={{
                fontSize: "1em",
                color:
                  isMainActive || isSubActive
                    ? theme.palette.secondary.contrastText
                    : "#000",
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary={item.title}
            primaryTypographyProps={{
              fontSize: "0.8em",
              fontWeight: "bold",
              color:
                isMainActive || isSubActive
                  ? theme.palette.secondary.contrastText
                  : "#000",
            }}
          />
          {item?.menus && item?.menus?.length > 0 && (
            <ListItemIcon sx={{ minWidth: "30px" }}>
              {open ? (
                <ExpandLess
                  sx={{
                    color:
                      isMainActive || isSubActive
                        ? theme.palette.secondary.contrastText
                        : "#000",
                  }}
                />
              ) : (
                <ExpandMore
                  sx={{
                    color:
                      isMainActive || isSubActive
                        ? theme.palette.secondary.contrastText
                        : "#000",
                  }}
                />
              )}
            </ListItemIcon>
          )}
        </ListItemButton>
      </ListItem>
      {item?.menus && item?.menus?.length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding ref={drawerRef}>
            {renderSubItems()}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default DrawerItem;
