import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DisableBackButton = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = () => {
      window.history.pushState(null, null, window.location.pathname);
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null; // This component does not render anything
};

export default DisableBackButton;
