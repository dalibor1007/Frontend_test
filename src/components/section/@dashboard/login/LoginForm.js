import {
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import React, { useState, useContext } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../../context/authContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const handleShowPassword = () => {
    setShowPass((show) => !show);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(email, password);
      if (response.success) {
        toast.success("Successfully Signed!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        navigate("/dashboard/app");
      } else {
        toast.error(response.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (e) {
      toast.error("Authentication Failed!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          label="Email Address"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          name="password"
          type={showPass ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleShowPassword} edge="end">
                  {showPass ? <AiFillEye /> : <AiFillEyeInvisible />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <FormControlLabel
            control={<Checkbox checked={true} />}
            label="Remember me"
          />
          <Typography sx={{ fontWeight: "bold", cursor: "pointer" }}>
            <MuiLink href="#">Forgot password?</MuiLink>
          </Typography>
        </Stack>
        <Button fullWidth variant="contained" onClick={handleLoginSubmit}>
          Log in
        </Button>
        <Typography
          variant="body2"
          sx={{ display: { xs: "block", md: "none" } }}
        >
          Don't have an account?
          <Link
            to="/register"
            style={{ color: "#2AC56A", fontWeight: "bold", marginLeft: "8px" }}
          >
            Get Started
          </Link>
        </Typography>
      </Stack>
    </>
  );
};

export default LoginForm;
