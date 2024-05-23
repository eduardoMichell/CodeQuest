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
    const now = Math.floor(Date.now() / 1000);  
    const secret = process.env.JWT_SECRET;
    const expiresIn = "1d"; 

    const token = jwt.sign({ userID, iat: now }, secret, { expiresIn });
    return { error: false, result: { userID, token, expiresIn, iat: now } };
  } catch (error) {
    return { error: true, result: null, message: error.message };
  }
}

const verifyAccessToken = async (token) => {
  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    return { auth: true, token: decoded, userID: decoded.userID};
  } catch (e) {
    console.error('Token verification failed:', e.message); 
    return { auth: false, token: null, message: e.message };
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