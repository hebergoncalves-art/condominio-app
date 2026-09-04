import { test, expect } from "@playwright/test";

test("public home links to password login", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByText("Ocorrências que chegam ao lugar certo.")
  ).toBeVisible();
  await page.getByRole("link", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText("Entre no condomínio")).toBeVisible();
  await expect(page.getByLabel("Senha")).toBeVisible();
});
