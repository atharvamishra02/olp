module.exports = {
  secret: process.env.JWT_SECRET || 'supersecretkey',
  accessTokenExpiresIn: undefined, // or a short time like '15m'
  refreshTokenExpiresIn: '7d', // or longer
}; 