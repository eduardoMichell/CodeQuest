const { verifyAccessToken } = require('../services/authentication')
const { cleanRoute } = require('../common/utils/utils')
const { PUBLIC_ROUTES } = require('../common/constants/public-routes')

const authentication = async (app) => {
  app.use(permit);
}

const permit = async (req, res, next) => {
  const path = req.originalUrl
  const route = cleanRoute(path);
  if (PUBLIC_ROUTES.includes(route)) {
    next();
    return;
  }

  const authToken = req.headers['authorization'];
  if (!authToken) {
    return res.status(401).send({
      error: true,
      message: 'Unauthorized user',
      result: {}
    });
  }
  try {
    const { auth } = await verifyAccessToken(authToken);
    if (auth) {
      next();
      return;
    }
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: error.message,
      result: {}
    });
  }
  return res.status(401).send({
    error: true,
    message: 'Unauthorized user',
    result: {}
  });
}

module.exports = authentication;