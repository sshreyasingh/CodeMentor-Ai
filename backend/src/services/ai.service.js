const env = require('../config/env');

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// DeepSeek model via OpenRouter
const MODEL_NAME = 'deepseek/deepseek-coder';
const FALLBACK_MODEL = 'deepseek/deepseek-chat';

const buildReviewPrompt = (code, language) => `You are an expert code reviewer with 20 years of experience. Analyze the following ${language} code and identify ONLY REAL issues - do NOT flag correct code as buggy.

## Code to review (${language}):

\`\`\`${language}
${code}
\`\`\`

## IMPORTANT RULES - READ CAREFULLY:

1. **ONLY report ACTUAL bugs** - code that would cause runtime errors, crashes, or incorrect behavior
2. **DO NOT report false positives** - if the code is syntactically correct and logically sound, do NOT flag it
3. **DO NOT suggest stylistic changes** as bugs (e.g., variable naming preferences, formatting)
4. **ONLY use "high" severity** for critical issues that would definitely cause crashes or security vulnerabilities
5. **Verify syntax is actually wrong** before reporting syntax errors
6. **Consider context** - a variable might be defined in a scope you can't see
7. **Empty arrays are OK** - if code is correct, return empty arrays for bugs/security/optimizations

## Required JSON output structure:

{
  "bugs": [
    { 
      "severity": "high|medium|low", 
      "line": <actual_line_number>, 
      "description": "specific actual bug description", 
      "suggestion": "specific fix" 
    }
  ],
  "optimizations": [
    { 
      "title": "optimization title", 
      "description": "why this helps", 
      "before": "current code snippet", 
      "after": "improved code snippet" 
    }
  ],
  "security": [
    { 
      "severity": "high|medium|low", 
      "line": <actual_line_number>, 
      "issue": "actual security vulnerability", 
      "remediation": "how to fix" 
    }
  ],
  "complexity": {
    "bigONotation": "e.g., O(n)",
    "cyclomaticComplexity": <number>,
    "readability": <1-10>,
    "suggestions": ["specific improvement if needed"]
  },
  "documentation": [
    { 
      "target": "function or class name", 
      "issue": "what's missing", 
      "suggestion": "suggested docs" 
    }
  ]
}

## STRICT RULES:
- Return ONLY valid JSON, no markdown, no prose
- If no bugs found, bugs MUST be an empty array: []
- If no security issues, security MUST be an empty array: []
- Line numbers MUST be accurate (count from 1)
- Be CONSERVATIVE - only report definite issues, not maybes
- When in doubt, DO NOT report it as a bug`;

const parseAIResponse = (raw) => {
  console.log('[AI Service] Raw response:', raw.substring(0, 500));
  
  let text = raw;
  // Remove markdown code blocks
  text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
  text = text.trim();

  // Extract JSON object
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error('No valid JSON object found in AI response');
  }

  return JSON.parse(match[0]);
};

const validateAndCleanResults = (result) => {
  // Remove any bugs that seem like false positives
  if (result.bugs && Array.isArray(result.bugs)) {
    result.bugs = result.bugs.filter(bug => {
      // Filter out vague descriptions that might be false positives
      const vaguePatterns = [
        /syntax error/i,
        /missing semicolon/i,
        /should be/i,
        /prefer/i,
        /consider/i,
        /maybe/i,
        /possibly/i,
        /might/i,
      ];
      
      const isVague = vaguePatterns.some(pattern => 
        pattern.test(bug.description || '')
      );
      
      // Keep only if it has specific, actionable details
      return !isVague || bug.severity === 'high';
    });
  }
  
  return result;
};

const makeOpenRouterRequest = async (model, messages, temperature = 0.05, maxTokens = 4096) => {
  console.log(`[AI Service] Making request to OpenRouter API with model: ${model}`);
  
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.openrouterApiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'CodeMentor AI',
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('[AI Service] OpenRouter API error:', errorData);
    throw new Error(errorData.error?.message || `OpenRouter API error: ${response.status} - ${response.statusText}`);
  }

  return await response.json();
};

