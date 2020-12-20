import jwt from "jsonwebtoken";
export default (req, res, next) => {
    try {
      const token = req.headers["x-auth"];
      if (!token)
        return res
          .status(401).json({ error: 'no auth token' });
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified)
        return res
          .status(401);
      req.userid = verified.id;
      next();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };