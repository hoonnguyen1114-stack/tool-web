const { tokenize, validVariant } = require('./validators');

const LEET_MAP = {
  a: ['@', '4'],
  o: ['0'],
  s: ['$', '5'],
  e: ['3'],
  i: ['1'],
  t: ['7']
};

// Basic Rules
const rule_1a = (t) => [t.join('').toLowerCase()];
const rule_1b = (t) => [t.join('').toUpperCase()];
const rule_1c = (t) => {
  const str = t.join('');
  for (let i = 0; i < str.length; i++) {
    if (/[a-zA-Z]/.test(str[i])) {
      return [str.substring(0, i) + str[i].toUpperCase() + str.substring(i + 1)];
    }
  }
  return [];
};

// Number Rules
const rule_2a = (t) => [t.join('') + '123'];
const rule_2b = (t) => [t.join('') + '1234'];
const rule_2c = (t) => [t.join('') + '12345'];
const rule_2d = (t) => [t.join('') + '123456'];
const rule_2e = (t) => [t.join('') + '1234567'];
const rule_2f = (t) => [t.join('') + '12345678'];
const rule_2g = (t) => [t.join('') + '123456789'];

// Year Rules
const rule_3a = (t) => [t.join('') + '1990'];
const rule_3b = (t) => [t.join('') + '2000'];
const rule_3c = (t) => [t.join('') + '2010'];
const rule_3d = (t) => [t.join('') + '2020'];
const rule_3e = (t) => [t.join('') + '2024'];
const rule_3f = (t) => [t.join('') + '90'];
const rule_3g = (t) => [t.join('') + '95'];

// Special Character Rules
const rule_4a = (t) => [t.join('') + '@'];
const rule_4b = (t) => [t.join('') + '@@'];
const rule_4c = (t) => [t.join('') + '!'];
const rule_4d = (t) => [t.join('') + '!!'];
const rule_4e = (t) => [t.join('') + '#'];
const rule_4f = (t) => [t.join('') + '$'];

// Vietnamese Suffix Rules
const rule_5a = (t) => [t.join('') + 'vip'];
const rule_5b = (t) => [t.join('') + 'pro'];
const rule_5c = (t) => [t.join('') + 'cute'];
const rule_5d = (t) => [t.join('') + 'love'];
const rule_5e = (t) => [t.join('') + 'baby'];
const rule_5f = (t) => [t.join('') + 'hihi'];
const rule_5g = (t) => [t.join('') + 'kaka'];

// LEET Speak Rules
const rule_6a = (t) => [t.join('').replace(/[aA]/g, '@')];
const rule_6b = (t) => [t.join('').replace(/[oO]/g, '0')];
const rule_6c = (t) => [t.join('').replace(/[iI]/g, '1')];
const rule_6d = (t) => [t.join('').replace(/[eE]/g, '3')];
const rule_6e = (t) => [t.join('').replace(/[sS]/g, '$')];
const rule_6f = (t) => [t.join('').replace(/[tT]/g, '7')];

// Separator Rules
const rule_7a = (t) => {
  const w = t.join('');
  const m = w.match(/^([A-Za-z]+)(\d+)$/) || w.match(/^(\d+)([A-Za-z]+)$/);
  if (m) {
    const letters = /[a-zA-Z]/.test(m[1]) ? m[1] : m[2];
    const digits = /\d/.test(m[1]) ? m[1] : m[2];
    return [letters + '_' + digits];
  }
  return [];
};

const rule_7b = (t) => {
  const w = t.join('');
  const m = w.match(/^([A-Za-z]+)(\d+)$/) || w.match(/^(\d+)([A-Za-z]+)$/);
  if (m) {
    const letters = /[a-zA-Z]/.test(m[1]) ? m[1] : m[2];
    const digits = /\d/.test(m[1]) ? m[1] : m[2];
    return [letters + '-' + digits];
  }
  return [];
};

const rule_7c = (t) => {
  const w = t.join('');
  const m = w.match(/^([A-Za-z]+)(\d+)$/) || w.match(/^(\d+)([A-Za-z]+)$/);
  if (m) {
    const letters = /[a-zA-Z]/.test(m[1]) ? m[1] : m[2];
    const digits = /\d/.test(m[1]) ? m[1] : m[2];
    return [letters + '.' + digits];
  }
  return [];
};

// Reverse Rules
const rule_8a = (t) => [t.join('').split('').reverse().join('')];
const rule_8b = (t) => {
  const w = t.join('');
  const letters = w.match(/[A-Za-z]/g) || [];
  const nonLetters = w.match(/[^A-Za-z]/g) || [];
  return [letters.reverse().join('') + nonLetters.join('')];
};

