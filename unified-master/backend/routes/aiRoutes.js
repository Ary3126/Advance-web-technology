const express = require('express');
const router = express.Router();
const aiRateLimiter = require('../middleware/rateLimiter');

// Rule-based heuristic fallback generator for Graceful Degradation (Practical 13 Core)
const generateSmartFallback = (title) => {
  const cleanTitle = title.trim();
  const lower = cleanTitle.toLowerCase();

  if (lower.includes('fix') || lower.includes('bug') || lower.includes('error') || lower.includes('crash')) {
    return `Investigate and resolve the issue regarding "${cleanTitle}". Identify root cause, write regression tests, and verify fix in staging.`;
  }
  if (lower.includes('test') || lower.includes('ci') || lower.includes('cd') || lower.includes('pipeline') || lower.includes('github action')) {
    return `Implement automated test suites and continuous integration checks for "${cleanTitle}". Verify pass/fail criteria and report status.`;
  }
  if (lower.includes('deploy') || lower.includes('docker') || lower.includes('container') || lower.includes('kubernetes')) {
    return `Prepare deployment artifacts, configure environment variables, and verify containerized stack for "${cleanTitle}".`;
  }
  if (lower.includes('ui') || lower.includes('frontend') || lower.includes('component') || lower.includes('react')) {
    return `Design and implement the user interface component for "${cleanTitle}". Ensure responsive layout and state validation.`;
  }
  if (lower.includes('api') || lower.includes('backend') || lower.includes('endpoint') || lower.includes('auth')) {
    return `Develop secure REST endpoints for "${cleanTitle}" with input validation, error handling, and documentation.`;
  }

  return `Work on "${cleanTitle}": Define requirements, implement the core functionality, verify against acceptance criteria, and update documentation.`;
};

// Heuristic to suggest priority based on title keywords
const suggestPriority = (title) => {
  const lower = title.toLowerCase();
  if (lower.includes('critical') || lower.includes('urgent') || lower.includes('security') || lower.includes('crash') || lower.includes('fix')) {
    return 'high';
  }
  if (lower.includes('refactor') || lower.includes('cleanup') || lower.includes('docs') || lower.includes('readme')) {
    return 'low';
  }
  return 'medium';
};

/**
 * GET /api/ai/status
 * Reports the readiness of AI providers and fallback engine
 */
router.get('/status', (req, res) => {
  const hasOpenAi = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here');
  const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');

  res.status(200).json({
    status: 'online',
    fallbackReady: true,
    providers: {
      openai: hasOpenAi ? 'configured' : 'unconfigured (using graceful fallback)',
      gemini: hasGemini ? 'configured' : 'unconfigured (using graceful fallback)',
      localHeuristicFallback: 'active'
    },
    rateLimit: '5 requests / minute per client IP',
    responsibleAiNotice: 'Human-in-the-loop review enforced: all drafts are fully user-editable.'
  });
});

/**
 * POST /api/ai/generate-description
 * Generates an editable task description and suggested priority using OpenAI or Google Gemini,
 * with graceful degradation to local heuristic fallback upon failure or missing keys.
 */
router.post('/generate-description', aiRateLimiter(), async (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Task title is required to generate an AI description.'
    });
  }

  const cleanTitle = title.trim();

  // Test failure simulation route / header (Practical 13 Step 6 requirement)
  if (req.headers['x-simulate-ai-failure'] === 'true') {
    if (process.env.NODE_ENV !== 'test') {
      console.warn('[AI Service] Simulated AI provider failure triggered for testing.');
    }
    return res.status(200).json({
      success: true,
      fallback: true,
      source: 'graceful-fallback-simulated',
      description: generateSmartFallback(cleanTitle),
      suggestedPriority: suggestPriority(cleanTitle),
      message: 'Graceful degradation: Simulated AI API failure. Fallback suggestion provided.'
    });
  }

  // 1. Try Google Gemini API if key is present
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Write a concise 1-2 sentence professional task description for a task titled "${cleanTitle}". Respond with the description text only.`
                  }
                ]
              }
            ]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const description = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (description) {
          return res.status(200).json({
            success: true,
            fallback: false,
            source: 'gemini-1.5-flash',
            description,
            suggestedPriority: suggestPriority(cleanTitle)
          });
        }
      }
    } catch (geminiError) {
      if (process.env.NODE_ENV !== 'test') {
        console.warn('[AI Service] Gemini API error:', geminiError.message);
      }
    }
  }

  // 2. Try OpenAI API via REST if key is present
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant in a Task Management application. Return a concise, professional task description (1-2 sentences). Description only.'
            },
            {
              role: 'user',
              content: `Write a short, actionable task description for the task titled: "${cleanTitle}".`
            }
          ],
          max_tokens: 100,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        const description = data.choices?.[0]?.message?.content?.trim();
        if (description) {
          return res.status(200).json({
            success: true,
            fallback: false,
            source: 'openai-gpt-4o-mini',
            description,
            suggestedPriority: suggestPriority(cleanTitle)
          });
        }
      }
    } catch (openaiError) {
      if (process.env.NODE_ENV !== 'test') {
        console.warn('[AI Service] OpenAI API error:', openaiError.message);
      }
    }
  }

  // 3. Graceful Degradation Fallback (Core Practical 13 Requirement)
  // Ensures the web application remains 100% operational even during external outages or missing keys
  return res.status(200).json({
    success: true,
    fallback: true,
    source: 'graceful-degradation-engine',
    description: generateSmartFallback(cleanTitle),
    suggestedPriority: suggestPriority(cleanTitle),
    message: 'Graceful degradation: External AI service unavailable or offline. Intelligent local fallback provided.'
  });
});

module.exports = router;

