import { Client } from "@stomp/stompjs";

const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:8080/ws";

let client = null;
// topic -> { handlers: Set<fonction>, subscription: abonnement STOMP | null }
const topics = new Map();

function listen(topic, entry) {
  entry.subscription = client.subscribe(`/topic/${topic}`, (message) => {
    let event;
    try {
      event = JSON.parse(message.body); // { action: "CREATED|UPDATED|DELETED", data }
    } catch {
      return;
    }
    entry.handlers.forEach((handler) => handler(event));
  });
}

function getClient() {
  if (client) return client;

  client = new Client({
    brokerURL: WS_URL,
    reconnectDelay: 5000,
    // Appelé à la connexion ET après chaque reconnexion : on se réabonne à tout
    onConnect: () => topics.forEach((entry, topic) => listen(topic, entry)),
  });
  client.activate();
  return client;
}

/**
 * S'abonne à /topic/<topic> (services, projects, employees, testimonials).
 * Retourne une fonction pour se désabonner.
 */
export function subscribeTopic(topic, handler) {
  const stomp = getClient();

  let entry = topics.get(topic);
  if (!entry) {
    entry = { handlers: new Set(), subscription: null };
    topics.set(topic, entry);
    if (stomp.connected) listen(topic, entry);
  }
  entry.handlers.add(handler);

  return () => {
    entry.handlers.delete(handler);
    if (entry.handlers.size === 0) {
      try {
        entry.subscription?.unsubscribe();
      } catch {
        // connexion déjà fermée : rien à faire
      }
      if (topics.get(topic) === entry) topics.delete(topic);
    }
  };
}

/** À appeler à la déconnexion de l'admin. */
export function disconnectWebSocket() {
  client?.deactivate();
  client = null;
  topics.clear();
}