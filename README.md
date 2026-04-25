# MediCitas 🏥

Sistema de agendamiento de citas médicas para una clínica con múltiples especialidades y doctores.

## Tecnologías

**Backend**
- Java 21
- Spring Boot 4.0.3
- Spring Data JPA + PostgreSQL
- Spring Security + JWT
- JUnit 5 + Mockito
- SpringDoc OpenAPI (Swagger)
- Docker + Docker Compose

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form

## Requisitos previos

- Java 21+
- Node.js 18+
- PostgreSQL 15+
- Docker y Docker Compose (opcional)

## Instalación y ejecución

### Opción 1 — Docker Compose (recomendado)

```bash
docker-compose up --build
```

Esto levanta automáticamente la base de datos y el backend.

### Opción 2 — Ejecución local

**Base de datos**

Crea la base de datos en PostgreSQL:
```sql
CREATE DATABASE medicitas;
```

**Backend**
```bash
./gradlew bootRun
```

**Frontend**
```bash
cd medicitas-frontend
npm install
npm run dev
```

## URLs

| Servicio | URL |
|----------|-----|
| Backend | http://localhost:8080 |
| Frontend | http://localhost:5173 |
| Swagger UI | http://localhost:8080/swagger-ui/index.html |
| API Docs | http://localhost:8080/v3/api-docs |

## Usuarios de prueba

| Rol | Email | Password |
|-----|-------|----------|
| ADMIN | admin@medicitas.com | admin1234 |
| RECEPCIONISTA | recep@medicitas.com | recep1234 |
| PACIENTE | paciente@medicitas.com | paciente1234 |

## Historias de usuario implementadas

| US | Descripción | Módulo |
|----|-------------|--------|
| US-001 | Registro de pacientes | Autenticación |
| US-002 | Login | Autenticación |
| US-003 | Refresh token | Autenticación |
| US-004 | CRUD de especialidades | Especialidades |
| US-005 | CRUD de doctores | Doctores |
| US-006 | Consultar doctores por especialidad | Doctores |
| US-007 | Configurar horario del doctor | Horarios |
| US-008 | Ver slots disponibles | Horarios |
| US-009 | CRUD de pacientes | Pacientes |
| US-010 | Ver y actualizar perfil | Pacientes |
| US-011 | Agendar cita (recepcionista) | Citas |
| US-012 | Paciente solicita cita | Citas |
| US-013 | Cancelar cita | Citas |
| US-014 | Confirmar asistencia | Citas |
| US-015 | Atender cita (doctor) | Citas |
| US-016 | Ver historial de citas | Citas |
| US-017 | Agenda del día (doctor) | Citas |
| US-018 | Reporte de citas por período | Reportes |
| US-019 | Reporte de productividad | Reportes |
| US-020 | Servicio de notificaciones | Notificaciones |

## Requisitos no funcionales

| Requisito | Implementación |
|-----------|----------------|
| Autenticación | JWT con access token (15 min) y refresh token (7 días) |
| Passwords | BCrypt con strength 10 |
| Documentación API | 100% endpoints documentados en Swagger |
| Versionado | API versionada en `/api/v1/` |
| Containerización | docker-compose.yml que levanta app + BD |

## Estructura del proyecto

src/
├── config/          # Seguridad, CORS, Swagger, DataInitializer
├── controller/      # Endpoints REST
├── dto/             # Objetos de transferencia de datos
├── entity/          # Entidades JPA
├── enums/           # Roles y estados
├── exception/       # Manejo global de errores
├── repository/      # Acceso a datos
├── security/        # JWT filter y service
└── service/         # Lógica de negocio
└── impl/        # Implementaciones

## Variables de entorno

```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/medicitas
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
JWT_SECRET=c2VjcmV0S2V5U3VwZXJTZWN1cmFQYXJhTWVkaUNpdGFzMjAyNA==
```

## Colección Postman

Importa el archivo `medicitas.postman_collection.json` en Postman para probar todos los endpoints.

1. Abre Postman → Import → selecciona el archivo
2. Selecciona el environment `MediCitas Local`
3. Ejecuta primero **US-002 Login** para obtener el token automáticamente
4. Prueba cualquier endpoint