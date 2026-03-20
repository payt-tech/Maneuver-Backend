export const env = {
  PORT: process.env.PORT || "3000",
  DATABASE_URL: process.env.DATABASE_URL!,
  NEXUS_URL: process.env.NEXUS_URL || "https://frc.nexus/api",
  API_KEY: process.env.API_KEY
};
