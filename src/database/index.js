import { Sequelize, Op } from 'sequelize'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a SQLite database file in the project directory
const dbPath = path.join(__dirname, '..', '..', 'database.sqlite');

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: console.log
});

export const db = async () => {
  try {
    await sequelize.authenticate();
    console.log("database connected successfully")
    
    await sequelize.sync({alter:true})
    console.log("database connected successfully")

  } catch (e) {
    console.error("fail to connect database successfully",e) // Log the error
  }
}

// Export the Op object for use in queries
export { Op };



