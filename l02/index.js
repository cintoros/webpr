function functionTest() {
  const fun1 = () => 1;
  console.log(fun1() === 1);
  console.log(fun1(42) === 1);
  const fun2 = arg => arg;
  console.log(fun2() !== 1);
  console.log(fun2() === undefined);
  console.log(fun2(42) === 42);
  const myfun = fun1;
  console.log(myfun() === 1);
  const funs = [null, undefined, fun1, fun2];
  console.log(funs[2]() === 1);

  function noReturn() {
    1;
  }

  console.log(noReturn() !== 1);
  const noReturn2 = () => {
    1;
  };
  console.log(noReturn2() !== 1);
  const noReturn3 = () => 1;
  console.log(noReturn3() === 1);
  const doit = waszutunist => arg => waszutunist(arg);
  console.log(doit(fun1)(10) === 1);
  console.log(doit(fun2)(10) === 10);
  const doit2 = callme => arg => callme(arg);
  console.log(doit2(fun1)(10) === 1);
  const doFun2 = doit2(fun1);
  console.log(doFun2(10) === 1);
  console.log(doFun2() === 1);
}

functionTest();

