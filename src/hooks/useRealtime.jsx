import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { subscribeTopic } from "../services/Websocket";

/**
 * @param topic    "services" | "projects" | "employees" | "testimonials"
 * @param queryKey clé react-query à rafraîchir, ex: ["services"]
 */
export function useRealtime(topic, queryKey) {
  const queryClient = useQueryClient();
  const key = JSON.stringify(queryKey);

  useEffect(() => {
    return subscribeTopic(topic, () => {
      queryClient.invalidateQueries({ queryKey: JSON.parse(key) });
    });
  }, [topic, key, queryClient]);
}