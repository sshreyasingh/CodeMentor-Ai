const Review = require('../models/review.model');
const Insight = require('../models/insight.model');
const env = require('../config/env');

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const PATTERN_RULES = [
  {
    category: 'nested_loops',
    keywords: ['nested loop', 'nesting', 'for loop inside', 'O(n²)', 'O(n^2)', 'excessive nesting', 'deeply nested'],
    label: 'Excessive Nested Loops',
    severity: 'high',
    recommendation: 'Flatten nested loops using array methods (map, filter, reduce) or extract inner loops into helper functions.',
  },
  {
    category: 'variable_naming',
    keywords: ['variable name', 'naming', 'rename', 'vague', 'ambiguous', 'unclear name', 'single letter', 'var name', 'naming convention'],
    label: 'Poor Variable Naming',
    severity: 'medium',
    recommendation: 'Use descriptive names that convey intent. Avoid single-letter variables except in loops. Follow language conventions (camelCase, snake_case).',
  },
  {
    category: 'null_checks',
    keywords: ['null check', 'undefined check', 'null reference', 'undefined reference', 'typeerror', 'cannot read property', 'null pointer', 'optional chaining', 'nullish'],
    label: 'Missing Null Checks',
    severity: 'high',
    recommendation: 'Add null/undefined guards before accessing properties. Use optional chaining (?.) and nullish coalescing (??) where supported.',
  },
  {
    category: 'error_handling',
    keywords: ['error handling', 'try catch', 'throw', 'error', 'exception', 'catch', 'unhandled', 'swallowing', 'silent fail'],
    label: 'Insufficient Error Handling',
    severity: 'high',
    recommendation: 'Wrap risky operations in try/catch blocks. Log errors properly. Never swallow exceptions silently.',
  },
  {
    category: 'type_safety',
    keywords: ['type', 'typescript', 'type safety', 'type coercion', 'implicit', 'any type', 'type annotation', 'strict mode', 'type error'],
    label: 'Type Safety Issues',
    severity: 'medium',
    recommendation: 'Add explicit type annotations. Enable strict mode. Avoid the "any" type in TypeScript. Validate types at runtime.',
  },
  {
    category: 'performance',
    keywords: ['performance', 'slow', 'optimize', 'bottleneck', 'memory', 'inefficient', 're-render', 'recomputation', 'recalculate', 'cache'],
    label: 'Performance Issues',
    severity: 'medium',
    recommendation: 'Memoize expensive computations. Avoid unnecessary re-renders. Use appropriate data structures for lookups.',
  },
  {
    category: 'security',
    keywords: ['security', 'injection', 'xss', 'csrf', 'vulnerability', 'exposed', 'secret', 'token', 'api key', 'sanitize', 'escape', 'auth'],
    label: 'Security Vulnerabilities',
    severity: 'high',
    recommendation: 'Sanitize user inputs. Never expose secrets in client code. Use environment variables for sensitive data. Validate and escape all outputs.',
  },
  {
    category: 'documentation',
    keywords: ['documentation', 'comment', 'jsdoc', 'docstring', 'undocumented', 'missing doc', 'no comment', 'unclear purpose'],
    label: 'Missing Documentation',
    severity: 'low',
    recommendation: 'Add JSDoc/docstring comments to public functions and complex logic. Document parameters, return types, and edge cases.',
  },
  {
    category: 'code_duplication',
    keywords: ['duplication', 'duplicate', 'repeated', 'dry', 'copy paste', 'redundant', 'same code', 'identical', 'extract'],
    label: 'Code Duplication',
    severity: 'medium',
    recommendation: 'Extract repeated logic into reusable functions or utilities. Apply DRY principle.',
  },
  {
    category: 'complexity',
    keywords: ['complexity', 'complex', 'too long', 'refactor', 'split', 'break down', 'cyclomatic', 'cognitive', 'single responsibility'],
    label: 'High Complexity',
    severity: 'medium',
    recommendation: 'Break large functions into smaller, single-purpose units. Reduce cyclomatic complexity by extracting conditionals.',
  },
];

