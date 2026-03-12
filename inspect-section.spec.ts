import { test } from '@playwright/test';
import * as fs from 'fs';

test('inspect stray section', async ({ page }) => {
    test.setTimeout(180000);
    await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 120000 });
    await page.waitForTimeout(2000);

    const result = await page.evaluate(() => {
        const section = Array.from(document.querySelectorAll('body > section')).pop();
        if (!section) return null;
        
        return {
            outerHTML: section.outerHTML,
            position: window.getComputedStyle(section).position
        };
    });

    console.log(result);
});
