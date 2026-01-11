import { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

// Same structure of token in generateAccessToken
export type AuthPayload = JwtPayload & {
  userId: string;
  permissions: string[];
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "🚫 Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!token) {
    return res
      .status(401)
      .json({ message: "🚫 Unauthorized: No token provided" });
  }

  if (!secret) {
    throw new Error(
      "JWT_ACCESS_SECRET is not defined in environment variables"
    );
  }

  try {
    const decoded = jwt.verify(token, secret) as AuthPayload;

    // Security check: ensure the payload has what we need
    if (!decoded.userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.auth = decoded;
    next();
  } catch (error: any) {
    return res.status(401).json({
      message:
        error.name === "TokenExpiredError" ? "Token expired" : "Unauthorized",
    });
  }
};

// check for permissions
export const hasPermission = (requiredPermission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // req.auth from isAuthenticated
    const userPermissions = req.auth?.permissions || [];

    // If SUPER_ADMIN (User) has 'SYS-ALL', he weill pass all checks
    if (userPermissions.includes("SYS-ALL")) {
      return next();
    }

    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({
        message: "Forbidden: You do not have the required permission",
      });
    }

    next();
  };
};
