import { DataSource } from 'typeorm';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

interface DatabaseStats {
  connected: boolean;
  imcCount: number;
  userCount?: number;
  error?: string;
}

async function checkPostgres(): Promise<DatabaseStats> {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT || '5432', 10),
    username: process.env.PG_USERNAME || 'postgres',
    password: process.env.PG_PASSWORD || 'postgresimc',
    database: process.env.DB_DATABASE || 'imc_db',
    entities: [],
    synchronize: false,
  });

  try {
    await dataSource.initialize();

    const imcCountResult = await dataSource.query('SELECT COUNT(*) as count FROM imc');
    const userCountResult = await dataSource.query('SELECT COUNT(*) as count FROM "users"');

    const stats: DatabaseStats = {
      connected: true,
      imcCount: parseInt(imcCountResult[0].count),
      userCount: parseInt(userCountResult[0].count),
    };

    await dataSource.destroy();
    return stats;
  } catch (error) {
    return {
      connected: false,
      imcCount: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function checkMongoDB(): Promise<DatabaseStats> {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27018/imc_db';
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db(process.env.DB_DATABASE || 'imc_db');

    const imcCount = await db.collection('imc').countDocuments();
    const userCount = await db.collection('users').countDocuments();

    await client.close();

    return {
      connected: true,
      imcCount,
      userCount,
    };
  } catch (error) {
    return {
      connected: false,
      imcCount: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  console.log('Verificando estado de las bases de datos...\n');
  console.log('='.repeat(60));

  console.log('\nPostgreSQL:');
  console.log('-'.repeat(60));
  const pgStats = await checkPostgres();

  if (pgStats.connected) {
    console.log('Estado: Conectado');
    console.log(`Usuarios: ${pgStats.userCount}`);
    console.log(`Registros IMC: ${pgStats.imcCount}`);

    if (pgStats.userCount === 0) {
      console.log('No hay usuarios. Crea usuarios usando la API primero.');
    }
    if (pgStats.imcCount === 0) {
      console.log('No hay datos de IMC. Ejecuta: npm run seed:postgres');
    }
  } else {
    console.log('Estado: Desconectado');
    console.log(`Error: ${pgStats.error}`);
  }

  console.log('\nMongoDB:');
  console.log('-'.repeat(60));
  const mongoStats = await checkMongoDB();

  if (mongoStats.connected) {
    console.log('Estado: Conectado');
    console.log(`Usuarios: ${mongoStats.userCount}`);
    console.log(`Registros IMC: ${mongoStats.imcCount}`);

    if (mongoStats.imcCount > 0) {
      console.log('Ya hay datos en MongoDB.');
    }
  } else {
    console.log('Estado: Desconectado');
    console.log(`Error: ${mongoStats.error}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\nRecomendaciones:\n');

  if (!pgStats.connected) {
    console.log('1. PostgreSQL no está disponible. Verifica la conexión.');
  } else if (pgStats.userCount === 0) {
    console.log('1. Crea usuarios primero.');
  } else if (pgStats.imcCount === 0) {
    console.log('1. Genera datos de prueba: npm run seed:postgres');
    console.log('2. Migrar a MongoDB: npm run migrate:all');
  } else if (!mongoStats.connected) {
    console.log('1. MongoDB no está disponible. Verifica la conexión.');
  } else if (mongoStats.imcCount === 0) {
    console.log('1. Listo para migrar: npm run migrate:all');
  } else {
    const ratio = mongoStats.imcCount / pgStats.imcCount;
    if (ratio < 0.9) {
      console.log('1. MongoDB tiene menos datos que PostgreSQL.');
      console.log(' Considera ejecutar la migración nuevamente.');
    } else if (ratio > 1.1) {
      console.log('1. MongoDB tiene más datos que PostgreSQL.');
      console.log(' Puede haber datos duplicados.');
    } else {
      console.log('1. Los datos están sincronizados.');
      console.log(' PostgreSQL: ' + pgStats.imcCount + ' registros');
      console.log(' MongoDB: ' + mongoStats.imcCount + ' registros');
    }
  }

  console.log('\n' + '='.repeat(60));
}

main()
  .then(() => {
    console.log('\nVerificación completada\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nError:', error);
    process.exit(1);
  });
