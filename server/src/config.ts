
export const config = {
  PORT: Number(process.env.PORT || 4000),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  UPLOAD_DIR: new URL('../uploads/', import.meta.url),
};
