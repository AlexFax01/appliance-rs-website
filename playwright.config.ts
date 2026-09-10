import {defineConfig, devices} from '@playwright/test';
export default defineConfig({
  testDir:'tests/e2e', fullyParallel:false, workers:1,
  use:{baseURL:process.env.TEST_BASE_URL || 'http://127.0.0.1:3100',trace:'retain-on-failure'},
  projects:[{name:'desktop',use:{channel:'chrome',viewport:{width:1440,height:1000}}},{name:'mobile',use:{...devices['iPhone 13'],channel:'chrome',defaultBrowserType:'chromium'}},{name:'mobile-safari',use:{...devices['iPhone 13'],browserName:'webkit'}}],
});
