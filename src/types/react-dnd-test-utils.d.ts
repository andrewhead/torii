declare module "react-dnd-test-utils" {
  function wrapInTestContext(
    constructor: (...args: any) => JSX.IntrinsicElements.Element
  ): (...args: any) => JSX.IntrinsicElements.Element;
}
