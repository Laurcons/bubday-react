// import dotenv from 'dotenv';

// dotenv.config();

function tryGet<T = string>(key: string, transform?: (val: string) => T): T {
  const val = import.meta.env[key];
  if (!val) throw new Error(`Missing envvar ${key}`);
  if (transform) {
    return transform(val);
  }
  return val as T;
}

export const Config = {
  apiUrl: tryGet('VITE_PUBLIC_API_URL'),
};
