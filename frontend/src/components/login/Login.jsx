import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import AxiosInstance from "../api/AxiosInstance";
import "./Login.css";

import logoImg from "../assets/logo1.jpg";

const Login = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .max(15, "Password can't be longer than 15 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await AxiosInstance.post("/api/admin-login", values, {
          withCredentials: true,
        });
        if (res.status === 200) {
          localStorage.setItem("auth", "true");
          localStorage.setItem("userName", values.email);
          onLogin();
          navigate("/");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Login failed. Please try again.";
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    const isAuth = localStorage.getItem("auth");
    if (isAuth === "true") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <Grid container component="main" className="signup-container">
        <Grid item xs={false} sm={6} md={7} className="brand-container">
          <Box className="brand-content">
            {/* <Typography variant="h4">Welcome to</Typography> */}
            <p className="login-Invoice-header">
              <span>INVOICE</span>
              <br />
              GENERATE
            </p>

            <Typography variant="h6">Simplify Your Billing Process</Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={5}
          component={Box}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box className="form-box glassmorphism">
            <img
              src={logoImg}
              alt="hello tech logo"
              width="200px"
              className="mb-4"
            />
            <Typography
              component="h1"
              variant="h5"
              className="form-header fw-bold text-uppercase mt-3 ms-3"
              style={{ letterSpacing: "2px" }}
            >
              Sign In
            </Typography>
            <Box
              component="form"
              noValidate
              className="form-content"
              onSubmit={formik.handleSubmit}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="signup-button mt-3"
                sx={{ backgroundColor: "black", color: "white" }}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
