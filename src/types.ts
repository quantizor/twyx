/**
 * Utilities
 */

// Prevents TypeScript from inferring generic argument
export type NoInfer<T> = [T][T extends any ? 0 : never];

export type FastOmit<T extends object, U extends string | number | symbol> = {
  [K in keyof T as K extends U ? never : K]: T[K];
};

export type Substitute<A extends object, B extends object> = FastOmit<A, keyof B> & B;
