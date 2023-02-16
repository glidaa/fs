import BigInt from "big-integer";

const zero = BigInt.zero;
const one = BigInt.one;
const two = BigInt[2];

const modPow = (a, e, m) => {
  a = BigInt(a);
  e = BigInt(e);
  m = BigInt(m);
  if (m.equals(zero)) {
    throw new Error("bad modulus (0)");
  }

  if (e.lesserOrEquals(0)) {
    throw new Error("negative exponents not implemented");
  }

  let r = one;
  let base = a.mod(m);
  let exp = e;

  while (exp.greater(zero)) {
    if (base.equals(zero)) {
      r = zero;
      break;
    }

    if (exp.mod(two).equals(one)) {
      r = r.multiply(base).mod(m);
    }

    base = base.multiply(base).mod(m);
    exp = exp.divide(two);
  }

  return r.lesserOrEquals(zero) ? r.add(m) : r;
};

export default modPow;
