import { sql } from "@vercel/postgres";

export const initializeDatabase = async () => {
  try {
    console.log("Initializing database and creating table if not exists...");

    const createTableQuery = sql`
      CREATE TABLE IF NOT EXISTS schools (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(500) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createIndexQuery = sql`
      CREATE INDEX IF NOT EXISTS idx_coordinates ON schools (latitude, longitude);
    `;

    const createFunctionQuery = sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
         NEW.updated_at = NOW(); 
         RETURN NEW;
      END;
      $$ language 'plpgsql';
    `;

    const createTriggerQuery = sql`
      CREATE OR REPLACE TRIGGER update_schools_updated_at
      BEFORE UPDATE ON schools
      FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_column();
    `;

    await createTableQuery;
    await createIndexQuery;
    await createFunctionQuery;
    await createTriggerQuery;

    console.log("✅ Database initialized successfully.");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
};
