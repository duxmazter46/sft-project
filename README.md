# Get started

- Make `.env` from `.env.example` (Make necessary changes.)
- `docker compose up -d --force-recreate`

# Setup database

- `docker exec -it [DB_CONTAINER_NAME] bash`
- `psql -U postgres -d mydb`
- Don't forget to change the password.

```
REVOKE CONNECT ON DATABASE mydb FROM public;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
CREATE USER appuser WITH PASSWORD '1234';
CREATE SCHEMA myschema;
GRANT ALL ON DATABASE mydb TO appuser;
GRANT ALL ON SCHEMA public TO appuser;
GRANT ALL ON SCHEMA myschema TO appuser;
```