export type KeysEndingWith<T, Suffix extends string> = Extract<
  keyof T,
  `${string}${Suffix}`
>

export type KeysStartingWith<T, Prefix extends string> = Extract<
  keyof T,
  `${Prefix}${string}`
>
