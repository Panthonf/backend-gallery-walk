import pg from "pg";
// import dotenv from "dotenv";
// dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Handle pool errors
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

const table_users = "Users";
const table_events = "Events";

const sql_create_users_table = `
  CREATE TABLE IF NOT EXISTS public."${table_users}" (
    id serial PRIMARY KEY,
    first_name_th VARCHAR(255),
    last_name_th VARCHAR(255),
    first_name_en VARCHAR(255),
    last_name_en VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    affiliation VARCHAR(255),
    profile_pic VARCHAR(255)
  );
`;

const sql_create_events_table = `
  CREATE TABLE IF NOT EXISTS public."${table_events}" (
    id serial PRIMARY KEY,
    event_name VARCHAR(255),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    description TEXT,
    submit_start TIMESTAMP,
    submit_end TIMESTAMP,
    number_of_member INT,
    virtual_money INT,
    unit_money VARCHAR(255),
    published BOOLEAN DEFAULT FALSE,
    organization VARCHAR(255),
    video_link VARCHAR(255),
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
  );
`;

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

const query = `DROP TABLE IF EXISTS public."User" CASCADE;`;
const query2 = `DROP TABLE IF EXISTS public."Event" CASCADE;`;

async function dropTable(tableName, dropTableQuery) {
  try {
    await pool.query(dropTableQuery);
    console.log(`${tableName} table dropped successfully.`);
  } catch (error) {
    console.error(`Error dropping ${tableName} table:`, error);
  }
}

dropTable(table_users, query);
dropTable(table_events, query2);

createTableIfNotExists(table_users, sql_create_users_table);
createTableIfNotExists(table_events, sql_create_events_table);

export default pool;
