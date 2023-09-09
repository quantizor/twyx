import { namedTypes as t, visit } from "ast-types";
import debug from "debug";
import escodegen from "escodegen-jsx";
import * as espree from "espree";
import unquote from "unquote";
import { twyx } from "./src/core";

const logger = debug("twyx");

/**
 * This function is meant to be added to `tailwind.config.ts` (or `.js`). To use it,
 * you must use the `content` fieldset:
 *
 * ```ts
 * import type { Config } from "tailwindcss";
 * import { transformTwyxProps } from "./transformer";
 *
 * export default {
 *   content: {
 *     files: ["./demo/**\/*.tsx"],
 *     transform: {
 *       tsx: transformTwyxProps,
 *     },
 *   },
 *   theme: {
 *     extend: {},
 *   },
 *   plugins: [],
 * } as Config;
 * ```
 *
 * You can duplicate the `transform` keys for as many filetypes as you plan to
 * use the `twyx/react` library. If you don't use typescript, then the object would
 * probably look like this:
 *
 * ```json
 * "transform": {
 *   "js": transformTwyxProps,
 *   "jsx": transformTwyxProps,
 * },
 * ```
 *
 * Make sure the blobs in `content.files` comprise _all_ of the places where `twyx/*` might be used.
 */
export function transformTwyxProps(rawCode: string) {
  // aggregate classes from any found syntax
  let classes: string[] = [];

  const seen = new Set();

  function processObjectExpressionRecursive(node: t.ObjectExpression, parentObjectKeys: string[] = []) {
    const branches: string[] = [];

    node.properties?.forEach((property) => {
      // bail out on unknown nodes
      if (!t.Property.check(property)) return console.log("unhandled object member", property);
      else if (!t.Identifier.check(property.key)) return console.log("unhandled object member key type", property);

      const propName = property.key.name as string;

      // {p: thing ? literal : otherLiteral}
      if (t.ConditionalExpression.check(property.value)) {
        branches.push(escodegen.generate(property.value.consequent), escodegen.generate(property.value.alternate));
      } /* {p: literal} */ else if (t.ObjectExpression.check(property.value)) {
        // don't need to process it again later when the visitor goes deeper
        seen.add(property.value);
        processObjectExpressionRecursive(property.value, parentObjectKeys.concat(propName));
      } else {
        branches.push(escodegen.generate(property.value));
      }

      branches.forEach((val) => {
        let branchObject = { [propName]: unquote(val) };

        classes.push(
          twyx(
            parentObjectKeys.reduceRight<object>((obj, key) => {
              return { [key]: obj };
            }, branchObject)
          )
        );
      });
    });
  }

  const ast = espree.parse(rawCode, {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  });

  visit(ast, {
    visitJSXOpeningElement(path) {
      const { node } = path;

      if (seen.has(node)) return this.traverse(path);
      else seen.add(node);

      node.attributes?.forEach((attr: any) => {
        if (t.JSXAttribute.check(attr)) {
          const propName = attr.name.name as string;
          const branches = [];

          // <div p={something}
          if (t.JSXExpressionContainer.check(attr.value)) {
            // <div p={{thing ? literal : otherLiteral}}
            if (t.ConditionalExpression.check(attr.value.expression)) {
              branches.push(
                escodegen.generate(attr.value.expression.consequent),
                escodegen.generate(attr.value.expression.alternate)
              );
            } /* <div p={{_: something}} */ else if (t.ObjectExpression.check(attr.value.expression)) {
              processObjectExpressionRecursive(attr.value.expression, [propName]);
            } /* <div p={literal} */ else {
              branches.push(escodegen.generate(attr.value.expression));
            }
          } /* p="literal" */ else {
            branches.push(escodegen.generate(attr.value));
          }

          branches.forEach((val) => {
            classes.push(twyx({ [propName]: unquote(val) }));
          });
        }
      });

      this.traverse(path);
    },
    visitObjectExpression(path) {
      const { node } = path;

      if (seen.has(node)) return this.traverse(path);
      else seen.add(node);

      processObjectExpressionRecursive(node);

      this.traverse(path);
    },
  });

  const compiled = classes.join(" ");

  logger("detected tailwind classes: %s", compiled);

  return rawCode + `\n// ${compiled}`;
}
