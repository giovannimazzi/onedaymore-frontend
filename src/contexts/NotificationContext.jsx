import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const NotificationContext = createContext();

const notificationInitialState = {
  visible: false,
  message: "",
  type: "primary",
  pointer: null,
  seq: 0,
  action: null,
};

const acceptedTypes = [
  "info",
  "warning",
  "success",
  "danger",
  "primary",
  "muted",
];
const acceptedPointers = ["cart", "compare"];

const CONSECUTIVE_GAP_MS = 160;

const NotificationContextProvider = ({ children }) => {
  const [notification, setNotification] = useState(notificationInitialState);
  const dismissTimerRef = useRef(null);
  const gapTimerRef = useRef(null);
  const pendingPayloadRef = useRef(null);
  const seqRef = useRef(0);

  const clearDismissTimer = useCallback(() => {
    if (dismissTimerRef.current != null) {
      window.clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, []);

  const clearGapTimer = useCallback(() => {
    if (gapTimerRef.current != null) {
      window.clearTimeout(gapTimerRef.current);
      gapTimerRef.current = null;
    }
  }, []);

  const flushPendingAfterGap = useCallback(() => {
    gapTimerRef.current = null;
    const pending = pendingPayloadRef.current;
    pendingPayloadRef.current = null;
    if (!pending) return;
    seqRef.current += 1;
    setNotification({
      visible: true,
      message: pending.message,
      type: pending.type,
      pointer: pending.pointer,
      seq: seqRef.current,
      action: pending.action ?? null,
    });
    if (
      pending.duration != null &&
      typeof pending.duration === "number" &&
      pending.duration > 0
    ) {
      dismissTimerRef.current = window.setTimeout(() => {
        dismissTimerRef.current = null;
        setNotification(notificationInitialState);
      }, pending.duration);
    }
  }, []);

  useEffect(
    () => () => {
      clearDismissTimer();
      clearGapTimer();
    },
    [clearDismissTimer, clearGapTimer],
  );

  const hideNotification = useCallback(() => {
    clearDismissTimer();
    clearGapTimer();
    pendingPayloadRef.current = null;
    setNotification(notificationInitialState);
  }, [clearDismissTimer, clearGapTimer]);

  const showNotification = useCallback(
    (message, type = "primary", options = {}) => {
      if (!message) {
        message = "Unknown error";
        type = "danger";
      } else if (!acceptedTypes.includes(type)) {
        type = "primary";
      }

      const pointer = acceptedPointers.includes(options.pointer)
        ? options.pointer
        : null;

      const duration =
        typeof options.duration === "number" && options.duration > 0
          ? options.duration
          : null;

      const rawAction = options.action;
      const action =
        rawAction &&
        typeof rawAction.label === "string" &&
        typeof rawAction.onAction === "function"
          ? { label: rawAction.label, onAction: rawAction.onAction }
          : null;

      const payload = { message, type, pointer, duration, action };

      clearDismissTimer();

      let armImmediately = false;

      setNotification((prev) => {
        if (gapTimerRef.current != null && !prev.visible) {
          pendingPayloadRef.current = payload;
          return prev;
        }

        if (prev.visible) {
          pendingPayloadRef.current = payload;
          if (gapTimerRef.current == null) {
            gapTimerRef.current = window.setTimeout(
              flushPendingAfterGap,
              CONSECUTIVE_GAP_MS,
            );
          }
          return notificationInitialState;
        }

        pendingPayloadRef.current = null;

        seqRef.current += 1;
        armImmediately = true;
        return {
          visible: true,
          message: payload.message,
          type: payload.type,
          pointer: payload.pointer,
          seq: seqRef.current,
          action: payload.action ?? null,
        };
      });

      if (armImmediately && duration != null) {
        dismissTimerRef.current = window.setTimeout(() => {
          dismissTimerRef.current = null;
          setNotification(notificationInitialState);
        }, duration);
      }
    },
    [clearDismissTimer, flushPendingAfterGap],
  );

  const value = { notification, showNotification, hideNotification };
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

const useNotificationContext = () => {
  return useContext(NotificationContext);
};

export { NotificationContextProvider, useNotificationContext };
