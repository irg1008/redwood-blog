import { SendConfirmUserEmailJob } from "./SendConfirmUserEmailJob";

describe("SendConfirmUserEmailJob", () => {
  it("should not throw any errors", async () => {
    await expect(SendConfirmUserEmailJob.perform()).resolves.not.toThrow();
  });
});
