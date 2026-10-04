import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { clearSession, getUser } from "../services/authStorage";
import { disconnectWebSocket } from "../services/Websocket";

export function useAuthUser() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = getUser();

  const logout = () => {
    disconnectWebSocket();
    clearSession();
    queryClient.clear();
    navigate("/", { replace: true });
  };

  return { user, logout };
}

export default useAuthUser;