# Cambio 3.2: Migración de Persistencia a MongoDB

## ID: CR-003.2

## Título
Migrar almacenamiento de resultados de IMC a MongoDB

## Descripción
Migración del almacenamiento de resultados desde PostgreSQL a MongoDB para explorar bases de datos NoSQL y preparar el sistema para análisis avanzados, asegurando compatibilidad con las funcionalidades existentes de persistencia de datos.

## Estado
**IMPLEMENTADO**

## Archivos Creados

### Scripts de Migración
1. **`backend/scripts/migrate-postgres-to-mongo.ts`**
   - Script de migración de datos de IMC
   - Lee registros de la tabla `imc` en PostgreSQL
   - Escribe en la colección `imc` de MongoDB
   - Muestra estadísticas de migración

2. **`backend/scripts/migrate-all-data.ts`**
   - Script de migración completa (usuarios + IMC)
   - Migra usuarios de PostgreSQL a MongoDB
   - Mapea IDs de PostgreSQL a MongoDB ObjectId
   - Migra registros IMC con relaciones correctas

3. **`backend/scripts/seed-postgres-data.ts`**
   - Script para generar datos de prueba
   - Genera registros de IMC variados
   - Útil para testing y demostración

4. **`backend/scripts/check-databases.ts`**
   - Script de verificación del estado
   - Muestra conexión y cantidad de registros
   - Proporciona recomendaciones

5. **`backend/scripts/README.md`**
   - Documentación completa de los scripts
   - Guía paso a paso del proceso
   - Troubleshooting y FAQ

### Modificaciones
6. **`backend/package.json`**
   - Agregados 4 nuevos scripts npm:
     - `db:check`: Verifica estado de bases de datos
     - `seed:postgres`: Genera datos de prueba
     - `migrate:pg-to-mongo`: Migra solo IMC
     - `migrate:all`: Migra usuarios + IMC

7. **`backend/src/module/imc/repositories/imc-mongo.repository.ts`**
   - Corregido import de ImcMongoMapper

## Requisitos Funcionales Implementados

### Almacenamiento en MongoDB
- Colección `imc` con todos los campos requeridos:
  - `peso`: Peso en kilogramos
  - `altura`: Altura en metros
  - `imc`: Valor calculado del IMC
  - `categoria`: Clasificación (Bajo peso, Peso normal, Sobrepeso, Obesidad)
  - `fecha`: Timestamp del registro
  - `userId`: Referencia al usuario

### Scripts de Migración
- Transferencia completa de datos desde PostgreSQL a MongoDB
- Migración de usuarios con mapeo de IDs
- Transformación de tipos de datos (userId: number a string/ObjectId)
- Manejo de errores y conexiones
- Estadísticas detalladas de la migración
- Resumen por usuario

## Características Adicionales

### 1. Sistema de Verificación
- Script `db:check` para validar estado de ambas bases de datos
- Recomendaciones automáticas según el estado
- Detección de discrepancias entre bases de datos

### 2. Generación de Datos de Prueba
- Script `seed:postgres` para crear datos de prueba
- Datos variados y realistas
- Distribución temporal en los últimos 90 días

### 3. Documentación Completa
- Guía paso a paso del proceso completo
- Ejemplos de uso y salidas esperadas
- Troubleshooting y FAQ
- Diagramas de flujo

## Cómo Usar

### Verificar Estado
```bash
cd backend
npm run db:check
```

### Generar Datos de Prueba (opcional)
```bash
npm run seed:postgres
```

### Ejecutar Migración Completa (Recomendado)
```bash
npm run migrate:all
```

### Ejecutar Migración Solo IMC
```bash
npm run migrate:pg-to-mongo
```

### Cambiar a MongoDB
Actualizar en `backend/.env`:
```bash
DB_TYPE=mongo
```

## Flujo de Datos

```
PostgreSQL (Origen)     ->     Script de Migración     ->     MongoDB (Destino)
+----------------+              +----------------+              +----------------+
| Tabla: users   |              | TypeScript     |              | Collection:    |
| Tabla: imc     |   Lectura    | Transforma     |   Escritura  | users          |
| userId: INT    | -----------> | Datos          | -----------> | imc            |
| peso: FLOAT    |              |                |              | userId: ObjId  |
+----------------+              +----------------+              +----------------+
```

