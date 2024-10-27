const express = require('express');
const { runSEOAnalysis } = require('../controllers/seoController');

const router = express.Router();

// POST /api/seo/analyze - analyze SEO for the provided URL
router.post('/analyze', runSEOAnalysis);

module.exports = router;