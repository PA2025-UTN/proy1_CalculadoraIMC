import { DataSource } from 'typeorm';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

interface UserPostgres {
  id: number;
  usuario: string;
  email: string;
  password: string;
}

interface UserMongo {
  usuario: string;
  email: string;
  password: string;
  postgresId: number;
}

interface ImcPostgres {
  id: number;
  peso: number;
  altura: number;
  imc: number;
  categoria: string;
  fecha: Date;
  userId: number;
}

interface ImcMongo {
  peso: number;
  altura: number;
  imc: number;
  categoria: string;
  fecha: Date;
  userId: string;
}

async function migrateAllData() {
  console.log('Migrando datos de PostgreSQL a MongoDB...\n');

  const postgresDataSource = new DataSource({
    type: 'postgres',
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT || '5432', 10),
    username: process.env.PG_USERNAME || 'postgres',
    password: process.env.PG_PASSWORD || 'postgresimc',
    database: process.env.DB_DATABASE || 'imc_db',
    entities: [],
    synchronize: false,
  });

  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27018/imc_db';
  const mongoClient = new MongoClient(mongoUri);

  try {
    console.log('Conectando a PostgreSQL...');
    await postgresDataSource.initialize();
    console.log('Conectado a PostgreSQL\n');

    console.log('Conectando a MongoDB...');
    await mongoClient.connect();
    const mongoDb = mongoClient.db(process.env.DB_DATABASE || 'imc_db');
    const usersCollection = mongoDb.collection('users');
    const imcCollection = mongoDb.collection('imc');
    console.log('Conectado a MongoDB\n');

    console.log('PASO 1: Migrando usuarios...');
    console.log('-'.repeat(60));

    const users: UserPostgres[] = await postgresDataSource.query(`
      SELECT id, usuario, email, password
      FROM users
      ORDER BY id ASC
    `);

    console.log(`Encontrados ${users.length} usuarios en PostgreSQL`);

    if (users.length === 0) {
      console.log('No hay usuarios para migrar. Finalizando...');
      return;
    }

    // Mapeo de IDs: PostgreSQL (number) -> MongoDB (ObjectId string)
    const userIdMap = new Map<number, string>();

    const existingUsersCount = await usersCollection.countDocuments();
    if (existingUsersCount > 0) {
      console.log(`Ya existen ${existingUsersCount} usuarios en MongoDB.`);
      console.log('Los usuarios existentes no serán duplicados.\n');
    }

    for (const user of users) {
      // Verificar si el usuario ya existe por email
      const existingUser = await usersCollection.findOne({ email: user.email });

      if (existingUser) {
        console.log(` Usuario "${user.usuario}" ya existe (email: ${user.email})`);
        userIdMap.set(user.id, existingUser._id.toString());
      } else {
        const mongoUser: UserMongo = {
          usuario: user.usuario,
          email: user.email,
          password: user.password,
          postgresId: user.id,
        };

        const result = await usersCollection.insertOne(mongoUser as any);
        userIdMap.set(user.id, result.insertedId.toString());
        console.log(`Usuario "${user.usuario}" migrado (${user.email})`);
      }
    }

    console.log(`\nUsuarios procesados: ${users.length}`);
    console.log(` - Migrados: ${userIdMap.size - existingUsersCount}`);
    console.log(` - Ya existen: ${existingUsersCount}\n`);

    console.log('PASO 2: Migrando registros de IMC...');
    console.log('-'.repeat(60));

    const imcRecords: ImcPostgres[] = await postgresDataSource.query(`
      SELECT 
      i.id,
      i.peso,
      i.altura,
      i.imc,
      i.categoria,
      i.fecha,
      i."userId" as "userId"
      FROM imc i
      ORDER BY i.fecha ASC
    `);

    console.log(`Encontrados ${imcRecords.length} registros de IMC en PostgreSQL`);

    if (imcRecords.length === 0) {
      console.log('No hay datos de IMC para migrar.\n');
    } else {
      // Verificar registros existentes en MongoDB
      const existingImcCount = await imcCollection.countDocuments();
      if (existingImcCount > 0) {
        console.log(`Ya existen ${existingImcCount} registros de IMC en MongoDB.`);
        console.log('Para limpiar: db.imc.deleteMany({})\n');
      }

      // Transformar y migrar datos de IMC
      const mongoImcRecords: ImcMongo[] = [];
      let skippedRecords = 0;

      for (const record of imcRecords) {
        const mongoUserId = userIdMap.get(record.userId);

        if (!mongoUserId) {
          console.log(`Registro IMC ignorado: usuario ${record.userId} no encontrado`);
          skippedRecords++;
          continue;
        }

        mongoImcRecords.push({
          peso: record.peso,
          altura: record.altura,
          imc: record.imc,
          categoria: record.categoria,
          fecha: record.fecha,
          userId: mongoUserId,
        });
      }

      // Insertar en MongoDB
      if (mongoImcRecords.length > 0) {
        const result = await imcCollection.insertMany(mongoImcRecords);
        console.log(`Migrados ${result.insertedCount} registros de IMC\n`);

        if (skippedRecords > 0) {
          console.log(`${skippedRecords} registros ignorados (usuario no encontrado)\n`);
        }
      }
    }

    console.log('='.repeat(60));
    console.log('ESTADÍSTICAS FINALES');
    console.log('='.repeat(60));

    const finalUserCount = await usersCollection.countDocuments();
    const finalImcCount = await imcCollection.countDocuments();

    console.log(`\nUSUARIOS:`);
    console.log(` - En PostgreSQL: ${users.length}`);
    console.log(` - En MongoDB: ${finalUserCount}`);

    console.log(`\nREGISTROS IMC:`);
    console.log(` - En PostgreSQL: ${imcRecords.length}`);
    console.log(` - En MongoDB: ${finalImcCount}`);


    console.log('\n' + '='.repeat(60));
    console.log(' MIGRACIÓN COMPLETADA EXITOSAMENTE');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\nError durante la migración:', error);
    throw error;
  } finally {
    console.log('Cerrando conexiones...');

    if (postgresDataSource.isInitialized) {
      await postgresDataSource.destroy();
      console.log('Desconectado de PostgreSQL');
    }

    await mongoClient.close();
    console.log('Desconectado de MongoDB');
  }
}

// Ejecutar migración
migrateAllData()
  .then(() => {
    console.log('\n Proceso de migración finalizado');
    console.log('\n Próximos pasos:');
    console.log('1. Verificar datos: npm run db:check');
    console.log('2. Cambiar a MongoDB en .env: DB_TYPE=mongo');
    console.log('3. Reiniciar aplicación: npm run dev\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n Error:', error);
    process.exit(1);
  });
