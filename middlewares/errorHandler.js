export const errorHandler = (err, req, res, next) => {
  console.error('Error Stack:', err.stack);

  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'Conflict: A record with that value already exists.'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`
  });
};