const reviewCode = async (code, language) => {
  if (!code || !language) {
    return { bugs: [], optimizations: [], security: [], complexity: {}, documentation: [] };
  }

  // Check if API key is configured
  if (!env.openrouterApiKey || env.openrouterApiKey === 'your_openrouter_api_key_here') {
    console.error('[AI Service] No OpenRouter API key configured');
    return {
      bugs: [],
      optimizations: [],
      security: [],
      complexity: { error: 'AI review unavailable: No API key configured. Please set OPENROUTER_API_KEY in your .env file' },
      documentation: [],
    };
  }

  try {
    console.log(`[AI Service] Starting code review for ${language}`);
    
    const messages = [
      {
        role: 'system',
        content: 'You are a conservative, accurate code reviewer. You ONLY report definite bugs, not stylistic preferences or uncertain issues. Output ONLY valid JSON.',
      },
      { role: 'user', content: buildReviewPrompt(code, language) },
    ];

    let data;
    try {
      // Use very low temperature for more deterministic, conservative results
      data = await makeOpenRouterRequest(MODEL_NAME, messages, 0.05, 4096);
    } catch (primaryError) {
      console.log('[AI Service] Primary model failed, trying fallback:', primaryError.message);
      data = await makeOpenRouterRequest(FALLBACK_MODEL, messages, 0.05, 4096);
    }

    const raw = data.choices?.[0]?.message?.content;

    if (!raw) {
      throw new Error('Empty response from AI');
    }

    let result = parseAIResponse(raw);
    
    // Validate and clean results to reduce false positives
    result = validateAndCleanResults(result);
    
    console.log(`[AI Service] Review completed. Found ${result.bugs?.length || 0} bugs`);
    return result;
  } catch (error) {
    console.error('[AI Service] Review error:', error.message);
    return {
      bugs: [],
      optimizations: [],
      security: [],
      complexity: { error: `AI review unavailable: ${error.message}` },
      documentation: [],
    };
  }
};

const chatWithAI = async (currentCode, language, question, history = []) => {
  if (!question) return { reply: 'Please ask a question.' };

  // Check if API key is configured
  if (!env.openrouterApiKey || env.openrouterApiKey === 'your_openrouter_api_key_here') {
    console.error('[AI Service] No OpenRouter API key configured');
    return { reply: 'AI assistant is unavailable: No API key configured. Please set OPENROUTER_API_KEY in your .env file' };
  }

  const systemPrompt = `You are an expert coding mentor and teaching assistant. You help developers understand, debug, and improve their code. Be concise, clear, and practical. Use code examples when helpful. Format responses in Markdown.

The user is currently working in **${language}**.
Their current code is shown below. Reference it in your answers when relevant.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map((h) => ({
      role: h.role,
      content: h.role === 'user' && h.codeContext
        ? `My current code (${language}):
\`\`\`${language}
${h.codeContext}
\`\`\`

My question: ${h.content}`
        : h.content,
    })),
    {
      role: 'user',
      content: currentCode
        ? `My current code (${language}):
\`\`\`${language}
${currentCode}
\`\`\`

My question: ${question}`
        : question,
    },
  ];

  try {
    let data;
    try {
      data = await makeOpenRouterRequest(MODEL_NAME, messages, 0.3, 4096);
    } catch (primaryError) {
      console.log('[AI Service] Primary model failed, trying fallback:', primaryError.message);
      data = await makeOpenRouterRequest(FALLBACK_MODEL, messages, 0.3, 4096);
    }

    const raw = data.choices?.[0]?.message?.content;
    console.log('[AI Service] Chat response received');
    return { reply: raw || 'I could not generate a response. Please try again.' };
  } catch (error) {
    console.error('[AI Service] Chat error:', error.message);
    return { reply: `AI assistant is currently unavailable: ${error.message}` };
  }
};

module.exports = { reviewCode, chatWithAI };
