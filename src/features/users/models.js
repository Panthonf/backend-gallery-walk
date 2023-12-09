import pool from "../../db/db.js";

async function getAllUsers() {
  const query = 'SELECT * FROM public."User"';
  const result = await pool.query(query);
  return result.rows;
}

async function getUserById(userId) {
  const query = 'SELECT * FROM public."User" WHERE id = $1';
  const result = await pool.query(query, [userId]);
  return result.rows[0];
}

async function checkUser(email) {
  const query = 'SELECT * FROM public."User" WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
}

async function createUser(userData) {
  const query =
    'INSERT INTO public."User" (first_name_th, last_name_th, first_name_en, last_name_en, email, affiliation, profile_pic) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
  const result = await pool.query(query, [
    userData.first_name_th,
    userData.last_name_th,
    userData.first_name_en,
    userData.last_name_en,
    userData.email,
    userData.affiliation,
    userData.profile_pic,
  ]);
  return result.rows[0];
}

async function deleteUser(userId) {
  const query = 'DELETE FROM public."User" WHERE id = $1';
  const result = await pool.query(query, [userId]);
  return result.rows[0];
}

async function getUserByEmail(email){
  const query = 'SELECT * FROM public."User" WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
}

export { getUserById, getAllUsers, checkUser, createUser, deleteUser, getUserByEmail };
