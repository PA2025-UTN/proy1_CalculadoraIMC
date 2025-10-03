import { DataSource } from 'typeorm';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

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

async function migrateData() {
 console.log('Iniciando migracion de PostgreSQL a MongoDB...\n');
 console.log('NOTA: Este script solo migra registros de IMC.');
 console.log(' Para migrar usuarios Y registros IMC, usa: npm run migrate:all\n');

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
 const imcCollection = mongoDb.collection('imc');
 console.log(' Conectado a MongoDB\n');

 // Obtener todos los registros de IMC desde PostgreSQL
 console.log(' Obteniendo datos de PostgreSQL...');
 const query = `
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
 `;
 
 const imcRecords: ImcPostgres[] = await postgresDataSource.query(query);
 console.log(` Encontrados ${imcRecords.length} registros en PostgreSQL\n`);

 if (imcRecords.length === 0) {
 console.log(' No hay datos para migrar. Finalizando...');
 return;
 }

 // Transformar y migrar datos a MongoDB
 console.log(' Transformando y migrando datos a MongoDB...');
 
 const mongoRecords: ImcMongo[] = imcRecords.map((record) => ({
 peso: record.peso,
 altura: record.altura,
 imc: record.imc,
 categoria: record.categoria,
 fecha: record.fecha,
 userId: record.userId.toString(), // Convertir el ID num rico a string para MongoDB
 }));

 // Verificar si ya existen registros en MongoDB
 const existingCount = await imcCollection.countDocuments();
 if (existingCount > 0) {
 console.log(` Ya existen ${existingCount} registros en MongoDB.`);
 console.log(' Desea continuar? Los datos se agregar n (no se eliminar n los existentes).');
 console.log('Para limpiar la colecci n antes de migrar, ejecute: db.imc.deleteMany({}) en MongoDB\n');
 }

 // Insertar en MongoDB
 if (mongoRecords.length > 0) {
 const result = await imcCollection.insertMany(mongoRecords);
 console.log(` Migrados ${result.insertedCount} registros exitosamente\n`);
 }

 // Estadísticas de migración
 console.log(' Estadísticas de migración:');
 console.log(` - Registros en PostgreSQL: ${imcRecords.length}`);
 console.log(` - Registros migrados a MongoDB: ${mongoRecords.length}`);
 console.log(` - Total en MongoDB: ${await imcCollection.countDocuments()}\n`);

 // Mostrar resumen por usuario
 console.log(' Resumen por usuario:');
 const pipeline = [
 {
 $group: {
 _id: '$userId',
 count: { $sum: 1 },
 primeraFecha: { $min: '$fecha' },
 ultimaFecha: { $max: '$fecha' },
 },
 },
 {
 $sort: { _id: 1 },
 },
 ];
 
 const userStats = await imcCollection.aggregate(pipeline).toArray();
 userStats.forEach((stat) => {
 console.log(` - Usuario ${stat._id}: ${stat.count} registros (${new Date(stat.primeraFecha).toLocaleDateString()} - ${new Date(stat.ultimaFecha).toLocaleDateString()})`);
 });

 console.log('\n Migración completada exitosamente!');

 } catch (error) {
 console.error(' Error durante la migración:', error);
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
migrateData()
 .then(() => {
 console.log('\n Proceso de migración finalizado!');
 process.exit(0);
 })
 .catch((error) => {
 console.error('\n Error fatal:', error);
 process.exit(1);
 });
