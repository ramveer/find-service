import { Response } from 'express';

const sseClients = new Map<string, Response[]>();

export const broadcastLocation = (vehicleId: string, loc: { lat: number; lng: number }) => {
  const location = { ...loc, vehicleId, timestamp: Date.now() };
  const clients = sseClients.get(vehicleId) || [];
  console.log(`Broadcasting location for vehicleId ${vehicleId} to ${clients.length} clients:`, location);
  for (const client of clients) {
    client.write(`data: ${JSON.stringify(location)}\n\n`);
  }
};

export const setupSSE = (vehicleIds: string[], res: Response) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  res.flushHeaders();
  // Send initial dummy event so client gets a response immediately
  res.write(`data: ${JSON.stringify({ message: 'SSE stream started', vehicleIds })}\n\n`);
  // Send keep-alive ping every 30 seconds
  const ping = setInterval(() => {
    res.write(': ping\n\n');
  }, 30000);

  for (const vehicleId of vehicleIds) {
    const clients = sseClients.get(vehicleId) || [];
    clients.push(res);
    sseClients.set(vehicleId, clients);
    console.log(`Added SSE client for vehicleId ${vehicleId}. Total clients: ${clients.length}`);
  }

  res.on('close', () => {
    clearInterval(ping);
    for (const vehicleId of vehicleIds) {
      const updated = (sseClients.get(vehicleId) || []).filter(c => c !== res);
      sseClients.set(vehicleId, updated);
      console.log(`Removed SSE client for vehicleId ${vehicleId}. Remaining clients: ${updated.length}`);
    }
  });
};