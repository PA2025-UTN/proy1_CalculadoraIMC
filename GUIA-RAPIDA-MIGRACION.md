# Guía Rápida: Migración PostgreSQL a MongoDB

## Inicio Rápido (5 minutos)

### Paso 1: Verificar Estado
```bash
cd backend
npm run db:check
```

### Paso 2: Generar Datos de Prueba (opcional)
Si no tienes datos en PostgreSQL:
```bash
npm run seed:postgres
```

### Paso 3: Migrar Datos (COMPLETO - Incluye Usuarios)
```bash
npm run migrate:all
```

**O si solo quieres migrar IMC (usuarios ya en MongoDB):**
```bash
npm run migrate:pg-to-mongo
```

### Paso 4: Cambiar a MongoDB
Edita `backend/.env`:
```bash
DB_TYPE=mongo
```

### Paso 5: Reiniciar Aplicación
```bash
npm run dev
```

¡Listo! Tu aplicación ahora usa MongoDB

---

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run db:check` | Verifica estado de bases de datos |
| `npm run seed:postgres` | Genera datos de prueba en PostgreSQL |
| `npm run migrate:all` | Migra USUARIOS + IMC a MongoDB (Recomendado) |
| `npm run migrate:pg-to-mongo` | Migra solo IMC a MongoDB |

---

## Validación Rápida

### PostgreSQL
```bash
psql -U postgres -d imc_db -c "SELECT COUNT(*) FROM imc;"
```

### MongoDB
```bash
mongosh mongodb://imc:mongoimc@localhost:27018/imc_db --authenticationDatabase admin \
  --eval "db.imc.countDocuments()"
```

---

## Troubleshooting Rápido

### No puedo conectar a PostgreSQL
```bash
# Verificar si está corriendo
sudo systemctl status postgresql
# o
pg_isready
```

### No puedo conectar a MongoDB
```bash
# Verificar si está corriendo
sudo systemctl status mongod
# o
mongosh --eval "db.version()"
```

### Error "Cannot find module"
```bash
npm install
```

### Datos duplicados en MongoDB
```bash
mongosh mongodb://imc:mongoimc@localhost:27018/imc_db --authenticationDatabase admin
use imc_db
db.imc.deleteMany({})
exit
npm run migrate:all
```

---

## Documentación Completa

- **Guía Detallada**: `backend/scripts/README.md`
- **Documentación del Cambio**: `CAMBIO-3.2-MIGRACION-MONGODB.md`
- **Comandos Útiles**: `COMANDOS-UTILES.md`

---

## Comando Todo-en-Uno

```bash
# Todo en uno: verificar, seed, migrar, verificar
cd backend && \
npm run db:check && \
npm run seed:postgres && \
npm run migrate:all && \
npm run db:check
```

---

## Checklist de Migración

- [ ] PostgreSQL está corriendo
- [ ] MongoDB está corriendo
- [ ] Credenciales en `.env` son correctas
- [ ] Existen usuarios en la base de datos
- [ ] Existen datos de IMC en PostgreSQL
- [ ] Ejecuté `npm run db:check` antes de migrar
- [ ] Ejecuté `npm run migrate:all`
- [ ] Verifiqué que los datos migraron correctamente
- [ ] Cambié `DB_TYPE=mongo` en `.env`
- [ ] Reinicié la aplicación
- [ ] Probé que funciona con MongoDB
