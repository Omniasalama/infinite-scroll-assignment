import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => {
    console.error('Error bootstrapping application:', err);
    // Display error on page if bootstrap fails
    document.body.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: red;">Application Error</h1>
        <p>Failed to bootstrap Angular application.</p>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px;">${err.message || err}</pre>
      </div>
    `;
  });

  