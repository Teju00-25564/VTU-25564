import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from "@mui/material";
import { fetchNotifications } from "../services/notificationsApi";
import { getPriorityScore, sortByPriority } from "../utils/notificationScore";

const notificationTypes = ["All", "Event", "Result", "Placement"];
const topOptions = [5, 10, 15, 20];

function PriorityNotifications({ showAll }) {
  const [notifications, setNotifications] = useState([]);
  const [topLimit, setTopLimit] = useState(10);
  const [notificationType, setNotificationType] = useState("All");
  const [loading, setLoading] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);

      const result = await fetchNotifications({
        limit: topLimit,
        page: 1,
        notificationType
      });

      setNotifications(sortByPriority(result.notifications).slice(0, topLimit));
      setUsedFallback(result.usedFallback);
      setLoading(false);
    };

    loadNotifications();
  }, [topLimit, notificationType]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "space-between",
            flexWrap: "wrap"
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Priority Notifications
            </Typography>
            <Typography color="text.secondary">
              Highest priority notifications are shown first.
            </Typography>
          </Box>

          <Button variant="contained" onClick={showAll}>
            All Notifications
          </Button>
        </Box>

        {usedFallback && (
          <Alert severity="warning">
            API is unavailable, showing saved sample notifications.
          </Alert>
        )}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              value={notificationType}
              onChange={(event) => setNotificationType(event.target.value)}
            >
              {notificationTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Top N</InputLabel>
            <Select
              label="Top N"
              value={topLimit}
              onChange={(event) => setTopLimit(event.target.value)}
            >
              {topOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  Top {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2}>
            {notifications.map((notification) => (
              <Card key={notification.id} variant="outlined">
                <CardContent>
                  <Stack spacing={1.5}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      justifyContent="space-between"
                    >
                      <Typography variant="h6">
                        {notification.type}: {notification.message}
                      </Typography>
                      <Chip
                        color="primary"
                        label={`Score ${getPriorityScore(notification.type)}`}
                        size="small"
                      />
                    </Stack>

                    <Typography color="text.secondary">
                      {notification.timestamp}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

export default PriorityNotifications;
