const { Router } = require('express');
const router = Router();

const settings = [
  {
    key: 'APP_ENV',
    value: 'development',
    description: 'Current application environment',
  },
  {
    key: 'API_TIMEOUT',
    value: 5000,
    description: 'Request timeout in milliseconds',
  },
  {
    key: 'MAX_USERS',
    value: 100,
    description: 'Maximum number of allowed users',
  },
  {
    key: 'FEATURE_DARK_MODE',
    value: false,
    description: 'Enable dark mode UI',
  },
  {
    key: 'LOG_LEVEL',
    value: 'info',
    description: 'Logging verbosity level',
  },
];

router.get('/', (req, res) => {
  res.json(settings);
});

module.exports = router;
