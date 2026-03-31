import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

const notificationInitialState = {
  visible: false,
  message: "",
  type: "primary",
};

const acceptedTypes = ["info", "warning", "success", "danger", "primary"];

const NotificationContextProvider = ({ children }) => {
  const [notification, setNotification] = useState(notificationInitialState);

  const showNotification = (message, type = "primary") => {
    if (!message) {
      message = "Unknown error";
      type = "danger";
    } else if (!acceptedTypes.includes(type)) {
      type = "primary";
    }

    setNotification({
      visible: true,
      message,
      type,
    });
  };

  const hideNotification = () => {
    setNotification(notificationInitialState);
  };

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