## Transformaciones de Datos

### Usuarios

| Campo PostgreSQL | Tipo PostgreSQL | Campo MongoDB | Tipo MongoDB |
|-----------------|-----------------|---------------|--------------|
| `id` | INTEGER | - | - |
| `usuario` | VARCHAR | `usuario` | String |
| `email` | VARCHAR | `email` | String |
| `password` | VARCHAR | `password` | String |
| - | - | `_id` | ObjectId |
| - | - | `postgresId` | Number |

### Registros IMC

| Campo PostgreSQL | Tipo PostgreSQL | Campo MongoDB | Tipo MongoDB |
|-----------------|-----------------|---------------|--------------|
| `id` | INTEGER | - | - |
| `peso` | FLOAT | `peso` | Number |
| `altura` | FLOAT | `altura` | Number |
| `imc` | FLOAT | `imc` | Number |
| `categoria` | VARCHAR | `categoria` | String |
| `fecha` | TIMESTAMP | `fecha` | Date |
| `userId` | INTEGER | `userId` | ObjectId |
| - | - | `_id` | ObjectId |

## Validación

### Antes de la Migración
- PostgreSQL contiene datos de usuarios e IMC
- MongoDB está accesible
- Credenciales configuradas en `.env`

### Durante la Migración
- Conexión exitosa a ambas bases de datos
- Lectura de todos los registros de PostgreSQL
- Transformación correcta de tipos de datos
- Inserción exitosa en MongoDB

### Después de la Migración
- Misma cantidad de registros en ambas bases
- Datos verificados por usuario
- Aplicación funciona con MongoDB

## Comandos de Verificación

### PostgreSQL
```sql
-- Contar usuarios
SELECT COUNT(*) FROM users;

-- Contar registros IMC
SELECT COUNT(*) FROM imc;

-- Por usuario
SELECT "userId", COUNT(*) 
FROM imc 
GROUP BY "userId";
```

### MongoDB
```javascript
// Contar usuarios
db.users.countDocuments()

// Contar registros IMC
db.imc.countDocuments()

// Por usuario
db.imc.aggregate([
  { $group: { _id: "$userId", count: { $sum: 1 } } }
])
```

## Notas Importantes

1. **No Destructivo**: La migración NO elimina datos de PostgreSQL
2. **Idempotencia**: Ejecutar múltiples veces puede duplicar datos en MongoDB
3. **Reversibilidad**: Se puede volver a PostgreSQL cambiando `DB_TYPE=postgres`
4. **Compatibilidad**: El código existente funciona sin cambios en ambas bases
5. **Mapeo de IDs**: El script mantiene un mapeo entre IDs de PostgreSQL y ObjectIds de MongoDB

## Testing

Para validar la migración:

1. Ejecutar `npm run db:check` antes de migrar
2. Ejecutar `npm run migrate:all`
3. Ejecutar `npm run db:check` después de migrar
4. Cambiar `DB_TYPE=mongo` y probar la aplicación
5. Verificar que todas las operaciones de IMC funcionen correctamente

## Troubleshooting

### Error de Conexión
- Verificar que las bases de datos estén corriendo
- Revisar credenciales en `.env`
- Verificar puertos y hosts

### Duplicación de Datos
- Limpiar MongoDB antes de migrar:
  ```javascript
  use imc_db
  db.users.deleteMany({})
  db.imc.deleteMany({})
  ```

### Error en Transformación
- Verificar que los tipos de datos sean compatibles
- Revisar logs del script para detalles

### Tabla "user" no existe
- Verificado: La tabla se llama "users" (plural)
- Todos los scripts usan el nombre correcto

## Referencias

- Documentación completa: `backend/scripts/README.md`
- Guía rápida: `GUIA-RAPIDA-MIGRACION.md`
- Comandos útiles: `COMANDOS-UTILES.md`
- Código fuente: `backend/scripts/migrate-all-data.ts`
- Variable de configuración: `DB_TYPE` en `backend/.env`

---

**Fecha de Implementación**: Enero 2025  
**Versión**: 1.0.0  
**Estado**: Implementado y Funcional
