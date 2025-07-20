import { Response } from 'express';

const sseClients = new Map<string, Response[]>();

export const broadcastLocation = (vehicleId: string, loc: { lat: number; lng: number }) => {
  const location = { ...loc, vehicleId, timestamp: Date.now() };
  const clients = sseClients.get(vehicleId) || [];
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

  for (const vehicleId of vehicleIds) {
    const clients = sseClients.get(vehicleId) || [];
    clients.push(res);
    sseClients.set(vehicleId, clients);
  }

  res.on('close', () => {
    for (const vehicleId of vehicleIds) {
      const updated = (sseClients.get(vehicleId) || []).filter(c => c !== res);
      sseClients.set(vehicleId, updated);
    }
  });
};