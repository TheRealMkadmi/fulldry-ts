const foo = <T,>(arg: T) => ({ test: arg });
// so, let's create a parametric class
class Wrapper<T> {
    // with the only method that uses our "foo"
    wrapped = (arg: T) => foo(arg);
};
// due to the fact that class is a type we can use it as a type 
// with a generic parameter.
type GetFooResult<T> = ReturnType<Wrapper<T>['wrapped']>
type Bingo = GetFooResult<number>; // { test: number }

