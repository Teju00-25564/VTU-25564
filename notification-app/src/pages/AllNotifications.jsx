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
import { logInfo } from "../services/logger";

const notificationTypes = ["All", "Event", "Result", "Placement"];
const limitOptions = [5, 10, 15, 20];

function AllNotifications({ showPriority }) {
  const [notifications, setNotifications] = useState([]);
  const [viewedIds, setViewedIds] = useState(() =>
    JSON.parse(localStorage.getItem("viewed_notifications") || "[]")
  );
  const [notificationType, setNotificationType] = useState("All");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);

      const result = await fetchNotifications({
        limit,
        page,
        notificationType
      });

      setNotifications(result.notifications);
      setUsedFallback(result.usedFallback);
      setLoading(false);
    };

    loadNotifications();
  }, [limit, page, notificationType]);

  const markAsViewed = (id) => {
    const updatedViewedIds = [...new Set([...viewedIds, id])];

    setViewedIds(updatedViewedIds);
    localStorage.setItem(
      "viewed_notifications",
      JSON.stringify(updatedViewedIds)
    );
    logInfo("notification_marked_viewed", { id });
  };

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
              All Notifications
            </Typography>
            <Typography color="text.secondary">
              Review notifications and mark important items as viewed.
            </Typography>
          </Box>

          <Button variant="contained" onClick={showPriority}>
            Priority Notifications
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
              onChange={(event) => {
                setNotificationType(event.target.value);
                setPage(1);
              }}
            >
              {notificationTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Limit</InputLabel>
            <Select
              label="Limit"
              value={limit}
              onChange={(event) => {
                setLimit(event.target.value);
                setPage(1);
              }}
            >
              {limitOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
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
            {notifications.map((notification) => {
              const isViewed = viewedIds.includes(notification.id);

              return (
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
                          color={isViewed ? "default" : "success"}
                          label={isViewed ? "Viewed" : "New"}
                          size="small"
                        />
                      </Stack>

                      <Typography color="text.secondary">
                        {notification.timestamp}
                      </Typography>

                      {!isViewed && (
                        <Box>
                          <Button
                            variant="outlined"
                            onClick={() => markAsViewed(notification.id)}
                          >
                            Mark as Viewed
                          </Button>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Chip label={`Page ${page}`} />
          <Button variant="outlined" onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default AllNotifications;
