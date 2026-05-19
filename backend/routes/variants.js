const express = require('express');
const router = express.Router();
const { validateProcessRequest, validateCustomPatterns } = require('../middleware/validation');
const { RULES_MAP, applyRuleChain } = require('../utils/rules');
const { validVariant, tokenize } = require('../utils/validators');

const MAX_RESULTS = parseInt(process.env.MAX_RESULTS || 100000);
const MAX_DEPTH = parseInt(process.env.MAX_DEPTH || 4);

// POST /api/variants/basic - Generate basic variants
router.post('/basic', validateProcessRequest, async (req, res) => {
  try {
    const { data, rules, maxResults, chunkSize } = req.validated;
    const results = new Map();
    const limit = Math.min(maxResults, MAX_RESULTS);

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, Math.min(i + chunkSize, data.length));

      for (const item of chunk) {
        if (results.size >= limit) break;

        const { user, pass } = item;
        const tokens = tokenize(pass);

        for (const ruleId of rules) {
          if (results.size >= limit) break;

          const ruleFn = RULES_MAP[ruleId];
          if (!ruleFn) continue;

          try {
            const variants = ruleId.startsWith('10') || ruleId.startsWith('12')
              ? ruleFn(user)
              : ruleFn(tokens);
            const variantsArray = Array.isArray(variants) ? variants : [variants];

            for (const v of variantsArray) {
              if (results.size >= limit) break;
              if (validVariant(v, pass)) {
                const key = `${user.toLowerCase()}:${v}`;
                results.set(key, true);
              }
            }
          } catch (e) {
            console.error(`Error in rule ${ruleId}:`, e);
          }
        }
      }
    }

    const output = Array.from(results.keys()).slice(0, 1000);
    const ratio = data.length > 0 ? (results.size / data.length).toFixed(1) : 0;

    res.json({
      success: true,
      totalGenerated: results.size,
      totalInput: data.length,
      ratio: parseFloat(ratio),
      preview: output,
      previewCount: output.length,
      allResults: Array.from(results.keys())
    });
  } catch (error) {
    console.error('Error in /basic:', error);
    res.status(500).json({ error: 'Processing failed', details: error.message });
  }
});

// POST /api/variants/advanced - Generate advanced variants with chaining
router.post('/advanced', validateProcessRequest, async (req, res) => {
  try {
    const { data, rules, depth: userDepth, maxResults, chunkSize } = req.validated;
    const results = new Map();
    const limit = Math.min(maxResults, MAX_RESULTS);
    const depth = Math.min(userDepth, MAX_DEPTH);

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, Math.min(i + chunkSize, data.length));

      for (const item of chunk) {
        if (results.size >= limit) break;

        const { user, pass } = item;
        const variants = await applyRuleChain(pass, user, rules, depth, limit - results.size);

        for (const v of variants) {
          if (results.size >= limit) break;
          const key = `${user.toLowerCase()}:${v}`;
          results.set(key, true);
        }
      }
    }

    const output = Array.from(results.keys()).slice(0, 1000);
    const ratio = data.length > 0 ? (results.size / data.length).toFixed(1) : 0;

    res.json({
      success: true,
      totalGenerated: results.size,
      totalInput: data.length,
      ratio: parseFloat(ratio),
      depth,
      preview: output,
      previewCount: output.length,
      allResults: Array.from(results.keys())
    });
  } catch (error) {
    console.error('Error in /advanced:', error);
    res.status(500).json({ error: 'Processing failed', details: error.message });
  }
});

// POST /api/variants/custom - Generate from custom patterns
router.post('/custom', validateCustomPatterns, async (req, res) => {
  try {
    const { data, prefixes, suffixes, separators, maxResults } = req.validated;
    const results = new Map();
    const limit = Math.min(maxResults, MAX_RESULTS);

    for (const item of data) {
      if (results.size >= limit) break;

      const { user, pass } = item;

      // Add suffixes
      for (const suffix of suffixes) {
        if (results.size >= limit) break;
        const variant = pass + suffix;
        if (validVariant(variant, pass)) {
          const key = `${user.toLowerCase()}:${variant}`;
          results.set(key, true);
        }
      }

      // Add prefixes
      for (const prefix of prefixes) {
        if (results.size >= limit) break;
        const variant = prefix + pass;
        if (validVariant(variant, pass)) {
          const key = `${user.toLowerCase()}:${variant}`;
          results.set(key, true);
        }
      }

      // Add separators
      for (const sep of separators) {
        if (results.size >= limit) break;
        const m = pass.match(/^([A-Za-z]+)(\d+)$/) || pass.match(/^(\d+)([A-Za-z]+)$/);
        if (m) {
          const letters = /[a-zA-Z]/.test(m[1]) ? m[1] : m[2];
          const digits = /\d/.test(m[1]) ? m[1] : m[2];
          const variant = letters + sep + digits;
          if (validVariant(variant, pass)) {
            const key = `${user.toLowerCase()}:${variant}`;
            results.set(key, true);
          }
        }
      }
    }

    const output = Array.from(results.keys()).slice(0, 1000);
    const ratio = data.length > 0 ? (results.size / data.length).toFixed(1) : 0;

    res.json({
      success: true,
      totalGenerated: results.size,
      totalInput: data.length,
      ratio: parseFloat(ratio),
      preview: output,
      previewCount: output.length,
      allResults: Array.from(results.keys())
    });
  } catch (error) {
    console.error('Error in /custom:', error);
    res.status(500).json({ error: 'Processing failed', details: error.message });
  }
});

module.exports = router;
