const MAX_LENGTH = 20;

function tokenize(pwd) {
  return pwd.match(/[A-Za-z]+|\d+|[^A-Za-z0-9]/g) || [];
}

function hasEntropyIssue(str) {
  // Check for repeating characters (aaaa, 1111)
  if (/^(.)\1{3,}$/.test(str)) return true;

  // Check for repeating patterns (abcabc, 123123)
  for (let len = 1; len <= str.length / 2; len++) {
    const pattern = str.substring(0, len);
    let expected = '';
    for (let i = 0; i < str.length; i += len) {
      expected += pattern;
    }
    if (str === expected.substring(0, str.length) && str.length >= len * 2) {
      return true;
    }
  }

  return false;
}

function validVariant(variant, original, maxLength = MAX_LENGTH) {
  if (!variant) return false;
  if (variant === original) return false;
  if (variant.length > maxLength) return false;
  if (hasEntropyIssue(variant)) return false;
  return true;
}

module.exports = {
  tokenize,
  validVariant,
  hasEntropyIssue,
  MAX_LENGTH
};
