import { expect, test } from '@playwright/test';

test('Kantonsratsmitglieder', async ({ page }) => {
	await page.goto('https://sh.ch/CMS/Webseite/Kanton-Schaffhausen/Beh-rde/Parlament/Der-Kantonsrat/Mitglieder-und-Parteien/Mitglieder-und-Fraktionen-2304166-DE.html');

	await page.waitForTimeout(5)
});
