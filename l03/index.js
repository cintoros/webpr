function functionTest() {
  const longRunning = x => {
    // let out.textContent += " ...";
    // setTimeout(_ => out.textContent += " " + x, 1000 * 2);
    setTimeout(_ => undefined, 1000 * 2);
    return x;
  };

  // starting state
  const logAll = () => {
    console.error("error", longRunning("error"));
    console.warn("warn", longRunning("warn"));
    console.info("info", longRunning("info"));
    console.log("log", longRunning("log"));
    console.debug("debug", longRunning("debug"));
  }

  // constants
  const LEVEL_NONE = -1;
  const LEVEL_ERROR = 0;
  const LEVEL_WARN = 1;
  const LEVEL_INFO = 2;
  const LEVEL_LOG = 3;
  const LEVEL_DEBUG = 4;
  let logLevel = LEVEL_LOG;


  // strict version (not working as desired, yet)
  const error = args => {
    if (logLevel >= LEVEL_ERROR) console.error(args);
  }
  const warn = args => {
    if (logLevel >= LEVEL_WARN) console.warn(args);
  }
  const info = args => {
    if (logLevel >= LEVEL_INFO) console.info(args);
  }
  const log = args => {
    if (logLevel >= LEVEL_LOG) console.log(args);
  }
  const debug = args => {
    if (logLevel >= LEVEL_DEBUG) console.debug(args);
  }

  const logAll2 = () => {
    error("error", longRunning("error"));
    warn("warn", longRunning("warn"));
    info("info", longRunning("info"));
    log("log", longRunning("log"));
    debug("debug", longRunning("debug"));
  }
  logAll()
  logAll2()
}

function functionTest2() {
  const Tuple = n => [
    parmStore(n + 1)([])(parms => parms.reduce((accu, it) => accu(it), parms.pop())), // ctor
    ...Array.from({length: n}, (it, idx) => iOfN(n)(idx)())                    // selectors
  ];

  const iOfN = n => i => value => // from n curried params, take argument at position i,
      n === 0
          ? value
          : x => iOfN(n - 1)(i - 1)(i === 0 ? x : value);


  const parmStore = n => args => onDone =>  // n args to come
      n === 0
          ? onDone(args)
          : arg => parmStore(n - 1)([...args, arg])(onDone); // store parms in array

  const Choice = n => [
    ...Array.from({length: n}, (it, idx) => parmStore(n + 1)([])(parms => parms[idx + 1](parms[0]))), // ctors
    id
  ];

  const id = x => x;
  const konst = x => y => x;
  const snd = x => y => y;
  const T = konst
  const F = snd
  const and = a => b => a(b)(a)
  const or = a => b => a(a)(b)
  let ok = [];

// id
  ok.push(id(1) === 1);
  ok.push(id(id) === id);

// konst
  ok.push(konst(42)(0) === 42);
  ok.push(konst(42)(1) === 42);
  ok.push(konst(42)(null) === 42);

// kite
  ok.push(snd(null)(42) === 42);

// true

  ok.push(T(1)(0) === 1);
  ok.push(F(1)(0) === 0);

// and
  ok.push(and(F)(F) === F);
  ok.push(and(T)(F) === F);
  ok.push(and(F)(T) === F);
  ok.push(and(T)(T) === T);

// or
  ok.push(or(F)(F) === F);
  ok.push(or(T)(F) === T);
  ok.push(or(F)(T) === T);
  ok.push(or(T)(T) === T);

  // flip
  // flip(f)(x)(y) = f(y)(x)

// not

// beq

// Pair

  const dierk = Pair("Dierk")("König"); // immutable
  ok.push(dierk(firstname) === "Dierk");
  ok.push(dierk(lastname) === "König");

  const tdierk = Triple("Dierk")("König")(50); // immutable
  ok.push(tdierk(tfirstname) === "Dierk");
  ok.push(tdierk(tlastname) === "König");
  ok.push(tdierk(tage) === 50);

// tuple
  const [Person, fn, ln, ag] = Tuple(3);
  const person = Person("Dierk")("König")(50);
  ok.push(person(fn) === "Dierk");
  ok.push(person(ln) === "König");
  ok.push(person(ag) === 50);

// composed Tuple

  const [Team, lead, deputy] = Tuple(2);
  const team = Team(person)(Person("Roger")("Federer")(35));
  ok.push(team(lead)(fn) === "Dierk");
  ok.push(team(deputy)(ln) === "Federer");

// Pair equal

// either

  const safeDiv = num => divisor =>
      divisor === 0
          ? Left("schlecht!")
          : Right(num / divisor);

  either(safeDiv(1)(0))
  (x => console.error(x))
  (x => console.log(x));


  const [Cash, CreditCard, Invoice, PayPal, pay] = Choice(4);
  const cash = Cash();
  const card = CreditCard("0000-1111-2222-3333");
  const invo = Invoice({name: "Roger", number: "4711"});
  const pal = PayPal(person);  // the payload can be a partially applied function, e.g. Tuple ctor
  const doPay = method =>
      pay(method)
      (_ => "paid cash")
      (number => "credit card " + number)
      (account => account.name + " " + account.number)
      (person => "pal: " + person(fn));

  ok.push(doPay(cash) === "paid cash");
  ok.push(doPay(card) === "credit card 0000-1111-2222-3333");
  ok.push(doPay(invo) === "Roger 4711");
  ok.push(doPay(pal) === "pal: Dierk");


// test result report
  if (ok.every(elem => elem)) {
    console.log("All " + ok.length + " tests ok.");
  } else {
    console.log("Not all tests ok! Details:");
    for (let i = 0; i < ok.length; i++) {
      if (ok[i]) {
        console.log("Test " + i + " ok");
      } else {
        console.log("Test " + i + " failed");
      }
    }
  }
}

// functionTest()
functionTest2()

