import { SendContactEmailJob } from "./SendContactEmailJob";

describe("SendContactEmailJob", () => {
  it("should not throw any errors", async () => {
    await expect(SendContactEmailJob.perform()).resolves.not.toThrow();
  });
});
