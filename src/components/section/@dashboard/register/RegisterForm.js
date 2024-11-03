import {
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../../context/authContext";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterForm = () => {
  const [showPass, setShowPass] = useState(false);
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
  }, []);

  const handleShowPassword = () => {
    setShowPass((show) => !show);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    const response = await register(username, email, password);
    if (response.success) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUsername("");
      toast.success("Successfully registered. Please Log in.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      navigate("/login");
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
  };

  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row">
          <TextField
            label="Enter username"
            fullWidth
            name="userName"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Stack>
        <TextField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPass ? "text" : "password"}
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
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type={showPass ? "text" : "password"}
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
        <Button fullWidth variant="contained" onClick={handleRegisterSubmit}>
          Register
        </Button>
        <Typography
          variant="body2"
          sx={{ display: { xs: "block", md: "none" } }}
        >
          Already have an account?
          <Link
            to="/login"
            style={{ color: "#2AC56A", fontWeight: "bold", marginLeft: "8px" }}
          >
            Login
          </Link>
        </Typography>
      </Stack>
    </>
  );
};

export default RegisterForm;
