import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { repeat } from 'rxjs';

dotenv.config();

const categorias = {
  bajoPeso: 'Bajo peso',
  normal: 'Peso normal',
  sobrepeso: 'Sobrepeso',
  obesidad: 'Obesidad',
};

function calcularIMC(peso: number, altura: number): number {
  return parseFloat((peso / (altura * altura)).toFixed(2));
}

function determinarCategoria(imc: number): string {
  if (imc < 18.5) return categorias.bajoPeso;
  if (imc < 25) return categorias.normal;
  if (imc < 30) return categorias.sobrepeso;
  return categorias.obesidad;
}

function generarFechaAleatoria(diasAtras: number): Date {
  const ahora = new Date();
  const dias = Math.floor(Math.random() * diasAtras);
  const fecha = new Date(ahora);
  fecha.setDate(fecha.getDate() - dias);
  return fecha;
}

async function seedData() {
  console.log('Generando datos de prueba en PostgreSQL...\n');

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
    console.log('Conectando a PostgreSQL...');
    await dataSource.initialize();
    console.log('Conectado\n');

    const usuarios = await dataSource.query('SELECT id FROM users ORDER BY id LIMIT 5');

    if (usuarios.length === 0) {
      console.log('No se encontraron usuarios en la base de datos.');
      console.log('Crea un usuario primero.\n');
      return;
    }

    console.log(`Encontrados ${usuarios.length} usuarios\n`);

    const datosPrueba = [
      { peso: 85, altura: 1.75 },
      { peso: 83, altura: 1.75 },
      { peso: 81, altura: 1.75 },
      { peso: 79, altura: 1.75 },
      { peso: 77, altura: 1.75 },

      { peso: 70, altura: 1.70 },
      { peso: 71, altura: 1.70 },
      { peso: 69, altura: 1.70 },
      { peso: 70, altura: 1.70 },

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

      console.log(`Generando datos para usuario ${usuario.id}...`);

      for (let i = 0; i < numRegistros; i++) {
        const datos = datosPrueba[Math.floor(Math.random() * datosPrueba.length)];
        const imc = calcularIMC(datos.peso, datos.altura);
        const categoria = determinarCategoria(imc);
        const fecha = generarFechaAleatoria(90); // Últimos 90 días

        await dataSource.query(
          `INSERT INTO imc (peso, altura, imc, categoria, fecha, "userId") 
          VALUES ($1, $2, $3, $4, $5, $6)`,
          [datos.peso, datos.altura, imc, categoria, fecha, usuario.id]
        );

        insertados++;
      }

      console.log(`${numRegistros} registros insertados para el usuario ${usuario.id}`);
    }

    console.log('-'.repeat(50));
    console.log(`\nTotal de registros insertados: ${insertados}\n`);

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

    console.log('-'.repeat(50));
    console.log('Estadísticas de datos insertados:\n');
    stats.forEach((stat: any) => {
      console.log(` - Usuario ${stat.userId}: ${stat.total} registros`);
      console.log(` IMC promedio: ${stat.imc_promedio}`);
      console.log(` Período: ${new Date(stat.primera_fecha).toLocaleDateString()} - ${new Date(stat.ultima_fecha).toLocaleDateString()}`);
    });

    console.log('\nDatos generados correctamente');

  } catch (error) {
    console.error('Error durante la generación:', error);
    throw error;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('\nDesconectado de PostgreSQL');
    }
  }
}

// Ejecutar seed
seedData()
  .then(() => {
    console.log('\nFinalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n Error fatal:', error);
    process.exit(1);
  });
