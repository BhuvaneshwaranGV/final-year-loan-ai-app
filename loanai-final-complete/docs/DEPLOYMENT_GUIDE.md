# 🚀 LOANAI DEPLOYMENT GUIDE

Complete step-by-step deployment instructions for production and development environments.

---

## 📋 TABLE OF CONTENTS

1. [Development Deployment](#development-deployment)
2. [Production Deployment](#production-deployment)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment](#cloud-deployment)
5. [Environment Variables](#environment-variables)
6. [Health Checks](#health-checks)
7. [Monitoring](#monitoring)
8. [Backup & Recovery](#backup--recovery)

---

## 💻 DEVELOPMENT DEPLOYMENT

### Prerequisites
- Java 17+, Maven 3.8+
- Python 3.9+, pip
- Node.js 18+, npm
- PostgreSQL 18
- Gmail account with app password

### Step 1: Database Setup (10 minutes)

```bash
# Start PostgreSQL
sudo service postgresql start

# Create database
psql -U postgres
CREATE DATABASE loan_system;
\q

# Import schema
cd database
psql -U postgres -d loan_system -f 01_create_tables.sql

# Import sample users
psql -U postgres -d loan_system -f 02_seed_users.sql

# Verify
psql -U postgres -d loan_system
SELECT COUNT(*) FROM customer_master;  -- Should return 1000
SELECT COUNT(*) FROM account_master;   -- Should return 2004
SELECT COUNT(*) FROM transaction_history;  -- Should return ~1.2M
SELECT COUNT(*) FROM users;  -- Should return 3
\q
```

### Step 2: Backend Setup (10 minutes)

```bash
cd backend

# Update application.properties
nano src/main/resources/application.properties

# Update these lines:
# spring.datasource.password=gvB@2004
# spring.mail.username=your.email@gmail.com
# spring.mail.password=your_16_char_app_password

# Build
mvn clean install

# Run
mvn spring-boot:run
```

**Verify:** Open http://localhost:8080/actuator/health
Should return: `{"status":"UP"}`

### Step 3: ML Service Setup (5 minutes)

```bash
cd ml-service

# Create virtual environment (optional)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Update database password
nano ml_service.py
# Line 24: password: 'gvB@2004'

# Run
python ml_service.py
```

**Verify:** Open http://localhost:5000/health
Should return: `{"status":"healthy"}`

### Step 4: Frontend Setup (5 minutes)

```bash
cd frontend

# Install dependencies
npm install

# Update API URL (if needed)
nano src/api.js
# Line 3: const API_BASE_URL = 'http://localhost:8080/api';

# Run
npm start
```

**Verify:** Open http://localhost:3000
Should see login page

### Step 5: End-to-End Test

1. Login with: `user_600800906` / `password123`
2. Navigate to Apply Loan
3. Enter account: `600800906`
4. Enter your email
5. Click Send OTP
6. Check:
   - ✅ Backend console shows OTP
   - ✅ Email received
7. Enter OTP and proceed
8. Fill loan application
9. Submit
10. Verify results page shows:
    - ✅ Simulated CIBIL score
    - ✅ Fraud detection results
    - ✅ ML prediction
    - ✅ Decision

---

## 🏭 PRODUCTION DEPLOYMENT

### Architecture

```
Internet
    ↓
Load Balancer (Nginx)
    ↓
┌─────────────┬─────────────┬─────────────┐
│  Frontend   │   Backend   │  ML Service │
│  (Static)   │  (Spring)   │   (Flask)   │
│  Port 80    │  Port 8080  │  Port 5000  │
└─────────────┴─────────────┴─────────────┘
              ↓
    PostgreSQL (RDS/Managed)
```

### Step 1: Server Setup

**Requirements:**
- Ubuntu 22.04 LTS
- 4 CPU cores
- 8 GB RAM
- 100 GB SSD
- Public IP address

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Java
sudo apt install openjdk-17-jdk -y

# Install Python
sudo apt install python3.9 python3-pip -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Nginx
sudo apt install nginx -y
```

### Step 2: Database Setup (Production)

```bash
# Secure PostgreSQL
sudo -u postgres psql
ALTER USER postgres PASSWORD 'your_secure_password';
\q

# Create database
sudo -u postgres createdb loan_system

# Import schema
sudo -u postgres psql -d loan_system -f database/01_create_tables.sql
sudo -u postgres psql -d loan_system -f database/02_seed_users.sql

# Import CSV data (YOUR DATA!)
sudo -u postgres psql -d loan_system
\copy customer_master FROM '/path/to/customer_master.csv' CSV HEADER;
\copy account_master FROM '/path/to/account_master.csv' CSV HEADER;
\copy transaction_history FROM '/path/to/transaction_history.csv' CSV HEADER;
\q

# Enable remote connections (if needed)
sudo nano /etc/postgresql/*/main/postgresql.conf
# listen_addresses = '*'

sudo nano /etc/postgresql/*/main/pg_hba.conf
# host all all 0.0.0.0/0 md5

sudo service postgresql restart
```

### Step 3: Backend Deployment

```bash
# Create application directory
sudo mkdir -p /opt/loanai/backend
sudo chown $USER:$USER /opt/loanai/backend

# Copy backend files
cp -r backend/* /opt/loanai/backend/

# Update production config
cd /opt/loanai/backend
nano src/main/resources/application.properties

# Production settings:
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/loan_system
spring.datasource.password=your_secure_password
spring.mail.username=production.email@gmail.com
spring.mail.password=production_app_password
logging.level.root=WARN

# Build
mvn clean package -DskipTests

# Create systemd service
sudo nano /etc/systemd/system/loanai-backend.service
```

**Service file content:**
```ini
[Unit]
Description=LoanAI Backend Service
After=postgresql.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/loanai/backend
ExecStart=/usr/bin/java -jar target/loanai-backend-1.0.0.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable loanai-backend
sudo systemctl start loanai-backend
sudo systemctl status loanai-backend
```

### Step 4: ML Service Deployment

```bash
# Create directory
sudo mkdir -p /opt/loanai/ml-service
sudo chown $USER:$USER /opt/loanai/ml-service

# Copy files
cp -r ml-service/* /opt/loanai/ml-service/

# Install dependencies
cd /opt/loanai/ml-service
pip3 install -r requirements.txt

# Update config
nano ml_service.py
# Update DB password

# Create systemd service
sudo nano /etc/systemd/system/loanai-ml.service
```

**Service file content:**
```ini
[Unit]
Description=LoanAI ML Service
After=postgresql.service loanai-backend.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/loanai/ml-service
ExecStart=/usr/bin/python3 ml_service.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable loanai-ml
sudo systemctl start loanai-ml
sudo systemctl status loanai-ml
```

### Step 5: Frontend Deployment

```bash
# Build frontend
cd frontend
npm run build

# Copy to nginx directory
sudo mkdir -p /var/www/loanai
sudo cp -r build/* /var/www/loanai/

# Configure Nginx
sudo nano /etc/nginx/sites-available/loanai
```

**Nginx configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/loanai;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ML Service
    location /ml/ {
        proxy_pass http://localhost:5000/;
        proxy_set_header Host $host;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/loanai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: SSL Setup (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 🐳 DOCKER DEPLOYMENT

### Docker Compose Setup

**File: docker-compose.yml**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:18
    environment:
      POSTGRES_DB: loan_system
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./database:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    depends_on:
      - postgres
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/loan_system
      SPRING_DATASOURCE_PASSWORD: your_password
      SPRING_MAIL_USERNAME: your.email@gmail.com
      SPRING_MAIL_PASSWORD: your_app_password
    ports:
      - "8080:8080"

  ml-service:
    build: ./ml-service
    depends_on:
      - postgres
    environment:
      DB_HOST: postgres
      DB_PASSWORD: your_password
    ports:
      - "5000:5000"

  frontend:
    build: ./frontend
    depends_on:
      - backend
    ports:
      - "80:80"

volumes:
  postgres-data:
```

### Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild
docker-compose up -d --build
```

---

## ☁️ CLOUD DEPLOYMENT

### AWS Deployment

**Architecture:**
- EC2: Application servers
- RDS PostgreSQL: Database
- S3: Static frontend
- CloudFront: CDN
- Route 53: DNS
- Certificate Manager: SSL

**Steps:**
1. Create RDS PostgreSQL instance
2. Import database schema
3. Launch EC2 instances
4. Deploy backend + ML service
5. Build and upload frontend to S3
6. Configure CloudFront
7. Setup Route 53

### Cost Estimate (Monthly)
- EC2 (t3.medium): $30
- RDS (db.t3.micro): $15
- S3 + CloudFront: $5
- **Total: ~$50/month**

---

## 🔧 ENVIRONMENT VARIABLES

### Backend (.env or application-prod.properties)
```properties
DB_HOST=localhost
DB_PORT=5432
DB_NAME=loan_system
DB_USER=postgres
DB_PASSWORD=${DB_PASSWORD}

MAIL_USERNAME=${MAIL_USERNAME}
MAIL_PASSWORD=${MAIL_PASSWORD}

ML_SERVICE_URL=http://localhost:5000

JWT_SECRET=${JWT_SECRET}
```

### ML Service (.env)
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=loan_system
DB_USER=postgres
DB_PASSWORD=your_password

FLASK_ENV=production
FLASK_DEBUG=0
```

---

## 🏥 HEALTH CHECKS

### Backend
```bash
curl http://localhost:8080/actuator/health
# Expected: {"status":"UP"}
```

### ML Service
```bash
curl http://localhost:5000/health
# Expected: {"status":"healthy"}
```

### Database
```bash
pg_isready -h localhost -p 5432
# Expected: accepting connections
```

---

## 📊 MONITORING

### Setup Prometheus + Grafana

```bash
# Install Prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.40.0/prometheus-2.40.0.linux-amd64.tar.gz
tar -xzf prometheus-2.40.0.linux-amd64.tar.gz
cd prometheus-2.40.0.linux-amd64
./prometheus

# Install Grafana
sudo apt-get install -y software-properties-common
sudo add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
sudo apt-get update
sudo apt-get install grafana
sudo systemctl start grafana-server
```

**Access:** http://localhost:3000 (Grafana)

---

## 💾 BACKUP & RECOVERY

### Automated Backup Script

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/var/backups/loanai"
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
pg_dump -U postgres loan_system > "$BACKUP_DIR/db_$DATE.sql"

# Compress
gzip "$BACKUP_DIR/db_$DATE.sql"

# Delete backups older than 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
```

### Cron Job

```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh
```

### Recovery

```bash
# Restore database
gunzip db_20260214_020000.sql.gz
psql -U postgres -d loan_system < db_20260214_020000.sql
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy LoanAI

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Backend
        run: |
          cd backend
          mvn clean package
      
      - name: Deploy to Server
        run: |
          scp target/*.jar user@server:/opt/loanai/backend/
          ssh user@server 'sudo systemctl restart loanai-backend'
```

---

## ✅ POST-DEPLOYMENT CHECKLIST

- [ ] All services running
- [ ] Health checks passing
- [ ] SSL certificate installed
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Logs accessible
- [ ] Email sending working
- [ ] OTP verification working
- [ ] ML predictions working
- [ ] Admin panel accessible
- [ ] Documentation updated

---

**🎉 Deployment Complete!**
