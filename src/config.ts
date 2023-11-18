import { config as dotenvConfig } from "dotenv";

dotenvConfig({ path: `.env.${process.env.NODE_ENV ?? "development"}` });

export const config = {
  host: process.env.HOST || "0.0.0.0",
  port: process.env.PORT || 8008,
  jwtSecret: process.env.JWT_SECRET,
  mongoUri: process.env.MONGO_URI,
};
