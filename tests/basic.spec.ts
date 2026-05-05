import { expect, test } from "@playwright/test";

test("loads Piezo Sonar Lab with the guided workflow", async ({ page }) => {
  test.setTimeout(60000);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Piezo Sonar Lab").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "謎ピエゾを、ソナー候補へ育てる実験ラボ" })).toBeVisible();
  await expect(page.getByText("インピーダンス測定").first()).toBeVisible();
  await expect(page.getByText("次にやること").first()).toBeVisible();
});

test("loads sample data and shows sonar interpretation", async ({ page }) => {
  test.setTimeout(60000);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "サンプルデータで試す" }).click();
  await expect(page.getByText("謎ピエゾ A-62").first()).toBeVisible();
  await expect(page.getByText("62.4 kHz").first()).toBeVisible();
  await expect(page.getByText("ソナー適性スコア").first()).toBeVisible();
  await expect(page.getByText("水中で再測定する").first()).toBeVisible();
});
