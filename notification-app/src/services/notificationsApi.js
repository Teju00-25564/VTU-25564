import { fallbackNotifications } from "../data/fallbackNotifications";
import { logError, logInfo } from "./logger";

const API_URL = "http://4.224.186.213/evaluation-service/notifications";

function cleanNotification(notification, index) {
  return {
    id: notification.ID || notification.id || index + 1,
    type: notification.Type || notification.type || "Event",
    message: notification.Message || notification.message || "Notification",
    timestamp:
      notification.Timestamp ||
      notification.timestamp ||
      new Date().toISOString()
  };
}

function getNotificationList(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.notifications)) {
    return data.notifications;
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  return [];
}

export async function fetchNotifications({ limit, page, notificationType }) {
  const params = new URLSearchParams();

  if (limit) {
    params.set("limit", limit);
  }

  if (page) {
    params.set("page", page);
  }

  if (notificationType && notificationType !== "All") {
    params.set("notification_type", notificationType);
  }

  const url = `${API_URL}?${params.toString()}`;

  try {
    logInfo("notifications_fetch_started", { url });

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API failed with status ${response.status}`);
    }

    const data = await response.json();
    const notifications = getNotificationList(data).map(cleanNotification);

    logInfo("notifications_fetch_success", {
      count: notifications.length,
      page,
      limit,
      notificationType
    });

    return {
      notifications,
      usedFallback: false
    };
  } catch (error) {
    logError("notifications_fetch_failed", error, {
      page,
      limit,
      notificationType
    });

    let notifications = fallbackNotifications;

    if (notificationType && notificationType !== "All") {
      notifications = notifications.filter(
        (notification) => notification.type === notificationType
      );
    }

    if (limit) {
      notifications = notifications.slice(0, Number(limit));
    }

    return {
      notifications,
      usedFallback: true
    };
  }
}
