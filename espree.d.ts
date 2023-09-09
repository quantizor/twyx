declare module "espree" {
  // https://github.com/eslint/espree#options
  export interface Options {
    comment?: boolean;
    ecmaFeatures?: {
      globalReturn?: boolean;
      impliedStrict?: boolean;
      jsx?: boolean;
    };
    ecmaVersion?:
      | 3
      | 5
      | 6
      | 7
      | 8
      | 9
      | 10
      | 11
      | 12
      | 2015
      | 2016
      | 2017
      | 2018
      | 2019
      | 2020
      | 2021
      | 2022
      | "latest";
    loc?: boolean;
    range?: boolean;
    sourceType?: "script" | "module";
    tokens?: boolean;
  }
  // https://github.com/eslint/espree#options
  export function parse(code: string, options?: Options): any;
  // https://github.com/eslint/espree#tokenize
  export function tokenize(code: string, options?: Options): any;
}
