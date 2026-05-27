import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load environmental variables
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const RESPONSES_FILE = path.join(process.cwd(), 'responses.json');
const LOGIN_ATTEMPTS_FILE = path.join(process.cwd(), 'login-attempts.json');
const SITE_SETTINGS_FILE = path.join(process.cwd(), 'site-settings.json');

// Ensure site-settings.json has an initial value from .env or default fallbacks
function initSiteSettings() {
  try {
    if (!fs.existsSync(SITE_SETTINGS_FILE)) {
      const defaultSettings = {
        name: process.env.SITE_LOGIN_NAME || 'Dikshu',
        code: process.env.SITE_LOGIN_CODE || 'love123'
      };
      fs.writeFileSync(SITE_SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2), 'utf-8');
    }
  } catch (e) {
    console.error('Failed to initialize site-settings.json', e);
  }
}
initSiteSettings();

// Load responses
function loadResponses(): any[] {
  try {
    if (fs.existsSync(RESPONSES_FILE)) {
      const data = fs.readFileSync(RESPONSES_FILE, 'utf-8');
      return JSON.parse(data || '[]');
    }
  } catch (e) {
    console.error('Failed to read responses.json. Starting fresh.', e);
  }
  return [];
}

function saveResponses(data: any[]) {
  try {
    fs.writeFileSync(RESPONSES_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write responses.json', e);
  }
}

// Load login attempts
function loadLoginAttempts(): any[] {
  try {
    if (fs.existsSync(LOGIN_ATTEMPTS_FILE)) {
      const data = fs.readFileSync(LOGIN_ATTEMPTS_FILE, 'utf-8');
      return JSON.parse(data || '[]');
    }
  } catch (e) {
    console.error('Failed to read login-attempts.json. Starting fresh.', e);
  }
  return [];
}

function saveLoginAttempts(data: any[]) {
  try {
    fs.writeFileSync(LOGIN_ATTEMPTS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write login-attempts.json', e);
  }
}

// Load site settings
function loadSiteSettings(): { name: string; code: string } {
  try {
    if (fs.existsSync(SITE_SETTINGS_FILE)) {
      const data = fs.readFileSync(SITE_SETTINGS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed && parsed.name && parsed.code) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read site-settings.json. Reading fallbacks.', e);
  }
  return {
    name: process.env.SITE_LOGIN_NAME || 'Dikshu',
    code: process.env.SITE_LOGIN_CODE || 'love123'
  };
}

function saveSiteSettings(settings: { name: string; code: string }) {
  try {
    fs.writeFileSync(SITE_SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write site-settings.json', e);
  }
}

// Express JSON body parser
app.use(express.json());

// Helper to get admin passcode securely
const getAdminPasscode = (): string => {
  return process.env.ADMIN_PASSCODE || 'change-this-admin-passcode';
};

// API: Record a forgiveness choice response
app.post('/api/forgive', (req, res) => {
  try {
    const { choice } = req.body;
    if (!choice || (choice !== 'yes' && choice !== 'thinking')) {
      return res.status(400).json({ error: 'Invalid response choice.' });
    }

    const responses = loadResponses();
    const newResponse = {
      id: Math.random().toString(36).substring(2, 9),
      choice,
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'] || 'Unknown',
      ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Unknown'
    };

    responses.unshift(newResponse); // Keep latest on top
    saveResponses(responses);

    res.json({ success: true, choice: newResponse.choice });
  } catch (err) {
    console.error('API /api/forgive error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// API: Login Endpoint for Normal Visitors
app.post('/api/login', (req, res) => {
  try {
    const { name, secretCode } = req.body;
    const settings = loadSiteSettings();

    const isMatch = 
      secretCode && 
      settings.code && 
      secretCode.trim() === settings.code.trim();

    // Log the attempt
    const attempts = loadLoginAttempts();
    const newAttempt = {
      id: Math.random().toString(36).substring(2, 9),
      name: name || 'Empty Name',
      code: secretCode || 'Empty Code',
      success: isMatch,
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'] || 'Unknown',
      ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Unknown'
    };
    attempts.unshift(newAttempt);
    saveLoginAttempts(attempts);

    if (isMatch) {
      return res.json({ success: true });
    } else {
      return res.status(401).json({ 
        success: false, 
        error: 'Please enter correct name and secret memory code.' 
      });
    }
  } catch (err) {
    console.error('API /api/login error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// API: Check Admin Passcode
app.post('/api/admin/auth', (req, res) => {
  try {
    const { passcode } = req.body;
    const actualPasscode = getAdminPasscode();
    if (passcode === actualPasscode) {
      return res.json({ success: true });
    }
    return res.status(401).json({ error: 'Incorrect passcode.' });
  } catch (err) {
    console.error('API /api/admin/auth error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// API: Retrieve Dashboard Data (Protected settings, responses, and login attempts)
app.get('/api/admin/dashboard', (req, res) => {
  try {
    const passcode = req.headers['x-admin-passcode'] as string;
    const actualPasscode = getAdminPasscode();
    if (passcode !== actualPasscode) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const settings = loadSiteSettings();
    const responses = loadResponses();
    const loginAttempts = loadLoginAttempts();

    res.json({
      success: true,
      settings,
      responses,
      loginAttempts
    });
  } catch (err) {
    console.error('API /api/admin/dashboard error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// API: Update Site Login Settings
app.post('/api/admin/settings/login', (req, res) => {
  try {
    const passcode = req.headers['x-admin-passcode'] as string;
    const actualPasscode = getAdminPasscode();
    if (passcode !== actualPasscode) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const { name, code } = req.body;
    if (!name || !name.trim() || !code || !code.trim()) {
      return res.status(400).json({ error: 'Name and Code are required.' });
    }

    const newSettings = {
      name: name.trim(),
      code: code.trim()
    };
    saveSiteSettings(newSettings);

    res.json({ success: true, settings: newSettings });
  } catch (err) {
    console.error('API /api/admin/settings/login error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// API: Clear Responses
app.post('/api/admin/responses/clear', (req, res) => {
  try {
    const passcode = req.headers['x-admin-passcode'] as string;
    const actualPasscode = getAdminPasscode();
    if (passcode !== actualPasscode) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    saveResponses([]);
    res.json({ success: true, responses: [] });
  } catch (err) {
    console.error('API /api/admin/responses/clear error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// API: Clear Login Attempts
app.post('/api/admin/login-attempts/clear', (req, res) => {
  try {
    const passcode = req.headers['x-admin-passcode'] as string;
    const actualPasscode = getAdminPasscode();
    if (passcode !== actualPasscode) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    saveLoginAttempts([]);
    res.json({ success: true, loginAttempts: [] });
  } catch (err) {
    console.error('API /api/admin/login-attempts/clear error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Initialize server and bundler middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Development Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // Serve index.html for SPA page loads
    app.get('*', (req, res, next) => {
      // Avoid intercepting API routes
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
