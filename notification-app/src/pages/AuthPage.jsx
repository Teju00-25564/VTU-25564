import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { logInfo } from "../services/logger";

function AuthPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(true);
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [message, setMessage] = useState("");

  const registerUser = () => {
    if (!clientId.trim() || !clientSecret.trim()) {
      setMessage("Enter client id and client secret.");
      return;
    }

    localStorage.setItem(
      "notification_user",
      JSON.stringify({
        clientId,
        clientSecret
      })
    );

    logInfo("user_registered", { clientId });
    setMessage("Registration successful. Please login.");
    setClientId("");
    setClientSecret("");
    setIsRegister(false);
  };

  const loginUser = () => {
    const savedUser = JSON.parse(
      localStorage.getItem("notification_user") || "null"
    );

    if (!savedUser) {
      setMessage("Please register first.");
      return;
    }

    if (
      savedUser.clientId === clientId &&
      savedUser.clientSecret === clientSecret
    ) {
      logInfo("user_logged_in", { clientId });
      onLogin();
      return;
    }

    setMessage("Invalid client id or client secret.");
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <Paper elevation={3} sx={{ width: "100%", p: 3, borderRadius: 2 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                {isRegister ? "Registration" : "Login"}
              </Typography>
              <Typography color="text.secondary">
                Use client id and client secret to continue.
              </Typography>
            </Box>

            {message && <Alert severity="info">{message}</Alert>}

            <TextField
              label="Client ID"
              value={clientId}
              onChange={(event) => setClientId(event.target.value)}
              fullWidth
            />

            <TextField
              label="Client Secret"
              type="password"
              value={clientSecret}
              onChange={(event) => setClientSecret(event.target.value)}
              fullWidth
            />

            <Button
              variant="contained"
              size="large"
              onClick={isRegister ? registerUser : loginUser}
            >
              {isRegister ? "Register" : "Login"}
            </Button>

            <Button
              variant="text"
              onClick={() => {
                setMessage("");
                setIsRegister(!isRegister);
              }}
            >
              {isRegister ? "Go to Login" : "Go to Registration"}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}

export default AuthPage;
