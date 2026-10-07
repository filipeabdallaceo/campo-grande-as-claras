import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'tests/browser',timeout:30000,workers:2,use:{baseURL:'http://127.0.0.1:4173',browserName:'chromium',launchOptions:{channel:'chrome'}},webServer:{command:'npm run dev',url:'http://127.0.0.1:4173',reuseExistingServer:true},reporter:'list'});
