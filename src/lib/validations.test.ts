import { categoryLabels, statusLabels } from "./domain";
import { occurrenceSchema, residentSchema } from "./validations";
describe("domain validation", () => {
  it("accepts a valid resident and normalizes email", () => { const result = residentSchema.parse({ name: "Maria Silva", email: " MARIA@EXAMPLE.COM ", towerApartment: "Torre A / 101", phone: "11999999999" }); expect(result.email).toBe("maria@example.com"); });
  it("rejects invalid occurrence category and empty required fields", () => { expect(occurrenceSchema.safeParse({ title: "", description: "x", category: "invalid", location: "x" }).success).toBe(false); });
  it("has labels for every persisted enum", () => { expect(Object.keys(categoryLabels)).toHaveLength(9); expect(Object.keys(statusLabels)).toHaveLength(5); });
});
