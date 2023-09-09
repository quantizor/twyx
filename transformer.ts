import { twyx } from "./src/core";

export function transformJSXProps(node: any) {
  if (node.type === "JSXOpeningElement") {
    let props: { [key: string]: any } = {};
    let existingClassName = "";
    node.attributes = node.attributes.map((attr: any) => {
      if (attr.type === "JSXAttribute") {
        props[attr.name.name] = attr.value.value;
        if (attr.name.name === "className") {
          existingClassName = attr.value.value;
        }
      }
      return attr;
    });
    let newValue = twyx(props);
    if (existingClassName) {
      newValue = `${existingClassName} ${newValue}`;
    }
    node.attributes.push({
      type: "JSXAttribute",
      name: {
        type: "JSXIdentifier",
        name: "className",
      },
      value: {
        type: "StringLiteral",
        value: newValue,
      },
    });
  }

  return node;
}
