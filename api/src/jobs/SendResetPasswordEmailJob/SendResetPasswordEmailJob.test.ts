import { SendResetPasswordEmailJob } from "./SendResetPasswordEmailJob";

describe("SendResetPasswordEmailJob", () => {
  it("should not throw any errors", async () => {
    await expect(SendResetPasswordEmailJob.perform()).resolves.not.toThrow();
  });
});
