# Comandos Útiles - Migración MongoDB

## Comandos de Migración

```bash
# Verificar estado de bases de datos
cd backend && npm run db:check

# Generar datos de prueba (opcional)
npm run seed:postgres

# Ejecutar migración COMPLETA (Usuarios + IMC) - RECOMENDADO
npm run migrate:all

# O ejecutar migración solo de IMC (si usuarios ya están en MongoDB)
npm run migrate:pg-to-mongo

# Cambiar a MongoDB
# Editar backend/.env: DB_TYPE=mongo

# Reiniciar aplicación
npm run dev
```

## Todo en Uno

```bash
# Flujo completo: verificar, seed, migrar TODO, verificar
cd backend && \
npm run db:check && \
npm run seed:postgres && \
npm run migrate:all && \
npm run db:check
```

## Verificación Manual

### PostgreSQL
```bash
psql -U postgres -d imc_db -c "SELECT COUNT(*) FROM imc;"
psql -U postgres -d imc_db -c "SELECT \"userId\", COUNT(*) FROM imc GROUP BY \"userId\";"
```

### MongoDB
```bash
mongosh mongodb://imc:mongoimc@localhost:27018/imc_db --authenticationDatabase admin --eval "db.imc.countDocuments()"
mongosh mongodb://imc:mongoimc@localhost:27018/imc_db --authenticationDatabase admin --eval "db.imc.aggregate([{ \$group: { _id: '\$userId', count: { \$sum: 1 } } }])"
```

## Limpiar y Re-migrar

```bash
# Limpiar MongoDB
mongosh mongodb://imc:mongoimc@localhost:27018/imc_db --authenticationDatabase admin --eval "db.imc.deleteMany({})"

# Re-migrar
npm run migrate:all
```

## Troubleshooting

### Verificar servicios
```bash
# PostgreSQL
sudo systemctl status postgresql
pg_isready

# MongoDB
sudo systemctl status mongod
mongosh --eval "db.version()"
```

### Reinstalar dependencias
```bash
cd backend
rm -rf node_modules
npm install
```

## Git Commands

```bash
# Ver cambios
git status

# Agregar archivos
git add backend/scripts/ backend/package.json backend/src/module/imc/repositories/imc-mongo.repository.ts
git add CAMBIO-3.2-MIGRACION-MONGODB.md GUIA-RAPIDA-MIGRACION.md COMANDOS-UTILES.md

# Commit
git commit -m "feat: implementar migración PostgreSQL a MongoDB (CR-003.2)"

# Ver historial
git log --oneline -5
```
