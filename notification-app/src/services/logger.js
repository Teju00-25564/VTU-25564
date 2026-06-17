const LOG_KEY = "notification_app_logs";

function saveLog(entry) {
  const oldLogs = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
  const newLogs = [entry, ...oldLogs].slice(0, 50);

  localStorage.setItem(LOG_KEY, JSON.stringify(newLogs));
}

export function logInfo(action, details = {}) {
  const entry = {
    level: "info",
    action,
    details,
    time: new Date().toISOString()
  };

  saveLog(entry);
  console.info("[notification-app]", action, details);
}

export function logError(action, error, details = {}) {
  const entry = {
    level: "error",
    action,
    message: error.message,
    details,
    time: new Date().toISOString()
  };

  saveLog(entry);
  console.error("[notification-app]", action, error, details);
}
