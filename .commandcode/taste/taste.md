# Code Style
- Keep hardcoded hex color values — do NOT refactor to MUI theme tokens. Visual improvements should preserve existing hex color patterns. Confidence: 0.85
- When answering questions, do not modify any code — provide explanations and suggestions without making direct code changes. Confidence: 0.85

# Tooling
- Prefers OpenRouter API as the AI provider over Groq — expects all AI API calls across the backend to use OpenRouter consistently, not a mix of providers. Confidence: 0.90
