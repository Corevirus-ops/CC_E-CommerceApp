
const checkValidCharacters = (req, res, next) => {
  const allowedCharsRegex = /^[a-zA-Z0-9\s.,!?-@]+$/; 

  // Iterate over all body properties and check against the regex
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      if (!allowedCharsRegex.test(req.body[key])) {
        return res.status(400).json({ // Return Bad Request if invalid character found
          msg: `Invalid characters found in field: ${key}. Only alphanumeric, spaces, and basic punctuation are allowed.`
        });
      }
    }
  }

  // If all checks pass, pass control to the next handler
  next();
};

module.exports = checkValidCharacters;