// Duplication Rules
const rule_9a = (t) => {
  const w = t.join('');
  if ((w.length * 2) > 20) return [];
  return [w + w];
};

const rule_9b = (t) => {
  const w = t.join('');
  if ((w.length * 2) > 20) return [];
  return [w + w];
};

// Username Rules
const rule_10a = (user) => {
  const base = user.split('@')[0];
  return base ? [base + '123'] : [];
};

const rule_10b = (user) => {
  const base = user.split('@')[0];
  return base ? [base + '@'] : [];
};

const rule_10c = (user) => {
  const base = user.split('@')[0];
  return base ? [base + '1999'] : [];
};

const rule_10d = (user) => {
  const base = user.split('@')[0];
  return base ? [base + '@123'] : [];
};

// Combination Rules
const rule_11a = (t) => {
  const w = t.join('');
  const lastNum = w.match(/\d+$/);
  if (lastNum) {
    const num = lastNum[0];
    const rest = w.substring(0, w.length - num.length);
    return [rest + num + num.charAt(0)];
  }
  return [];
};

const rule_11b = (t) => {
  const w = t.join('');
  const firstNum = w.match(/^\d+/);
  if (firstNum) {
    const num = firstNum[0];
    return [num + num.charAt(0) + w.substring(num.length)];
  }
  return [];
};

const rule_11c = (t) => {
  const w = t.join('');
  return [w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()];
};

// Phone Rules
const isPhoneNumber = (str) => /^0\d{9,10}$/.test(str.replace(/\D/g, ''));

const rule_12a = (t) => {
  const w = t.join('');
  if (isPhoneNumber(w)) return [w + '@'];
  return [];
};

const rule_12b = (t) => {
  const w = t.join('');
  if (isPhoneNumber(w)) return [w + '123'];
  return [];
};

const rule_12c = (t) => {
  const w = t.join('');
  if (isPhoneNumber(w)) return [w + 'vip'];
  return [];
};

const RULES_MAP = {
  '1a': rule_1a, '1b': rule_1b, '1c': rule_1c,
  '2a': rule_2a, '2b': rule_2b, '2c': rule_2c, '2d': rule_2d, '2e': rule_2e, '2f': rule_2f, '2g': rule_2g,
  '3a': rule_3a, '3b': rule_3b, '3c': rule_3c, '3d': rule_3d, '3e': rule_3e, '3f': rule_3f, '3g': rule_3g,
  '4a': rule_4a, '4b': rule_4b, '4c': rule_4c, '4d': rule_4d, '4e': rule_4e, '4f': rule_4f,
  '5a': rule_5a, '5b': rule_5b, '5c': rule_5c, '5d': rule_5d, '5e': rule_5e, '5f': rule_5f, '5g': rule_5g,
  '6a': rule_6a, '6b': rule_6b, '6c': rule_6c, '6d': rule_6d, '6e': rule_6e, '6f': rule_6f,
  '7a': rule_7a, '7b': rule_7b, '7c': rule_7c,
  '8a': rule_8a, '8b': rule_8b,
  '9a': rule_9a, '9b': rule_9b,
  '10a': rule_10a, '10b': rule_10b, '10c': rule_10c, '10d': rule_10d,
  '11a': rule_11a, '11b': rule_11b, '11c': rule_11c,
  '12a': rule_12a, '12b': rule_12b, '12c': rule_12c
};

async function applyRuleChain(base, user, selectedRules, depth, limit) {
  const results = new Set([base]);
  let currentLayer = [base];
  const MAX_LENGTH = 20;

  for (let layer = 0; layer < depth; layer++) {
    const nextLayer = new Set();

    for (const pwd of currentLayer) {
      const tokens = tokenize(pwd);

      for (const ruleId of selectedRules) {
        if (results.size >= limit) break;

        const ruleFn = RULES_MAP[ruleId];
        if (!ruleFn) continue;

        try {
          const variants = ruleId.startsWith('10') ? ruleFn(user) : ruleFn(tokens);
          const variantsArray = Array.isArray(variants) ? variants : [variants];

          for (const v of variantsArray) {
            if (results.size >= limit) break;
            if (validVariant(v, base, MAX_LENGTH)) {
              results.add(v);
              nextLayer.add(v);
            }
          }
        } catch (e) {
          console.error(`Error in rule ${ruleId}:`, e);
        }
      }
    }

    currentLayer = Array.from(nextLayer);
    if (currentLayer.length === 0) break;
  }

  results.delete(base);
  return Array.from(results);
}

module.exports = {
  RULES_MAP,
  applyRuleChain,
  LEET_MAP
};
