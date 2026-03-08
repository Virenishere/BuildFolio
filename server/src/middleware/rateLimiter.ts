import rateLimit from "express-rate-limit";

/**
 * Standard API rate limiter — applied to all routes.
 * 100 requests per 15 minutes per IP.
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests — please try again in 15 minutes",
  },
});

/**
 * AI-specific rate limiter — stricter because each call hits Gemini.
 * 20 requests per 15 minutes per IP.
 *
 * In production you may want to key by userId instead of IP (requires a
 * custom keyGenerator) to prevent auth-bypass attacks.
 */
export const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "AI rate limit reached — you can make 20 AI requests per 15 minutes",
  },
});
