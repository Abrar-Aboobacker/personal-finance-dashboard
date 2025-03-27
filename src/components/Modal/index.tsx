import { Box, Fade, Modal,  } from "@mui/material";
import React, { ReactNode } from "react";

type TProps = {
  isOpen?: boolean;
  children: ReactNode;
  onClose?: () => void;
  containerStyle?: React.CSSProperties;
  keepMounted?: boolean;
  handleClose?: () => void;
};

const CustomModal = ({
  isOpen,
  onClose,
  containerStyle,
  children,
  keepMounted,
  handleClose,
}: TProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      handleClose && handleClose();
    }
  };



 
  return (
    <Modal
      open={isOpen || false}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      keepMounted={keepMounted || false}
      sx={{ borderRadius: "10px" }}
    >
      <Fade in={isOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {xs:"90%",md:"70%",lg:600},
            bgcolor: "background.paper",
            outline: "none",
            borderRadius: "10px",
            ...containerStyle,
          }}
        >
          {children}
        </Box>
      </Fade>
    </Modal>
  );
};

export default CustomModal;
