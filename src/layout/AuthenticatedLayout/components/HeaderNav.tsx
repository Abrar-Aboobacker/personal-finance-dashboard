import React from "react";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// import userAvatar from "@/core/components/Avatar/userAvatar.png";
import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import auth from "../../../utils/auth";
import { USER_INFO } from "../../../constants/global";

type Props = {};

const HeaderNav = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const userInfo = auth.getUserInfo(USER_INFO);

  return (
    <React.Fragment>
      <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <Box>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-around"}
          >
            <IconButton
              onClick={handleClick}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar
                src={userInfo?.avatar}
                
                // placeholderSrc={userAvatar}
              />
            </IconButton>
            <Typography >
              Welcome Back,{" "}
              {userInfo?.address_data
                ? userInfo?.address_data?.business_name
                : userInfo?.full_name}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </React.Fragment>
  );
};

export default HeaderNav;
