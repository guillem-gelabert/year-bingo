#!/bin/sh
# Run the add_is_admin migration

echo "Running migration: add_is_admin.sql"
docker compose exec -T postgres psql -U yearbingo -d yearbingo < migrations/add_is_admin.sql

if [ $? -eq 0 ]; then
  echo "Migration completed successfully!"
else
  echo "Migration failed!"
  exit 1
fi

