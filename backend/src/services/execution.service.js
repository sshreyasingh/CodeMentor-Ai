const env = require('../config/env');
const JDOODLE_CLIENT_ID = env.jdoodleClientId;
const JDOODLE_CLIENT_SECRET = env.jdoodleClientSecret;
const JDOODLE_API_URL = 'https://api.jdoodle.com/execute';

// Language mapping for JDoodle API
// https://docs.jdoodle.com/integrating-compiler-ide-to-your-application/languages-and-versions-supported
const LANGUAGE_CODES = {
  javascript: 'nodejs',
  typescript: 'typescript',
  python: 'python3',
  java: 'java',
  cpp: 'cpp17',
  go: 'go',
};

// File extension mapping
const FILE_EXTENSIONS = {
  javascript: 'js',
  typescript: 'ts',
  python: 'py',
  java: 'java',
  cpp: 'cpp',
  go: 'go',
};

/**
 * Execute code using JDoodle API
 * @param {string} code - The code to execute
 * @param {string} language - The programming language
 * @returns {Promise<{output: string, error: string}>}
 */
const executeCode = async (code, language, stdin = '') => {
  if (!code || !language) {
    return { output: '', error: 'Code and language are required' };
  }

  // Check if language is supported
  if (!LANGUAGE_CODES[language]) {
    return {
      output: '',
      error: `Language '${language}' is not supported. Supported languages: ${Object.keys(LANGUAGE_CODES).join(', ')}`,
    };
  }

  // Limit code size (100KB max)
  const MAX_CODE_SIZE = 100 * 1024;
  if (code.length > MAX_CODE_SIZE) {
    return { output: '', error: 'Code exceeds maximum size of 100KB' };
  }

  // Check if JDoodle credentials are configured
  if (!JDOODLE_CLIENT_ID || !JDOODLE_CLIENT_SECRET) {
    return {
      output: '',
      error: 'JDoodle API credentials are not configured.\n\nTo fix this:\n1. Sign up at https://www.jdoodle.com/compiler-api\n2. Get your Client ID and Client Secret\n3. Update .env with:\n   JDOODLE_CLIENT_ID=your_client_id\n   JDOODLE_CLIENT_SECRET=your_client_secret',
    };
  }

  try {
    const response = await fetch(JDOODLE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script: code,
        language: LANGUAGE_CODES[language],
        versionIndex: '0',
        clientId: JDOODLE_CLIENT_ID,
        clientSecret: JDOODLE_CLIENT_SECRET,
        stdin: stdin,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `JDoodle API error: ${response.status}`);
    }

    const result = await response.json();

    // Process the result
    let output = '';
    let error = '';

    // JDoodle response format:
    // output: stdout output
    // statusCode: 200 for success, other values for errors
    // memory: memory used
    // cpuTime: CPU time used
    // error: error message if any

    if (result.error) {
      // API-level error
      error = `Error: ${result.error}`;
    } else if (result.statusCode !== 200) {
      // Compilation or runtime error
      error = `Execution Error (Status: ${result.statusCode}):\n${result.output || 'Unknown error'}`;
    } else {
      // Successful execution
      output = result.output || '';

      // Add execution stats if available
      const stats = [];
      if (result.cpuTime) stats.push(`CPU Time: ${result.cpuTime}s`);
      if (result.memory) stats.push(`Memory: ${result.memory}KB`);

      if (stats.length > 0) {
        output += (output ? '\n' : '') + `\n---\n${stats.join(' | ')}`;
      }
    }

    return { output, error };
  } catch (err) {
    console.error('Code execution error:', err);

    // Provide helpful error messages for common issues
    let errorMessage = err.message;

    if (err.message.includes('fetch failed') || err.code === 'ECONNREFUSED' || err.message.includes('ECONNREFUSED')) {
      errorMessage = `Code execution service (JDoodle API) is not available.\n\nPlease check your internet connection.`;
    } else if (err.message.includes('401') || err.message.includes('403')) {
      errorMessage = `Authentication failed. Please check your JDoodle Client ID and Client Secret.\n\n1. Sign up at https://www.jdoodle.com/compiler-api\n2. Verify your credentials are correct in .env`;
    } else if (err.message.includes('429')) {
      errorMessage = `Rate limit exceeded. JDoodle free tier has daily execution limits.\n\nConsider upgrading your JDoodle plan or waiting before retrying.`;
    }

    return {
      output: '',
      error: `Execution failed: ${errorMessage}`,
    };
  }
};

module.exports = { executeCode };
