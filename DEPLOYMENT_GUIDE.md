# Deployment Guide - Lost & Found Portal Backend

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Production Deployment](#production-deployment)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment](#cloud-deployment)
5. [Database Backup & Recovery](#database-backup--recovery)
6. [Monitoring & Logging](#monitoring--logging)
7. [Security Considerations](#security-considerations)

---

## Local Development Setup

### Prerequisites
```bash
# Check Java version (should be 17+)
java -version

# Check PostgreSQL is running
psql --version
```

### Step 1: Install Dependencies

```bash
# macOS
brew install java17
brew install postgresql

# Linux (Ubuntu/Debian)
sudo apt-get install openjdk-17-jdk
sudo apt-get install postgresql postgresql-contrib

# Windows
# Download from https://www.oracle.com/java/technologies/downloads/
# Download from https://www.postgresql.org/download/windows/
```

### Step 2: Setup PostgreSQL

```bash
# Start PostgreSQL (macOS with Homebrew)
brew services start postgresql

# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE lostfound;

# Exit
\q
```

#### Alternative: Using DBeaver GUI

For a user-friendly graphical interface, use **DBeaver** instead of command line:

1. **Download:** https://dbeaver.io/download/
2. **Launch DBeaver**
3. **Create Connection:**
   - New Database Connection → Select PostgreSQL → Next
   - Server Host: `localhost`, Port: `5432`
   - Username: `postgres`, Password: `postgres`
   - Test Connection → Finish
4. **Create Database:**
   - Right-click connection → Create New Database
   - Name: `lostfound` → OK

See **[DBEAVER_SETUP.md](./DBEAVER_SETUP.md)** for detailed instructions.

# List databases
\l

# Exit
\q
```

### Step 3: Configure Application

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/lostfound
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
server.port=8080
```

### Step 4: Build and Run

```bash
cd /Users/ritikkhatana/Downloads/lostfound-portal

# Build
./mvnw clean install

# Run
./mvnw spring-boot:run

# Access at http://localhost:8080
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Update database credentials (use environment variables)
- [ ] Change default password
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall
- [ ] Set up backups
- [ ] Enable logging
- [ ] Configure CORS properly
- [ ] Test all endpoints
- [ ] Load test the application
- [ ] Set up monitoring

### Configuration for Production

#### 1. Create Production Properties File

Create `src/main/resources/application-prod.properties`:

```properties
# Database Configuration
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true

# Server
server.port=8080
server.servlet.context-path=/api
server.compression.enabled=true
server.compression.min-response-size=1024

# Logging
logging.level.root=INFO
logging.level.com.shweta.lostfound_portal=DEBUG
logging.file.name=/var/log/lostfound-portal/app.log

# CORS
spring.web.cors.allowed-origins=${CORS_ORIGINS:http://localhost:3000}
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allow-credentials=true

# SSL/TLS
server.ssl.key-store=${SSL_KEYSTORE_PATH}
server.ssl.key-store-password=${SSL_KEYSTORE_PASSWORD}
server.ssl.key-store-type=PKCS12
```

#### 2. Build JAR for Production

```bash
./mvnw clean package -P prod -DskipTests
```

#### 3. Deploy JAR

```bash
# Copy to server
scp target/lostfound-portal-0.0.1-SNAPSHOT.jar user@server:/opt/app/

# SSH into server
ssh user@server

# Create systemd service
sudo nano /etc/systemd/system/lostfound-portal.service
```

#### 4. Systemd Service File

```ini
[Unit]
Description=Lost & Found Portal API
After=network.target postgresql.service

[Service]
Type=simple
User=lostfound
WorkingDirectory=/opt/app
ExecStart=java -jar lostfound-portal-0.0.1-SNAPSHOT.jar \
  --spring.profiles.active=prod \
  --DB_URL=jdbc:postgresql://localhost:5432/lostfound \
  --DB_USERNAME=lostfound_user \
  --DB_PASSWORD=secure_password

Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

#### 5. Start Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service
sudo systemctl enable lostfound-portal

# Start service
sudo systemctl start lostfound-portal

# Check status
sudo systemctl status lostfound-portal

# View logs
sudo journalctl -u lostfound-portal -f
```

---

## Docker Deployment

### Step 1: Create Dockerfile

Create `Dockerfile`:

```dockerfile
# Build stage
FROM maven:3.8.1-openjdk-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY . .
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/target/lostfound-portal-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Step 2: Create Docker Compose File

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: lostfound-db
    environment:
      POSTGRES_DB: lostfound
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build: .
    container_name: lostfound-api
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/lostfound
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
      SPRING_PROFILES_ACTIVE: prod
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

volumes:
  postgres_data:
```

### Step 3: Build and Run with Docker

```bash
# Build Docker image
docker build -t lostfound-portal:latest .

# Run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

---

## Cloud Deployment

### AWS Deployment

#### 1. Create RDS PostgreSQL Instance
```bash
# Use AWS CLI or Console
aws rds create-db-instance \
  --db-instance-identifier lostfound-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --allocated-storage 20 \
  --master-username postgres \
  --master-user-password YourSecurePassword123
```

#### 2. Deploy to AWS Elastic Beanstalk
```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p "Docker running on 64bit Amazon Linux 2" lostfound-portal

# Create environment
eb create lostfound-prod

# Deploy
eb deploy

# View logs
eb logs

# SSH into instance
eb ssh
```

#### 3. Configure Environment Variables in EB
```bash
eb setenv DB_URL=jdbc:postgresql://lostfound-db.xxx.rds.amazonaws.com:5432/lostfound \
  DB_USERNAME=postgres \
  DB_PASSWORD=YourSecurePassword123
```

### Heroku Deployment

```bash
# Install Heroku CLI
brew install heroku

# Login
heroku login

# Create app
heroku create lostfound-portal

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Google Cloud Platform Deployment

```bash
# Install Google Cloud SDK
gcloud init

# Create Cloud SQL instance
gcloud sql instances create lostfound-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro

# Deploy to Cloud Run
gcloud run deploy lostfound-portal \
  --source . \
  --platform managed \
  --region us-central1
```

---

## Database Backup & Recovery

### Backup PostgreSQL

```bash
# Full backup
pg_dump -U postgres -d lostfound > backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
pg_dump -U postgres -d lostfound | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Remote backup
pg_dump -h host.com -U postgres -d lostfound > backup.sql
```

### Restore Database

```bash
# From SQL file
psql -U postgres -d lostfound < backup.sql

# From compressed file
gunzip -c backup.sql.gz | psql -U postgres -d lostfound

# Create new database and restore
createdb -U postgres lostfound_restored
psql -U postgres -d lostfound_restored < backup.sql
```

### Automated Backup Script

Create `backup.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/backups/lostfound"
DB_NAME="lostfound"
DB_USER="postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"

mkdir -p $BACKUP_DIR

pg_dump -U $DB_USER -d $DB_NAME | gzip > $BACKUP_FILE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE"
```

Add to crontab:

```bash
# Daily backup at 2 AM
0 2 * * * /opt/scripts/backup.sh
```

---

## Monitoring & Logging

### Application Logging

Configure logging in `application.properties`:

```properties
# Logging Configuration
logging.level.root=INFO
logging.level.com.shweta.lostfound_portal=DEBUG
logging.file.name=/var/log/lostfound-portal/app.log
logging.file.max-size=10MB
logging.file.max-history=10

# Log pattern
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %logger{36} - %msg%n
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
```

### Add Actuator for Metrics

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Access metrics:
- `http://localhost:8080/actuator`
- `http://localhost:8080/actuator/metrics`
- `http://localhost:8080/actuator/health`

### Monitoring Tools

```bash
# Using New Relic
# 1. Sign up at https://newrelic.com
# 2. Download Java agent
# 3. Add to JVM options:
#    -javaagent:/path/to/newrelic.jar

# Using Datadog
# 1. Sign up at https://www.datadoghq.com
# 2. Install agent and configure tracing

# Using ELK Stack (Elasticsearch, Logstash, Kibana)
# 1. Set up ELK infrastructure
# 2. Configure application to send logs
```

---

## Security Considerations

### 1. Database Security

```properties
# Use strong passwords
spring.datasource.password=${DB_PASSWORD}

# Use SSL for database connection
spring.datasource.url=jdbc:postgresql://host:5432/lostfound?sslmode=require

# Use encrypted passwords in configuration
spring.datasource.hikari.data-source-properties.useSSL=true
```

### 2. API Security

```properties
# Implement authentication (JWT recommended)
# Enable HTTPS only
server.ssl.enabled=true
server.ssl.key-store=/path/to/keystore.p12
server.ssl.key-store-type=PKCS12

# Restrict CORS
spring.web.cors.allowed-origins=https://yourdomain.com
```

### 3. Input Validation

Add validation annotations to DTOs:

```java
@Data
public class CreateItemRequest {
    @NotNull(message = "Type is required")
    private ItemType type;
    
    @NotBlank(message = "Item name is required")
    @Size(min = 3, max = 100)
    private String itemName;
    
    // ... other fields
}
```

### 4. Environment Variables

Never commit sensitive data. Use environment variables:

```bash
export DB_PASSWORD="secure_password"
export CORS_ORIGINS="https://yourdomain.com"
export JWT_SECRET="your-secret-key"
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check logs
tail -f /var/log/lostfound-portal/app.log

# Check port availability
lsof -i :8080

# Check database connection
psql -h localhost -U postgres -d lostfound
```

### High Memory Usage

```bash
# Check memory
top -p $(pgrep -f lostfound-portal)

# Adjust JVM heap size
java -Xmx512m -Xms256m -jar app.jar
```

### Slow Queries

```bash
# Enable query logging in application.properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
logging.level.org.hibernate.SQL=DEBUG

# Check slow query log in PostgreSQL
log_min_duration_statement = 1000  # in postgresql.conf
```

---

## Health Check Endpoints

```bash
# Application health
curl http://localhost:8080/health

# Detailed health
curl http://localhost:8080/actuator/health

# Database connection
curl http://localhost:8080/actuator/health/db

# Disk space
curl http://localhost:8080/actuator/health/diskSpace
```

---

## Rollback Procedures

```bash
# Stop current version
systemctl stop lostfound-portal

# Backup current database
pg_dump -U postgres -d lostfound > backup_pre_update.sql.gz

# Restore previous backup
gunzip -c backup_previous.sql.gz | psql -U postgres -d lostfound

# Deploy previous version
cp app-previous.jar app.jar

# Start service
systemctl start lostfound-portal

# Verify
curl http://localhost:8080/health
```

---

## Support & Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [AWS Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/)

