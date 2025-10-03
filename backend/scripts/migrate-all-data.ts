import { DataSource } from 'typeorm';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Interfaz para los datos de Usuario en PostgreSQL
interface UserPostgres {
 id: number;
 usuario: string;
 email: string;
 password: string;
}

// Interfaz para los datos de Usuario en MongoDB
interface UserMongo {
 usuario: string;
 email: string;
 password: string;
 postgresId: number; // Guardamos el ID original para mapear los IMC
}

// Interfaz para los datos de IMC en PostgreSQL
interface ImcPostgres {
 id: number;
 peso: number;
 altura: number;
 imc: number;
 categoria: string;
 fecha: Date;
 userId: number;
}

// Interfaz para los datos de IMC en MongoDB
interface ImcMongo {
 peso: number;
 altura: number;
 imc: number;
 categoria: string;
 fecha: Date;
 userId: string;
}

async function migrateAllData() {
 console.log(' Iniciando migración completa de PostgreSQL a MongoDB...\n');

 // Configuración de PostgreSQL
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

 // Configuración de MongoDB
 const mongoUri = process.env.MONGO_URI || 'mongodb://imc:mongoimc@localhost:27018/imc_db?authSource=admin';
 const mongoClient = new MongoClient(mongoUri);

 try {
 // Conectar a PostgreSQL
 console.log(' Conectando a PostgreSQL...');
 await postgresDataSource.initialize();
 console.log(' Conectado a PostgreSQL\n');

 // Conectar a MongoDB
 console.log(' Conectando a MongoDB...');
 await mongoClient.connect();
 const mongoDb = mongoClient.db(process.env.DB_DATABASE || 'imc_db');
 const usersCollection = mongoDb.collection('users');
 const imcCollection = mongoDb.collection('imc');
 console.log(' Conectado a MongoDB\n');

 // ========== PASO 1: MIGRAR USUARIOS ==========
 console.log(' PASO 1: Migrando usuarios...');
 console.log(''.repeat(60));

 const users: UserPostgres[] = await postgresDataSource.query(`
 SELECT id, usuario, email, password
 FROM users
 ORDER BY id ASC
 `);

 console.log(` Encontrados ${users.length} usuarios en PostgreSQL`);

 if (users.length === 0) {
 console.log(' No hay usuarios para migrar. Finalizando...');
 return;
 }

 // Mapeo de IDs: PostgreSQL (number) -> MongoDB (ObjectId string)
 const userIdMap = new Map<number, string>();

 // Verificar usuarios existentes en MongoDB
 const existingUsersCount = await usersCollection.countDocuments();
 if (existingUsersCount > 0) {
 console.log(` Ya existen ${existingUsersCount} usuarios en MongoDB.`);
 console.log('Los usuarios existentes no serán duplicados.\n');
 }

 // Migrar usuarios
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
 console.log(` Usuario "${user.usuario}" migrado (${user.email})`);
 }
 }

 console.log(`\n Usuarios procesados: ${users.length}`);
 console.log(` - Migrados: ${userIdMap.size - existingUsersCount}`);
 console.log(` - Ya exist an: ${existingUsersCount}\n`);

 // ========== PASO 2: MIGRAR REGISTROS IMC ==========
 console.log(' PASO 2: Migrando registros de IMC...');
 console.log(''.repeat(60));

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

 console.log(` Encontrados ${imcRecords.length} registros de IMC en PostgreSQL`);

 if (imcRecords.length === 0) {
 console.log(' No hay datos de IMC para migrar.\n');
 } else {
 // Verificar registros existentes en MongoDB
 const existingImcCount = await imcCollection.countDocuments();
 if (existingImcCount > 0) {
 console.log(` Ya existen ${existingImcCount} registros de IMC en MongoDB.`);
 console.log('Para limpiar: db.imc.deleteMany({})\n');
 }

 // Transformar y migrar datos de IMC
 const mongoImcRecords: ImcMongo[] = [];
 let skippedRecords = 0;

 for (const record of imcRecords) {
 const mongoUserId = userIdMap.get(record.userId);
 
 if (!mongoUserId) {
 console.log(` Registro IMC ignorado: usuario ${record.userId} no encontrado`);
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
 console.log(` Migrados ${result.insertedCount} registros de IMC\n`);
 
 if (skippedRecords > 0) {
 console.log(` ${skippedRecords} registros ignorados (usuario no encontrado)\n`);
 }
 }
 }

 // ========== ESTAD STICAS FINALES ==========
 console.log(''.repeat(60));
 console.log(' ESTAD STICAS FINALES DE MIGRACI N');
 console.log(''.repeat(60));

 const finalUserCount = await usersCollection.countDocuments();
 const finalImcCount = await imcCollection.countDocuments();

 console.log(`\n USUARIOS:`);
 console.log(` - En PostgreSQL: ${users.length}`);
 console.log(` - En MongoDB: ${finalUserCount}`);

 console.log(`\n REGISTROS IMC:`);
 console.log(` - En PostgreSQL: ${imcRecords.length}`);
 console.log(` - En MongoDB: ${finalImcCount}`);

 // Resumen por usuario en MongoDB
 console.log(`\n RESUMEN POR USUARIO EN MONGODB:`);
 const userStatsQuery = [
 {
 $lookup: {
 from: 'users',
 localField: 'userId',
 foreignField: '_id',
 as: 'user',
 },
 },
 {
 $unwind: '$user',
 },
 {
 $group: {
 _id: '$userId',
 usuario: { $first: '$user.usuario' },
 email: { $first: '$user.email' },
 count: { $sum: 1 },
 primeraFecha: { $min: '$fecha' },
 ultimaFecha: { $max: '$fecha' },
 },
 },
 {
 $sort: { usuario: 1 },
 },
 ];

 const userStats = await imcCollection.aggregate(userStatsQuery).toArray();
 
 if (userStats.length > 0) {
 userStats.forEach((stat) => {
 console.log(` - ${stat.usuario} (${stat.email}): ${stat.count} registros`);
 if (stat.count > 0) {
 console.log(` Período: ${new Date(stat.primeraFecha).toLocaleDateString()} - ${new Date(stat.ultimaFecha).toLocaleDateString()}`);
 }
 });
 } else {
 console.log(' (No hay registros de IMC vinculados)');
 }

 console.log('\n' + ''.repeat(60));
 console.log(' MIGRACI N COMPLETADA EXITOSAMENTE!');
 console.log(''.repeat(60));

 } catch (error) {
 console.error('\n Error durante la migración:', error);
 throw error;
 } finally {
 // Cerrar conexiones
 console.log('\n Cerrando conexiones...');
 
 if (postgresDataSource.isInitialized) {
 await postgresDataSource.destroy();
 console.log(' Desconectado de PostgreSQL');
 }
 
 await mongoClient.close();
 console.log(' Desconectado de MongoDB');
 }
}

// Ejecutar migración
migrateAllData()
 .then(() => {
 console.log('\n Proceso de migración finalizado!');
 console.log('\n Próximos pasos:');
 console.log(' 1. Verificar datos: npm run db:check');
 console.log(' 2. Cambiar a MongoDB en .env: DB_TYPE=mongo');
 console.log(' 3. Reiniciar aplicación: npm run dev\n');
 process.exit(0);
 })
 .catch((error) => {
 console.error('\n Error fatal:', error);
 process.exit(1);
 });
