import pg from "pg";
// import dotenv from "dotenv";
// dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test the database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to PostgreSQL:", err);
  } else {
    console.log("Connected to PostgreSQL:", res.rows[0].now);
  }
});

async function createTableIfNotExists(tableName, createTableQuery) {
  try {
    const result = await pool.query(
      `SELECT to_regclass('public."${tableName}"') AS table_exists;`
    );
    const tableExists = !!result.rows[0].table_exists;

    if (!tableExists) {
      await pool.query(createTableQuery);
      console.log(`${tableName} table created successfully.`);
    } else {
      console.log(`${tableName} table already exists.`);
    }
  } catch (error) {
    console.error(`Error checking/creating ${tableName} table:`, error);
  }
}

createTableIfNotExists(
  "User",
  `
    CREATE TABLE public."User" (
      id serial PRIMARY KEY,
      first_name_th VARCHAR(255),
      last_name_th VARCHAR(255),
      first_name_en VARCHAR(255),
      last_name_en VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      affiliation VARCHAR(255),
      profile_pic VARCHAR(255)
    );
  `
);

createTableIfNotExists(
  "Event",
  `
    CREATE TABLE public."Event" (
      id serial PRIMARY KEY,
      event_name VARCHAR(255),
      start_date TIMESTAMP,
      end_date TIMESTAMP,
      assistant_emails VARCHAR[],
      description TEXT,
      submit_start TIMESTAMP,
      submit_end TIMESTAMP,
      number_of_member INT,
      virtual_money INT,
      unit_money VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP,
      created_by_user_id INT
    );
  `
);

export default pool;
