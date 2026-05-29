const db = require('../config/db');

const createUser = async (name, email, hashedPassword, role) => {
  const result = await db.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
    [name, email, hashedPassword, role]
  );
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const updateUser = async (id, name, email, hashedPassword) => {
  if (hashedPassword) {
    const res = await db.query(
      'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, name, email, role',
      [name, email, hashedPassword, id]
    );
    return res.rows[0];
  } else {
    const res = await db.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, role',
      [name, email, id]
    );
    return res.rows[0];
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  updateUser
};
