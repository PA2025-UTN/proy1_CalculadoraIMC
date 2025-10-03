import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Categor as de IMC
const categorias = {
 bajoPeso: 'Bajo peso',
 normal: 'Peso normal',
 sobrepeso: 'Sobrepeso',
 obesidad: 'Obesidad',
};

// Funci n para calcular IMC
function calcularIMC(peso: number, altura: number): number {
 return parseFloat((peso / (altura * altura)).toFixed(2));
}

// Funci n para determinar categor a
function determinarCategoria(imc: number): string {
 if (imc < 18.5) return categorias.bajoPeso;
 if (imc < 25) return categorias.normal;
 if (imc < 30) return categorias.sobrepeso;
 return categorias.obesidad;
}

// Funci n para generar fecha aleatoria en los ÚÚltimos N d as
function generarFechaAleatoria(diasAtras: number): Date {
 const ahora = new Date();
 const dias = Math.floor(Math.random() * diasAtras);
 const fecha = new Date(ahora);
 fecha.setDate(fecha.getDate() - dias);
 return fecha;
}

async function seedData() {
 console.log(' Iniciando seed de datos de prueba en PostgreSQL...\n');

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
 // Conectar
 console.log(' Conectando a PostgreSQL...');
 await dataSource.initialize();
 console.log(' Conectado a PostgreSQL\n');

 // Verificar si existen usuarios
 const usuarios = await dataSource.query('SELECT id FROM users ORDER BY id LIMIT 5');
 
 if (usuarios.length === 0) {
 console.log(' No se encontraron usuarios en la base de datos.');
 console.log('Por favor, crea usuarios primero usando la API de registro.\n');
 return;
 }

 console.log(` Encontrados ${usuarios.length} usuarios\n`);

 // Datos de prueba variados
 const datosPrueba = [
 // Usuario con evoluci n positiva (perdiendo peso)
 { peso: 85, altura: 1.75 },
 { peso: 83, altura: 1.75 },
 { peso: 81, altura: 1.75 },
 { peso: 79, altura: 1.75 },
 { peso: 77, altura: 1.75 },
 
 // Usuario con peso normal estable
 { peso: 70, altura: 1.70 },
 { peso: 71, altura: 1.70 },
 { peso: 69, altura: 1.70 },
 { peso: 70, altura: 1.70 },
 
 // Usuario con diferentes mediciones
 { peso: 95, altura: 1.80 },
 { peso: 60, altura: 1.65 },
 { peso: 55, altura: 1.60 },
 { peso: 110, altura: 1.85 },
 { peso: 75, altura: 1.78 },
 { peso: 68, altura: 1.72 },
 ];

 let insertados = 0;

 // Insertar datos de prueba para cada usuario
 for (const usuario of usuarios) {
 const numRegistros = Math.floor(Math.random() * 5) + 3; // 3-7 registros por usuario
 
 console.log(` Generando datos para usuario ${usuario.id}...`);
 
 for (let i = 0; i < numRegistros; i++) {
 const datos = datosPrueba[Math.floor(Math.random() * datosPrueba.length)];
 const imc = calcularIMC(datos.peso, datos.altura);
 const categoria = determinarCategoria(imc);
 const fecha = generarFechaAleatoria(90); // ÚÚltimos 90 d as

 await dataSource.query(
 `INSERT INTO imc (peso, altura, imc, categoria, fecha, "userId") 
 VALUES ($1, $2, $3, $4, $5, $6)`,
 [datos.peso, datos.altura, imc, categoria, fecha, usuario.id]
 );
 
 insertados++;
 }
 
 console.log(` ${numRegistros} registros insertados`);
 }

 console.log(`\n Total de registros insertados: ${insertados}\n`);

 // Mostrar estadísticas
 const stats = await dataSource.query(`
 SELECT 
 "userId",
 COUNT(*) as total,
 MIN(fecha) as primera_fecha,
 MAX(fecha) as ultima_fecha,
 ROUND(AVG(imc)::numeric, 2) as imc_promedio
 FROM imc
 GROUP BY "userId"
 ORDER BY "userId"
 `);

 console.log(' Estadísticas de datos insertados:');
 stats.forEach((stat: any) => {
 console.log(` - Usuario ${stat.userId}: ${stat.total} registros`);
 console.log(` IMC promedio: ${stat.imc_promedio}`);
 console.log(` Período: ${new Date(stat.primera_fecha).toLocaleDateString()} - ${new Date(stat.ultima_fecha).toLocaleDateString()}`);
 });

 console.log('\n Seed completado exitosamente!');

 } catch (error) {
 console.error(' Error durante el seed:', error);
 throw error;
 } finally {
 if (dataSource.isInitialized) {
 await dataSource.destroy();
 console.log('\n Desconectado de PostgreSQL');
 }
 }
}

// Ejecutar seed
seedData()
 .then(() => {
 console.log('\n Proceso de seed finalizado!');
 process.exit(0);
 })
 .catch((error) => {
 console.error('\n Error fatal:', error);
 process.exit(1);
 });
