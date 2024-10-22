import bcrypt from 'bcryptjs'

const createHash = async (data) => {
  const saltRounds = parseInt(process.env.SALT, 10);
  if (!saltRounds) {
    throw new Error("SALT environment variable is not defined or invalid.");
  }

  if (data) {
    return await bcrypt.hash(data, saltRounds);
  }
};

export default createHash;
