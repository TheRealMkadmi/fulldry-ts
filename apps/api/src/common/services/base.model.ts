// model.ts
import { Client } from 'edgedb';
import e from 'dbschema/edgeql-js';
import __defaultExports from 'dbschema/edgeql-js/modules/default';


type EntityMap = typeof __defaultExports;



type IsAny<T> = (
  0 extends (1 & T) ?
  true :
  false
);

type IsNever<T> = (
  [T] extends [never] ?
  (
    IsAny<T> extends true ?
    false :
    true
  ) :
  false
);

type IsStringLiteral<T extends string> = (
  IsAny<T> extends true ?
  false :
  IsNever<T> extends true ?
  false :
  string extends T ?
  false :
  true
);

type IsOneStringLiteral<T extends string> = (
  IsStringLiteral<T> extends true ?
  (
    {
      [k in T]: (
        Exclude<T, k> extends never ?
        true :
        false
      )
    }[T]
  ) :
  false
);

type EntityNames = Extract<keyof __defaultExports, string>;

declare function GetConfiguration<K extends EntityNames>(
  key: (
    IsOneStringLiteral<K> extends true ?
    K :
    [K, "is not a single string literal"]
  )
): __defaultExports[K];

const test = GetConfiguration<'User'>('User');



export class BaseRepository { }