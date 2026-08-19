let activeConnections = 0;

export function openConnection() {
  activeConnections += 1;
  let closed = false;
  return {
    close() {
      if (closed) return;
      closed = true;
      activeConnections -= 1;
    },
  };
}

export function getActiveConnections() {
  return activeConnections;
}
