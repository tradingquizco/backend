import { jwtVerify, SignJWT } from 'jose';
import dotenv from 'dotenv';

dotenv.config();

const key = new TextEncoder().encode(process.env.AUTH_SECRET);

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
  sameSite: 'lax',
  path: '/',
  maxAge: 24 * 60 * 60, // 1 day in seconds
};

/**
 * Encrypts the payload into a JWT.
 * @param {Object} payload - The data to be encrypted.
 * @returns {Promise<string>} - The encrypted JWT.
 */
export const encrypt = async (payload) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // Set the expiration time
    .sign(key);
};

/**
 * Decrypts and verifies the JWT.
 * @param {string} session - The JWT to decrypt.
 * @returns {Promise<Object|null>} - The payload if valid, or null if invalid.
 */
export const decrypt = async (session) => {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (err) {
    console.log('Session decryption error:', err);
    return null;
  }
};

/**
 * Creates a session for the user and sets the session cookie.
 * @param {string} userId - The user ID to associate with the session.
 * @param {Response} res - The response object.
 */
export const createSession = async (userId, res) => {
  const session = await encrypt({ userId });
  res.cookie('session', session, cookieOptions);
};

/**
 * Verifies the session and retrieves the user ID.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const verifySession = async (req, res, next) => {
  const sessionCookie = req.cookies.session;
  const session = await decrypt(sessionCookie);
  if (!session?.userId) {
    return res.redirect('/login');
  }
  req.userId = session.userId; // Attach userId to request for further processing
  next();
};

/**
 * Deletes the session cookie and redirects to login.
 * @param {Response} res - The response object.
 */
export const deleteSession = (res) => {
  res.clearCookie('session');
};