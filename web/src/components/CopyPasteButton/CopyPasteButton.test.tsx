import { render } from "@redwoodjs/testing/web";

import CopyPasteButton from "./CopyPasteButton";

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe("CopyPasteButton", () => {
  it("renders successfully", () => {
    expect(() => {
      render(<CopyPasteButton />);
    }).not.toThrow();
  });
});
