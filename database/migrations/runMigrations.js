const { sequelize } = require('../../config/database');
const { User, Product, Order, OrderItem } = require('../../models');

const runMigrations = async () => {
  try {
    console.log('🔄 Running database migrations...');
    
    // Sync all models with database
    await sequelize.sync({ force: false, alter: true });
    
    console.log('✅ Database migrations completed successfully');
    
    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ where: { email: 'admin@sajhabajha.com' } });
    if (!adminExists) {
      await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@sajhabajha.com',
        password: 'admin123',
        role: 'admin',
        isActive: true,
        emailVerified: true
      });
      console.log('✅ Admin user created');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigrations(); 