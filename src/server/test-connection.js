// Quick database connection test
// Run: node server/test-connection.js

import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function testConnection() {
  console.log('🔌 Testing Neon database connection...\n');
  
  try {
    // Test basic query
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
    
    console.log('✅ Connection successful!');
    console.log('📊 PostgreSQL version:', result[0].pg_version.split(' ')[0]);
    console.log('⏰ Current time:', result[0].current_time);
    
    // Check if tables exist
    const tables = await sql`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;
    
    console.log('\n📋 Existing tables:');
    if (tables.length === 0) {
      console.log('   ⚠️  No tables found. Run the schema SQL to create them.');
      console.log('   📝 See: NEON_SETUP_NOW.md');
    } else {
      tables.forEach(t => console.log(`   ✅ ${t.tablename}`));
    }
    
    // Check if auth tables exist
    const authTables = ['users', 'otp_codes', 'sessions', 'user_profiles'];
    const existingAuthTables = tables.map(t => t.tablename);
    const missingTables = authTables.filter(t => !existingAuthTables.includes(t));
    
    if (missingTables.length > 0) {
      console.log('\n⚠️  Missing required tables:', missingTables.join(', '));
      console.log('   Run the schema SQL from: NEON_SETUP_NOW.md');
    } else {
      console.log('\n✅ All auth tables exist!');
      
      // Check for users
      const userCount = await sql`SELECT COUNT(*) as count FROM users`;
      console.log(`👥 Total users: ${userCount[0].count}`);
      
      const sessionCount = await sql`SELECT COUNT(*) as count FROM sessions WHERE expires_at > NOW()`;
      console.log(`🔐 Active sessions: ${sessionCount[0].count}`);
    }
    
    console.log('\n🎉 Database is ready to use!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check DATABASE_URL in /server/.env');
    console.error('   2. Make sure Neon database is running');
    console.error('   3. Verify connection string is correct');
  }
}

testConnection();