const findRecurringPatterns = (reviews) => {
  const patternMap = {};

  for (const review of reviews) {
    const allText = [
      ...(review.bugs || []).map((b) => `${b.description} ${b.suggestion}`),
      ...(review.security || []).map((s) => `${s.issue} ${s.remediation}`),
      ...(review.optimizations || []).map((o) => `${o.title} ${o.description}`),
      ...(review.documentation || []).map((d) => `${d.issue} ${d.suggestion}`),
      ...(review.complexity?.suggestions || []),
    ].join(' ').toLowerCase();

    for (const rule of PATTERN_RULES) {
      const matched = rule.keywords.some((kw) => allText.includes(kw.toLowerCase()));
      if (!matched) continue;

      if (!patternMap[rule.category]) {
        patternMap[rule.category] = {
          ...rule,
          count: 0,
          examples: [],
        };
      }
      patternMap[rule.category].count++;

      const snippet = allText.substring(0, 120);
      if (patternMap[rule.category].examples.length < 3 && snippet) {
        patternMap[rule.category].examples.push(snippet);
      }
    }
  }

  return Object.values(patternMap)
    .filter((p) => p.count >= 2)
    .sort((a, b) => b.count - a.count || (a.severity === 'high' ? -1 : 1));
};

const analyzeInsights = async (userId) => {
  const reviews = await Review.find({ user: userId })
    .sort('-createdAt')
    .limit(50)
    .lean();

  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      recurringPatterns: [],
      improvementScore: 0,
      strengths: [],
    };
  }

  const patterns = findRecurringPatterns(reviews);

  const avgReadability = reviews
    .filter((r) => r.complexity?.readability)
    .reduce((sum, r) => sum + r.complexity.readability, 0) /
    Math.max(reviews.filter((r) => r.complexity?.readability).length, 1);

  const improvementScore = Math.round(
    Math.min(100, (avgReadability || 0) * 10 + (reviews.length > 5 ? 15 : 0))
  );

  const strengths = [];
  const highSeverityCount = patterns.filter((p) => p.severity === 'high').length;
  if (avgReadability >= 7) strengths.push('Good code readability');
  if (reviews.length >= 5 && highSeverityCount <= 2) strengths.push('Low high-severity issues');
  if (reviews.length >= 3) strengths.push('Regular code reviews');

  return {
    totalReviews: reviews.length,
    recurringPatterns: patterns.slice(0, 10),
    improvementScore,
    strengths,
  };
};

const updateInsights = async (userId) => {
  const analysis = await analyzeInsights(userId);

  await Insight.findOneAndUpdate(
    { user: userId },
    {
      ...analysis,
      generatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return analysis;
};

const getAIInsightSummary = async (userId) => {
  try {
    const insight = await Insight.findOne({ user: userId }).lean();
    if (!insight || insight.recurringPatterns.length === 0) return null;

    const patternText = insight.recurringPatterns
      .map((p) => `- ${p.label} (${p.count} occurrences, severity: ${p.severity})`)
      .join('\n');

    if (!env.openrouterApiKey) return null;

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': env.clientUrl,
        'X-Title': 'CodeMentor AI',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [
          {
            role: 'system',
            content:
              'You are a coding mentor. Given a list of recurring code issues, provide a short (2-3 sentence) personalized summary of the developer\'s patterns and one actionable priority to focus on. Be encouraging.',
          },
          {
            role: 'user',
            content: `After ${insight.totalReviews} code reviews, here are the recurring patterns:\n\n${patternText}\n\nProvide a short personalized summary and the #1 priority to focus on.`,
          },
        ],
        temperature: 0.4,
        max_tokens: 400,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
};

module.exports = { analyzeInsights, updateInsights, getAIInsightSummary };
