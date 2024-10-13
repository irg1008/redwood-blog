import { render } from "@redwoodjs/testing/web";

import StreamVideo from "./StreamVideo";

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe("StreamVideo", () => {
  it("renders successfully", () => {
    expect(() => {
      render(<StreamVideo />);
    }).not.toThrow();
  });
});
