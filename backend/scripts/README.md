# Scripts de Migración y Datos de Prueba

Este directorio contiene scripts para facilitar la migración de datos desde PostgreSQL a MongoDB y generar datos de prueba.

## ndice

1. [Verificar Estado de Bases de Datos](#1-verificar-estado-de-bases-de-datos)
2. [Generar Datos de Prueba](#2-generar-datos-de-prueba)
3. [Migrar Datos](#3-migrar-datos)
 - [Migración Completa (Usuarios + IMC)](#migración-completa-recomendado)
 - [Migración Solo IMC](#migración-solo-imc)

## 1. Verificar Estado de Bases de Datos

Script para verificar el estado de conexi n y datos en ambas bases de datos.

### Ejecutar Verificación

```bash
npm run db:check
```

Este script muestra:
- Estado de conexi n de PostgreSQL y MongoDB
- Cantidad de usuarios en cada base de datos
- Cantidad de registros IMC en cada base de datos
- Recomendaciones sobre qué hacer a continuaci n

### Ejemplo de salida

```
 Verificando estado de las bases de datos...
============================================================

 PostgreSQL:
------------------------------------------------------------
 Estado: Conectado
 Usuarios: 3
 Registros IMC: 15

 MongoDB:
------------------------------------------------------------
 Estado: Conectado
 Usuarios: 3
 Registros IMC: 0
 No hay datos de IMC en MongoDB.

============================================================

 Recomendaciones:

1. Listo para migrar: npm run migrate:pg-to-mongo
```

## 2. Generar Datos de Prueba

Script para generar datos de prueba en PostgreSQL antes de realizar la migración.

### Ejecutar Seed

```bash
npm run seed:postgres
```

Este script:
- Busca usuarios existentes en la base de datos
- Genera entre 3-7 registros de IMC por usuario
- Utiliza datos variados (diferentes pesos y alturas)
- Distribuye los registros en los ÚÚltimos 90 d as
- Calcula autom ticamente el IMC y la categor a

**Nota**: Primero debes tener usuarios registrados en el sistema.

### Ejemplo de salida

```
 Iniciando seed de datos de prueba en PostgreSQL...

 Conectando a PostgreSQL...
 Conectado a PostgreSQL

 Encontrados 3 usuarios

 Generando datos para usuario 1...
 5 registros insertados
 Generando datos para usuario 2...
 4 registros insertados
 Generando datos para usuario 3...
 6 registros insertados

 Total de registros insertados: 15

 Estadísticas de datos insertados:
 - Usuario 1: 5 registros
 IMC promedio: 24.50
 Período: 01/10/2024 - 20/12/2024
```

## 3. Migrar Datos

Hay dos opciones para migrar datos:

### Migración Completa (Recomendado)

**Script**: `migrate-all-data.ts`

Migra **usuarios** y **registros de IMC** desde PostgreSQL a MongoDB, manteniendo las relaciones correctas.

#### Ejecutar Migración Completa

```bash
npm run migrate:all
```

Este script:
- Migra todos los usuarios de PostgreSQL a MongoDB
- Crea un mapeo de IDs (PostgreSQL number MongoDB ObjectId string)
- Migra todos los registros de IMC con las referencias correctas
- No duplica usuarios existentes (verifica por email)
- Muestra estadísticas detalladas por usuario

** Recomendado para**: Migración inicial o completa del sistema

### Migración Solo IMC

**Script**: `migrate-postgres-to-mongo.ts`

Migra **solo los registros de IMC** desde PostgreSQL a MongoDB.

#### Ejecutar Migración Solo IMC

```bash
npm run migrate:pg-to-mongo
```

 **IMPORTANTE**: Este script asume que los usuarios ya existen en MongoDB con IDs que coinciden con los de PostgreSQL. salo solo si ya migraste usuarios previamente.

** Recomendado para**: Actualizar solo datos de IMC cuándo los usuarios ya están en MongoDB

---

## Detalles de Migración Completa

Este es el m todo recomendado para la mayor a de los casos.

### Requisitos Previos

1. Tener PostgreSQL y MongoDB corriendo y accesibles
2. Asegurarse de que las credenciales en `.env` están correctamente configuradas
3. Tener datos en PostgreSQL para migrar

### Variables de Entorno Necesarias

```bash
# PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_USERNAME=postgres
PG_PASSWORD=postgresimc

# MongoDB
MONGO_URI=mongodb://imc:mongoimc@localhost:27018/imc_db?authSource=admin

# Base de datos
DB_DATABASE=imc_db
```

### Cómo Ejecutar la Migración

Desde la carpeta `backend`, ejecutar:

```bash
npm run migrate:pg-to-mongo
```

O directamente con ts-node:

```bash
npx ts-node -r tsconfig-paths/register scripts/migrate-postgres-to-mongo.ts
```

### Qué hace el script

1. **Conecta a PostgreSQL**: Lee todos los registros de la tabla `imc`
2. **Conecta a MongoDB**: Accede a la colecci n `imc`
3. **Transforma los datos**: Convierte el formato de PostgreSQL al formato de MongoDB
 - Convierte `userId` de n mero a string
 - Mantiene todos los demás campos (peso, altura, imc, categoria, fecha)
4. **Inserta en MongoDB**: Agrega todos los registros a la colecci n
5. **Muestra estadísticas**: Resumen de la migración por usuario

### Transformaci n de Datos

#### PostgreSQL (TypeORM)
```typescript
{
 id: number, // ID auto-incremental
 peso: number, // Peso en kg
 altura: number, // Altura en metros
 imc: number, // Valor calculado del IMC
 categoria: string, // Categor a del IMC
 fecha: Date, // Timestamp de creación
 userId: number // Relaci n con usuario (n mero)
}
```

#### MongoDB (Mongoose)
```typescript
{
 _id: ObjectId, // ID generado por MongoDB
 peso: number, // Peso en kg
 altura: number, // Altura en metros
 imc: number, // Valor calculado del IMC
 categoria: string, // Categor a del IMC
 fecha: Date, // Timestamp de creación
 userId: string // ID del usuario (string)
}
```

### Notas Importantes

- **No elimina datos**: El script agrega datos a MongoDB sin eliminar los existentes
- **Mantiene PostgreSQL**: Los datos originales en PostgreSQL no se modifican
- **Duplicados**: Si ejecutas el script m ltiples veces, duplicar los datos
- **Limpiar MongoDB**: Para limpiar la colecci n antes de migrar, ejecuta en MongoDB:
 ```javascript
 use imc_db
 db.imc.deleteMany({})
 ```

### Verificación Post-Migración

#### En PostgreSQL
```sql
SELECT COUNT(*) FROM imc;
SELECT "userId", COUNT(*) FROM imc GROUP BY "userId";
```

#### En MongoDB
```javascript
use imc_db
db.imc.countDocuments()
db.imc.aggregate([
 { $group: { _id: "$userId", count: { $sum: 1 } } }
])
```

### Troubleshooting

#### Error de conexi n a PostgreSQL
- Verifica que PostgreSQL est corriendo: `pg_isready`
- Verifica las credenciales en `.env`
- Verifica que el usuario tenga permisos sobre la base de datos

#### Error de conexi n a MongoDB
- Verifica que MongoDB est corriendo: `mongosh --eval "db.version()"`
- Verifica la URI de conexi n en `.env`
- Verifica que el usuario tenga permisos sobre la base de datos

#### Error "Cannot find module"
- Instala las dependencias: `npm install`
- Verifica que `ts-node` est instalado

### Ejemplo de Salida

```
 Iniciando migración de PostgreSQL a MongoDB...

 Conectando a PostgreSQL...
 Conectado a PostgreSQL

 Conectando a MongoDB...
 Conectado a MongoDB

 Obteniendo datos de PostgreSQL...
 Encontrados 15 registros en PostgreSQL

 Transformando y migrando datos a MongoDB...
 Migrados 15 registros exitosamente

 Estadísticas de migración:
 - Registros en PostgreSQL: 15
 - Registros migrados a MongoDB: 15
 - Total en MongoDB: 15

 Resumen por usuario:
 - Usuario 1: 8 registros (01/12/2024 - 15/12/2024)
 - Usuario 2: 7 registros (05/12/2024 - 18/12/2024)

 Migración completada exitosamente!

 Cerrando conexiones...
 Desconectado de PostgreSQL
 Desconectado de MongoDB

 Proceso de migración finalizado!
```

---

## Flujo Completo Recomendado

Para realizar la migración completa, sigue estos pasos en orden:

### Paso 1: Verificar Estado Inicial

```bash
npm run db:check
```

Esto te mostrar el estado actual de ambas bases de datos.

### Paso 2: Preparar Datos (si es necesario)

Si no tienes datos de prueba en PostgreSQL:

**2a. Crear usuarios** (usando la API):
```bash
# Inicia el servidor en modo PostgreSQL
# En .env: DB_TYPE=postgres
npm run dev

# En otro terminal, registra usuarios de prueba
curl -X POST http://localhost:3000/auth/register \
 -H "Content-Type: application/json" \
 -d '{"username":"usuario1","email":"user1@test.com","password":"password123"}'
```

**2b. Generar datos de IMC**:
```bash
npm run seed:postgres
```

### Paso 3: Verificar Datos de Origen

```bash
npm run db:check
```

Deberías ver registros en PostgreSQL listos para migrar.

### Paso 4: Ejecutar Migración

```bash
npm run migrate:pg-to-mongo
```

### Paso 5: Verificar Migración

```bash
npm run db:check
```

Ambas bases de datos deberían tener la misma cantidad de registros.

### Paso 6: Cambiar a MongoDB

Actualiza el archivo `.env`:
```bash
DB_TYPE=mongo
```

Reinicia el servidor:
```bash
npm run dev
```

Ahora la aplicaci n usar MongoDB para nuevos registros.

---

## Resumen de Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run db:check` | Verifica el estado de ambas bases de datos |
| `npm run seed:postgres` | Genera datos de prueba en PostgreSQL |
| `npm run migrate:pg-to-mongo` | Migra datos de PostgreSQL a MongoDB |

---

## Arquitectura de la Migración

```

 PostgreSQL 
 (imc table) 

 
 Lee datos
 

 Script de 
 Migración 
 (TypeScript) 

 
 Transforma y escribe
 

 MongoDB 
 (imc collection)

```

### Transformaciones Clave

- **userId**: `number` `string`
- **id**: Se descarta (MongoDB genera `_id` autom ticamente)
- **Todos los demás campos**: Se mantienen sin cambios

---

## FAQ

### Puedo ejecutar la migración m ltiples veces?

S , pero duplicar los datos en MongoDB. Si necesitas rehacer la migración:

```bash
# Conectar a MongoDB
mongosh mongodb://imc:mongoimc@localhost:27018/imc_db --authenticationDatabase admin

# Limpiar colecci n
use imc_db
db.imc.deleteMany({})

# Salir y ejecutar migración nuevamente
exit
npm run migrate:pg-to-mongo
```

### Los datos en PostgreSQL se eliminan?

No, el script solo **lee** de PostgreSQL y **escribe** en MongoDB. Los datos originales se mantienen intactos.

### Puedo usar ambas bases de datos simult neamente?

S , puedes cambiar entre bases de datos modificando la variable `DB_TYPE` en el `.env`:
- `DB_TYPE=postgres` - Usa PostgreSQL
- `DB_TYPE=mongo` - Usa MongoDB

### Qué pasa con los nuevos registros después de la migración?

Después de cambiar a MongoDB (`DB_TYPE=mongo`), todos los nuevos cálculos de IMC se guardar n en MongoDB. Los datos en PostgreSQL quedan como hist rico.

### Cómo verifico que los datos migraron correctamente?

```bash
# Opci n 1: Usar el script de verificación
npm run db:check

# Opci n 2: Comparar manualmente
# PostgreSQL
psql -U postgres -d imc_db -c "SELECT COUNT(*) FROM imc;"

# MongoDB
mongosh mongodb://imc:mongoimc@localhost:27018/imc_db --authenticationDatabase admin --eval "db.imc.countDocuments()"
```

---

## Soporte

Si encuentras problemas durante la migración:

1. Verifica que ambas bases de datos están corriendo
2. Verifica las credenciales en el archivo `.env`
3. Revisa los logs del script para identificar el error
4. Ejecuta `npm run db:check` para ver el estado actual


