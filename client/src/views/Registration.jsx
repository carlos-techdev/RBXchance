import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink as Link } from "react-router-dom";

// Imports for isAuthenticated
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter, Redirect } from "react-router-dom";

// REcaptcha for Login & Register
import ReCAPTCHA from "react-google-recaptcha";

// API Services
import { tryLoginUser, tryRegisterUser, RECAPTCHA_SITE_KEY, tryForgotPassword, tryResetPassword } from "../services/api.service";

// notification
import { useToasts } from "react-toast-notifications";

// MUI Containers
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grow from '@material-ui/core/Grow';

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from "@material-ui/core/Input";
import IconButton from "@material-ui/core/IconButton";
import { useEffect } from "react";

// Custom Styles
const useStyles = makeStyles(theme => ({
  inputs: {
    display: "flex",
    flexDirection: "column",
    height: "10rem",
    justifyContent: "space-around",
    fontFamily: "Rubik",
    fontWeight: "500",
    marginTop: "85px",
    color: "#e0e0e0",
    "& > div": {
      "& label": {
        color: "#e0e0e0",
        fontFamily: "Rubik",
        fontSize: "14px",
        fontWeight: 300,
        letterSpacing: ".1em",
      },
      "& label.Mui-focused": {
        color: "#e0e0e0",
        fontFamily: "Rubik",
        fontWeight: "300",
      },
      "& .MuiInput-underline:after": {
        border: "2px solid #3d5564",
        fontFamily: "Rubik",
        fontWeight: "300",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          border: "2px solid #3d5564",
          fontFamily: "Rubik",
          fontWeight: "300",
        },
        "&:hover fieldset": {
          border: "2px solid #3d5564",
          fontFamily: "Rubik",
          fontWeight: "300",
        },
        "&.Mui-focused fieldset": {
          border: "2px solid #3d5564",
          fontFamily: "Rubik",
          fontWeight: "300",
        },
      },
      "& .MuiInput-root": {
        border: "2px solid #3d5564",
        fontFamily: "Rubik",
        fontWeight: "300",
      },
      "&.MuiInputBase-root": {
        border: "2px solid #3d5564",
        borderRadius: "6px",
        marginBottom: "10px",
        color: "#e0e0e0",
        fontFamily: "Rubik",
        fontWeight: "300",
        padding: "10px 10px",
        "& > div > input": {
          color: "#e0e0e0",
          fontFamily: "Rubik",
          fontWeight: "300",
        },
      },
      "& > div > input": {
        color: "#e0e0e0",
        fontFamily: "Rubik",
        fontWeight: "300",
      },
    },
    "& > div > div": {
      background: "#12171D !important",
      color: "#e0e0e0",
      fontFamily: "Rubik",
      fontWeight: "300",
      marginBottom: "10px",
      borderRadius: "6px",
    },
  },
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "50rem",
    padding: "2rem 0",
    [theme.breakpoints.down("xs")]: {
      minHeight: "1rem",
    },
    [theme.breakpoints.down("sm")]: {
      minHeight: "1rem",
    },
    [theme.breakpoints.down("md")]: {
      minHeight: "1rem",
    },
  },
  lastupdate: {
    color: "#5f6368",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
  },
  counterup: {
    color: "#9d9d9d",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
  },
  buttonregister: {
    color: "#ffffff",
    width: "40%",
    fontSize: "13px",
    background: "#707479",
    fontFamily: "Rubik",
    fontWeight: "500",
    letterSpacing: ".02em",
    "&:hover": {
      opacity: "0.9",
      background: "#707479",
    },
  },
  buttonlogin: {
    color: "#ffffff",
    width: "40%",
    fontSize: "13px",
    background: "#FFC440",
    fontFamily: "Rubik",
    fontWeight: "500",
    letterSpacing: ".02em",
    "&:hover": {
      opacity: "0.9",
      background: "#FFC440",
    },
  },
  sectionOR: {
    maxWidth: "200px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifySelf: "center",
    "& p": {
      width: "100%",
      textAlign: "center",
      borderBottom: "1px solid #636567",
      lineHeight: "0.1em",
      margin: "10px 0 20px",
    },
    "& p span": {
      background: "#0D1116",
      padding: "0 10px",
    },
  },
  steam: {
    fontFamily: "Rubik",
    textTransform: "capitalize",
    background: "#3d5564",
    color: "white",
    marginLeft: "auto",
    marginTop: "20px",
    marginBottom: "10px",
    "&:hover": {
      opacity: "0.9",
      background: "#3d5564",
    },
  },
  google: {
    fontFamily: "Rubik",
    textTransform: "capitalize",
    marginLeft: "10px",
    marginTop: "10px",
    background: "#3d5564",
    color: "white",
    "&:hover": {
      opacity: "0.9",
      background: "#3d5564",
    },
  },
  noLink: {
    textDecoration: "none",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: "600px",
    color: "#5f6368",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
    [theme.breakpoints.down("xs")]: {
      padding: "0px 30px 0px 30px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "0px 30px 0px 30px",
    },
    [theme.breakpoints.down("md")]: {
      padding: "0px 30px 0px 30px",
    },
    "& img": {
      width: "5rem",
      marginBottom: "1rem",
    },
    "& h1": {
      // fontSize: 50,
      margin: "0 0 2rem 0",
      color: "#b9b9b9",
      fontFamily: "Rubik",
      fontSize: "19px",
      fontWeight: 500,
      letterSpacing: ".005em",
    },
    "& b": {
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "16px",
      fontWeight: 500,
      letterSpacing: ".005em",
    },
  },
}));

