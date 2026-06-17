import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Tab,
  Tabs,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme
} from "@mui/material";
import AuthPage from "./pages/AuthPage";
import AllNotifications from "./pages/AllNotifications";
import PriorityNotifications from "./pages/PriorityNotifications";
import { logInfo } from "./services/logger";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1f6feb"
    },
    background: {
      default: "#f6f8fa"
    }
  },
  shape: {
    borderRadius: 8
  }
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("notification_session") === "active"
  );
  const [page, setPage] = useState("all");

  const login = () => {
    localStorage.setItem("notification_session", "active");
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("notification_session");
    logInfo("user_logged_out");
    setIsLoggedIn(false);
    setPage("all");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {!isLoggedIn ? (
        <AuthPage onLogin={login} />
      ) : (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
          <AppBar position="static">
            <Toolbar sx={{ gap: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Notification App
              </Typography>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </Toolbar>
          </AppBar>

          <Container maxWidth="lg">
            <Tabs
              value={page}
              onChange={(event, value) => setPage(value)}
              sx={{ mt: 2, borderBottom: 1, borderColor: "divider" }}
            >
              <Tab value="all" label="All Notifications" />
              <Tab value="priority" label="Priority Notifications" />
            </Tabs>

            {page === "all" ? (
              <AllNotifications showPriority={() => setPage("priority")} />
            ) : (
              <PriorityNotifications showAll={() => setPage("all")} />
            )}
          </Container>
        </Box>
      )}
    </ThemeProvider>
  );
}

export default App;
