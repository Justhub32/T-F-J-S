import { Express } from "express";
import http from 'http'; // Required to create the server instance
import { setupAuth } from "./replitAuth"; 

// This function must be 'async' because the original intended call (setupAuth) was awaited.
export async function registerRoutes(app: Express) {
  // CRITICAL FIX: Create the HTTP server instance from the Express app.
  // This object is required by index.ts for server.listen() and setupVite().
  const server = http.createServer(app); 
  
  // ----------------------------------------------------
  // TEMPORARY FIX: Commenting out the Replit Auth call
  // was necessary to bypass the "clientId" crash in local development.
  // ----------------------------------------------------
  
  // await setupAuth(app); 
  console.log("✅ Replit Auth Bypassed for Local Development");

  // YOUR ORIGINAL NON-AUTH ROUTE SETUP CODE GOES HERE (if any)
  
  // Example test route (optional)
  app.get('/api/status', (req, res) => {
    res.json({ status: 'server running', message: 'Replit Auth is temporarily disabled.' });
  });

  // CRITICAL FIX: Return the server object.
  return server;
}