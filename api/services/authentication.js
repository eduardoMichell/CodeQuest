const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const authPassword = async (password, hash) => {
  if (!password || !hash) {
    return { message: "No hash and password", error: true, result: false }
  }
  try {
    return { message: "", error: false, result: await bcrypt.compare(password, hash) }
  } catch (error) {
    return { message: error, error: true, result: null }
  }
}

const createAccessToken = async (userID) => {
  try {
    const now = (new Date()).getTime()
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({ userID, iat: now }, secret, { expiresIn: "1d" })
    return { error: false, result: { userID, token, expiresIn: "1d", iat: now } }
  } catch (error) {
    return { error: false, result: null }
  }
}

const verifyAccessToken = async (token) => {
  try {
    const secret = process.env.JWT_SECRET;
    const result = jwt.verify(token, secret);
    const now = new Date();
    const expired = result.exp - now < 0;
    if (expired) {
      return { auth: false, token: result };
    }
    return { auth: true, token: result };
  } catch (e) {
    return { auth: false, token: null }
  }
}

const hashPassword = async (password, saltFactor = 10) => {
  if (!password || typeof (password) !== 'string') {
    return { message: "Password is not a string", error: true, result: {} }
  }

  if (!isValidPassword(password)) {
    return { message: "Invalid Password", error: true, result: { } }
  }

  const salt = bcrypt.genSaltSync(saltFactor);
  return { message: "", error: false, result: await bcrypt.hash(password, salt) }
}

// Password is valid when has ate least:
//  alphanumeric
//  min 8 digits,
//  max 20 digits
const isValidPassword = (password) => {
  if (!password || password === '') {
    return false;
  }
  const validaPass = /^[a-zA-Z0-9]+$/;
  if (!validaPass.test(password)) {
    return false;
  }
  if (Buffer.byteLength(password, 'utf8') < 8) {
    return false;
  }
  if (Buffer.byteLength(password, 'utf8') > 20) {
    return false;
  }
  return true;
}

const createRandomPassword = () => {
  return bcrypt.genSaltSync(DEFAULT_HASH_SALT_FACTOR)
}

module.exports = {
  authPassword,
  createAccessToken,
  verifyAccessToken,
  createRandomPassword,
  hashPassword
}