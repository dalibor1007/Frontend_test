import { Box, Button, Divider, styled, Typography } from "@mui/material";
import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
const Header = styled("header")(() => ({
  height: "70px",
}));

const AccountEl = () => {
  const { logout } = useContext(AuthContext);

  return (
    <Box sx={{ width: 300, p: 2 }}>
      <Header>
        <Typography variant="h6">Dalibor Stefanovic</Typography>
        <Typography variant="subtitle1">dalibor@gmail.com</Typography>
      </Header>
      <Divider />
      <Box sx={{ pt: 1 }}>
        <Button fullWidth variant="outlined" onClick={logout}>
          Log out
        </Button>
      </Box>
    </Box>
  );
};

export default AccountEl;
