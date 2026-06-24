export const requireAuth = (req, _res, next) => {
  // Replace this demo user assignment with JWT verification when auth is added.
  req.user = { id: Number(req.header('x-demo-user-id')) || 1 };
  next();
};
