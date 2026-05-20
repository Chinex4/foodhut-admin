const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("admin auth slice calls documented auth/profile endpoints", () => {
  const source = read("src/store/slices/authSlice.ts");
  assert.match(source, /"\/auth\/sign-in"/);
  assert.match(source, /"\/auth\/verify"/);
  assert.match(source, /"\/users\/profile"/);
});

test("admin management slices use documented meals, kitchens, orders, ads, and wallet endpoints", () => {
  const sources = [
    read("src/store/slices/mealsSlice.ts"),
    read("src/store/slices/kitchensSlice.ts"),
    read("src/store/slices/ordersSlice.ts"),
    read("src/store/slices/adsSlice.ts"),
    read("src/store/slices/transactionsSlice.ts"),
  ].join("\n");

  [
    "/meals",
    "/kitchens",
    "/orders",
    "/ads",
    "/wallets/transactions",
    "/status",
    "/verify",
    "/unverify",
  ].forEach((endpoint) => {
    assert.ok(sources.includes(endpoint), `missing ${endpoint}`);
  });
});

test("admin logistics slice covers company, rider, delivery, KYC, and offer endpoints", () => {
  const source = read("src/store/slices/logisticsSlice.ts");
  [
    "/logistics/companies",
    "/logistics/companies/kyc",
    "/logistics/riders",
    "/logistics/riders/kyc",
    "/logistics/deliveries",
    "/logistics/orders/${order_id}/offers",
    "/logistics/offers/${offer_id}/counter",
    "/logistics/offers/${offer_id}/accept",
    "/logistics/offers/${offer_id}/reject",
  ].forEach((endpoint) => {
    assert.ok(source.includes(endpoint), `missing ${endpoint}`);
  });
});