const Registration = ({ isAuthenticated }) => {
  // Declare State
  const classes = useStyles();

  const { addToast } = useToasts();

  const [isLoginFields, setLoginFields] = useState(true);

  // forgot password system
  const [forgotPassword, setForgotPassword] = useState(false);
  const [FGEmail, setFGEmail] = useState("");
  const [FGCode, setFGCode] = useState("");
  const [FGPassword, setFGPassword] = useState("");
  const [FGConfirmPassword, setFGConfirmPassword] = useState("");
  const [FGInput, setFGInput] = useState(false);
  const [FGPasswordInputs, setFGPasswordInputs] = useState(false);
  const [clickedBtn, setClickedBtn] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");

  // REcaptcha
  const [reCaptcha, setReCaptcha] = useState(null);
  const [sent, setSent] = useState(true);

  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // get query for forgot password
  useEffect(() => {
    if (window.location.search.indexOf("email=") === -1) return;
    let searchParams = window.location.search.split("?")[1].split("&");
    setForgotPassword(true);
    setFGInput(true);
    setFGPasswordInputs(true);
    searchParams.forEach(i => {
      let key = i.split("=")[0];
      let value = i.split("=")[1];

      switch (key) {
        default:
          break;
        case "email":
          setFGEmail(value);
          break;
        case "code":
          setFGCode(value);
          break;
      }
    });
  }, [addToast]);

  // Redirect if logged in
  if (isAuthenticated) return <Redirect to="/" />;

  // Forgot password inputs
  const onChangeFGEmail = e => {
    setFGEmail(e.target.value);
  };

  const onChangeFGCode = e => {
    setFGCode(e.target.value);
    if (e.target.value.length > 0) setFGPasswordInputs(true);
    else setFGPasswordInputs(false);
  };

  const onChangeFGPassword = e => {
    setFGPassword(e.target.value);
  };

  const onChangeFGConfirmPassword = e => {
    setFGConfirmPassword(e.target.value);
  };

  const resetForgotPassword = () => {
    setForgotPassword(false);
    setFGInput(false);
    setFGPasswordInputs(false);
    setFGEmail("");
    setFGCode("");
    setFGPassword("");
    setFGConfirmPassword("");
  };

  const onClickFGBtn = async () => {
    if (clickedBtn) return addToast("Please wait until you receive a response!", { appearance: "error" });
    setClickedBtn(true);
    if (FGInput && FGPasswordInputs) {
      if (FGPassword !== FGConfirmPassword) return [addToast("The passwords are not equal!", { appearance: "error" }), setClickedBtn(false)];
      let resp = await tryResetPassword(FGEmail, FGCode, FGPassword, reCaptcha);
      if (resp.recaptcha) resetCaptcha();
      if (resp.code) {
        setFGInput(false);
        setFGPasswordInputs(false);
        setFGCode("");
      }
      if (resp.error) return [addToast(resp.error, { appearance: "error" }), setClickedBtn(false)];
      addToast("You have successfully reset your password, try login in!", { appearance: "success" });
      resetForgotPassword();
      resetCaptcha();
      setClickedBtn(false);
      return;
    }
    let resp = await tryForgotPassword(FGEmail, reCaptcha);
    if (resp.recaptcha) resetCaptcha();
    if (resp.error) return [addToast(resp.error, { appearance: "error" }), setClickedBtn(false)];
    addToast("We've sent you an email containing the security code to reset your password!", { appearance: "success" });
    setFGInput(true);
    setClickedBtn(false);
  };

  // Input onChange event handler
  const onChangeUsername = e => {
    setUsername(e.target.value);
  };
  const onChangePassword = e => {
    setPassword(e.target.value);
  };
  const onChangePassword2 = e => {
    setPassword2(e.target.value);
  };
  const onChangeEmail = e => {
    setEmail(e.target.value);
  };

  // ReCAPTCHA onChange event handler
  const reCaptchaOnChange = value => {
    // Update state
    setReCaptcha(value);
  };

  // reset
  const resetCaptcha = () => {
    setSent(false);
    setSent(true);
  };

  // Goto on clicks

  const onClickGotoLogin = e => {
    setLoginFields(true);
    setForgotPassword(false);
    setFGInput(false);
    setFGPasswordInputs(false);
    emptyFields();
  };
  const onClickGotoRegister = e => {
    setLoginFields(false);
    emptyFields();
  };

  // On click - API endpoints

  const onClickRegister = async e => {
    if (password !== password2) return addToast("The passwords are not equal!", { appearance: "error" });
    let resp = await tryRegisterUser(username, password, email, reCaptcha);
    if (resp.recaptcha) resetCaptcha();
    if (resp.error) return addToast(resp.error, { appearance: "error" });
    addToast("You've successfully registered an account!", { appearance: "success" });
    setTimeout(() => {
      window.location.href = resp.redirect;
    }, 1000);
  };

  const onClickLogin = async e => {
    let resp = await tryLoginUser(email, password, reCaptcha);
    if (resp.recaptcha) resetCaptcha();
    if (resp.error) return addToast(resp.error, { appearance: "error" });
    if (resp.redirect) {
      addToast("You've been successfully logged in!", { appearance: "success" });
      setTimeout(() => {
        window.location.href = resp.redirect;
      }, 1000);
    }
  };

  // Empty fields
  const emptyFields = () => {
    setUsername("");
    setPassword("");
    setPassword2("");
    setEmail("");
  };

  return (
    <Box className={classes.root}>
      <Grow in timeout={330}>
        {!isLoginFields && !forgotPassword ? (
          <Container className={classes.container}>
            <Box className={classes.inputs}>
              <span style={{ color: "#e0e0e0", fontSize: "20px", fontFamily: "Rubik", marginLeft: "3px", }}>Create an Account</span>
              <br />
              <TextField
                name="email"
                type="email"
                variant="outlined"
                placeholder="Email*"
                onChange={onChangeEmail}
                value={email}
              />
              <TextField
                name="username"
                variant="outlined"
                placeholder="Username*"
                onChange={onChangeUsername}
                value={username}
              />
              <Input
                disableUnderline={true}
                name="password"
                type={values.showPassword ? "text" : "password"}
                variant="outlined"
                placeholder="Password*"
                onChange={onChangePassword}
                value={password}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      style={{ marginTop: "11px", color: "rgb(203 198 198)", }}
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <TextField
                name="password2"
                type="password"
                variant="outlined"
                placeholder="Repeat Password*"
                onChange={onChangePassword2}
                value={password2}
              />
            </Box>
            <br />
            <br />
            <br />
            <br />
            {sent ? <ReCAPTCHA
              style={{
                marginTop: "5rem"
              }}
              className={classes.captcha}
              onChange={reCaptchaOnChange}
              sitekey={RECAPTCHA_SITE_KEY}
            /> : null}
            <p style={{ marginTop: "25px", }}>I agree and understand the <Link style={{ textDecoration: "none", color: "rgb(203 203 203)", }} to="/terms">Terms & Conditions*</Link></p>
            <br />
            <Button
              size="medium"
              color="primary"
              className={classes.buttonlogin}
              variant="contained"
              onClick={onClickRegister}
            >
              <span>Play Now</span>
            </Button>
            <br />
            {/*<Box className={classes.sectionOR}>
              <p><span>OR</span></p>
            </Box>
            <div style={{ marginTop: "-10px", }}>
              <Link to="/login/steam" className={classes.noLink}>
                <Button className={classes.steam} variant="contained">
                  <i
                    style={{ marginRight: 5, fontSize: 15 }}
                    className="fab fa-steam-symbol"
                  ></i>
                </Button>
              </Link>
              <Link to="/login/google" className={classes.noLink}>
                <Button className={classes.google} variant="contained">
                  <i
                    style={{ marginRight: 5, fontSize: 15 }}
                    className="fab fa-google"
                  ></i>
                </Button>
              </Link>
            </div>*/}
            <br />
            <span>Already have an account?
              <span
                onClick={onClickGotoLogin}
                style={{ color: "rgb(203 203 203)", cursor: "pointer", marginLeft: "5px", }}
              >
                Sign in
              </span>
            </span>
            <br /><br />
            <span>
              rbxchance is protected by reCaptcha.
              <b><span style={{ fontSize: "13px", cursor: "pointer", }}> <a style={{ textDecoration: "none", color: "rgb(112 116 121)", }} href="https://policies.google.com/privacy?hl=en-GB" target="_blank" rel="noreferrer">Privacy Policy</a></span></b> and <b><span style={{ fontSize: "13px", cursor: "pointer", }}> <a style={{ textDecoration: "none", color: "rgb(112 116 121)", }} href="https://policies.google.com/terms?hl=en-GB" target="_blank" rel="noreferrer">Terms of Service</a></span></b> apply.
            </span>
            <br />
          </Container>
        ) : (
          isLoginFields && !forgotPassword ? (
            <Container className={classes.container}>
              <Box className={classes.inputs}>
                <span style={{ color: "#e0e0e0", fontSize: "20px", fontFamily: "Rubik", marginLeft: "3px", }}>Sign In</span>
                <br />
                <TextField
                  name="email"
                  variant="outlined"
                  placeholder="Email*"
                  onChange={onChangeEmail}
                  value={email}
                />
                <Input
                  disableUnderline={true}
                  name="password"
                  type={values.showPassword ? "text" : "password"}
                  variant="outlined"
                  placeholder="Password*"
                  onChange={onChangePassword}
                  value={password}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        style={{ marginTop: "11px", color: "rgb(203 198 198)", }}
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <br /><br />
              </Box>
              {sent ? <ReCAPTCHA
                className={classes.captcha}
                onChange={reCaptchaOnChange}
                sitekey={RECAPTCHA_SITE_KEY}
              /> : null}
              <br />
              <Button
                size="medium"
                color="primary"
                className={classes.buttonlogin}
                variant="contained"
                onClick={onClickLogin}
              >
                <span>Sign In</span>
              </Button>
              <br />
              {/*<Box className={classes.sectionOR}>
                <p><span>OR</span></p>
              </Box>
              <div style={{ marginTop: "-10px", }}>
                <Link to="/login/steam" className={classes.noLink}>
                  <Button className={classes.steam} variant="contained">
                    <i
                      style={{ marginRight: 5, fontSize: 15 }}
                      className="fab fa-steam-symbol"
                    ></i>
                  </Button>
                </Link>
                <Link to="/login/google" className={classes.noLink}>
                  <Button className={classes.google} variant="contained">
                    <i
                      style={{ marginRight: 5, fontSize: 15 }}
                      className="fab fa-google"
                    ></i>
                  </Button>
                </Link>
              </div>*/}
              <br />
              <p><span onClick={() => { setForgotPassword(true) }} style={{ textDecoration: "none", color: "rgb(203 203 203)", cursor: "pointer", }}>Forgot Password</span></p>
              <span>Don’t have an account?
                <span
                  onClick={onClickGotoRegister}
                  style={{ color: "rgb(203 203 203)", cursor: "pointer", marginLeft: "5px", }}
                >
                  Register an Account
                </span>
              </span>
              <br /><br />
              <span>
                rbxchance is protected by reCaptcha.
                <b><span style={{ fontSize: "13px", cursor: "pointer", }}> <a style={{ textDecoration: "none", color: "rgb(112 116 121)", }} href="https://policies.google.com/privacy?hl=en-GB" target="_blank" rel="noreferrer">Privacy Policy</a></span></b> and <b><span style={{ fontSize: "13px", cursor: "pointer", }}> <a style={{ textDecoration: "none", color: "rgb(112 116 121)", }} href="https://policies.google.com/terms?hl=en-GB" target="_blank" rel="noreferrer">Terms of Service</a></span></b> apply.
              </span>
              <br />
            </Container>
          ) : (
            <Container className={classes.container}>
              <Box className={classes.inputs}>
                <span style={{ color: "#e0e0e0", fontSize: "20px", fontFamily: "Rubik", marginLeft: "3px", marginBottom: "15px", }}>Password Recovery</span>
                <TextField
                  name="email"
                  variant="outlined"
                  placeholder="Email*"
                  onChange={onChangeFGEmail}
                  value={FGEmail}
                />
                {
                  FGInput ? (
                    <TextField
                      name="security_code"
                      type="text"
                      variant="outlined"
                      placeholder="Security Token"
                      onChange={onChangeFGCode}
                      value={FGCode}
                    />
                  ) : null
                }
                {
                  FGInput && FGPasswordInputs ?
                    (
                      <Input
                        disableUnderline={true}
                        name="password"
                        type={values.showPassword ? "text" : "password"}
                        variant="outlined"
                        placeholder="New Password*"
                        onChange={onChangeFGPassword}
                        value={FGPassword}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              style={{ marginTop: "11px", color: "rgb(203 198 198)", }}
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {values.showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    )
                    : null
                }
                {
                  FGInput && FGPasswordInputs ?
                    (
                      <TextField
                        name="confirm_password"
                        type="password"
                        variant="outlined"
                        placeholder="Confirm Password"
                        onChange={onChangeFGConfirmPassword}
                        value={FGConfirmPassword}
                      />
                    )
                    : null
                }
              </Box>
              {sent ? <ReCAPTCHA
                className={classes.captcha}
                style={FGInput && FGPasswordInputs ? { marginTop: "100px", } : { marginTop: "25px", }}
                onChange={reCaptchaOnChange}
                sitekey={RECAPTCHA_SITE_KEY}
              /> : null}
              <br />
              <Button
                size="medium"
                color="primary"
                className={classes.buttonlogin}
                variant="contained"
                onClick={onClickFGBtn}
              >
                <span>{FGInput && FGPasswordInputs ? "Reset Password" : "Recover Password"}</span>
              </Button>
              <br /><br />
              <span>Remember your password?
                <span
                  onClick={onClickGotoLogin}
                  style={{ color: "rgb(203 203 203)", cursor: "pointer", marginLeft: "5px", }}
                >
                  Sign in
                </span>
              </span>
            </Container>
          )
        )}
      </Grow>
    </Box >
  );
};

Registration.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(withRouter(Registration));