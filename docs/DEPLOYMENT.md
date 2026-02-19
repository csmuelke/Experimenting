# Deployment Guide

## Overview

This guide covers deploying LearnSocial to production environments.

---

## Prerequisites

### Required Accounts

1. **Cloud Provider** (Choose one):
   - AWS (recommended)
   - Google Cloud Platform
   - Microsoft Azure
   - DigitalOcean (simpler, budget-friendly)

2. **Database Hosting**:
   - AWS RDS (PostgreSQL)
   - Heroku Postgres
   - Railway
   - Supabase

3. **Mobile App Distribution**:
   - Apple Developer Account ($99/year) - iOS
   - Google Play Console ($25 one-time) - Android

4. **Domain & SSL**:
   - Domain registrar (Namecheap, GoDaddy, etc.)
   - SSL certificate (Let's Encrypt - free, or AWS Certificate Manager)

---

## Backend Deployment

### Option 1: Deploy to AWS (Recommended for Production)

#### 1. Set Up EC2 Instance

```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@your-ip-address

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Postgres client
sudo apt install -y postgresql-client

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### 2. Set Up PostgreSQL Database (RDS)

1. Create RDS PostgreSQL instance in AWS Console
2. Configure security groups (allow port 5432 from EC2)
3. Note connection string

#### 3. Deploy Application

```bash
# Clone repository
git clone <your-repo-url>
cd superlernensocialdingens/backend

# Install dependencies
npm install

# Create .env file
nano .env
```

**Production .env:**
```env
PORT=3000
NODE_ENV=production

DATABASE_URL="postgresql://username:password@your-rds-endpoint:5432/learnsocial"

JWT_SECRET=your-production-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=https://yourdomain.com

BCRYPT_ROUNDS=12
```

**Run migrations and start:**
```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Build application
npm run build

# Start with PM2
pm2 start dist/server.js --name learnsocial-api

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

#### 4. Set Up Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Create configuration
sudo nano /etc/nginx/sites-available/learnsocial
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/learnsocial /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### 5. Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal is set up automatically
```

---

### Option 2: Deploy to Heroku (Simpler, Quick Start)

#### 1. Install Heroku CLI

```bash
# Windows
winget install Heroku.HerokuCLI

# macOS
brew install heroku/brew/heroku

# Login
heroku login
```

#### 2. Create Heroku App

```bash
cd backend

# Create app
heroku create learnsocial-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set JWT_REFRESH_SECRET=your-refresh-secret
heroku config:set CORS_ORIGIN=https://yourdomain.com
```

#### 3. Create Procfile

```bash
# backend/Procfile
web: npm run start
release: npx prisma migrate deploy
```

#### 4. Deploy

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial deployment"

# Add Heroku remote
heroku git:remote -a learnsocial-api

# Deploy
git push heroku main
```

---

### Option 3: Deploy to Railway (Modern, Easy)

1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Add PostgreSQL database
4. Set environment variables in dashboard
5. Deploy automatically on git push

---

## Database Migration Strategy

### Production Migrations

**Never run `prisma migrate dev` in production!**

```bash
# Use migrate deploy instead
npx prisma migrate deploy

# This applies pending migrations without creating new ones
```

### Migration Workflow

1. **Development**: Create migration
   ```bash
   npx prisma migrate dev --name add_new_field
   ```

2. **Commit**: Add migration files to git
   ```bash
   git add prisma/migrations
   git commit -m "feat: add new field migration"
   ```

3. **Production**: Deploy and apply
   ```bash
   git push origin main
   # Then on server:
   npx prisma migrate deploy
   ```

### Database Backup Strategy

**Before any migration:**
```bash
# Backup database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore if needed
psql $DATABASE_URL < backup_20260219_120000.sql
```

**Automated backups:**
- AWS RDS: Enable automatic backups (retention period)
- Heroku: `heroku pg:backups:schedule --at '02:00 America/New_York'`

---

## Mobile App Deployment

### iOS Deployment (TestFlight & App Store)

#### 1. Prerequisites

- Apple Developer Account ($99/year)
- Mac computer with Xcode
- EAS Build account (Expo)

#### 2. Configure App

```bash
cd mobile

# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure project
eas build:configure
```

**Update app.json:**
```json
{
  "expo": {
    "name": "LearnSocial",
    "slug": "learnsocial",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.learnsocial",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.yourcompany.learnsocial",
      "versionCode": 1
    }
  }
}
```

#### 3. Build for iOS

```bash
# Build for iOS
eas build --platform ios

# Submit to TestFlight
eas submit --platform ios

# Follow prompts for App Store Connect
```

#### 4. App Store Submission

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create new app
3. Fill in metadata (description, screenshots, etc.)
4. Submit for review
5. Wait for approval (usually 1-3 days)

---

### Android Deployment (Google Play)

#### 1. Build for Android

```bash
# Build Android APK/AAB
eas build --platform android

# Download the .aab file
```

#### 2. Create Signing Key

```bash
# Generate keystore
keytool -genkeypair -v -keystore learnsocial.keystore \
  -alias learnsocial -keyalg RSA -keysize 2048 -validity 10000
```

#### 3. Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app
3. Complete store listing
4. Upload .aab file to internal testing
5. Progress through testing tracks: Internal → Closed → Open → Production

---

## Environment Configuration

### Production Environment Variables

**Backend (.env):**
```env
# Never commit this file!

# Server
PORT=3000
NODE_ENV=production

# Database (use connection pooling in production)
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=10"

# Security (use strong, random strings)
JWT_SECRET=<generate-with-crypto>
JWT_REFRESH_SECRET=<generate-with-crypto>

# CORS (your actual domain)
CORS_ORIGIN=https://yourdomain.com

# Bcrypt (higher in production for security)
BCRYPT_ROUNDS=12

# Rate limiting
RATE_LIMIT=1000
```

**Mobile (.env):**
```env
# Production API
API_URL=https://api.yourdomain.com/api

NODE_ENV=production
```

---

## Monitoring and Logging

### Backend Monitoring

#### Option 1: PM2 Monitoring

```bash
# View logs
pm2 logs learnsocial-api

# Monitor processes
pm2 monit

# Install PM2 web dashboard
pm2 install pm2-dashboard
```

#### Option 2: External Monitoring

**Sentry (Error Tracking):**
```bash
npm install @sentry/node

# In server.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

**DataDog, New Relic, etc.** - Follow their integration guides

### Database Monitoring

- **AWS RDS**: CloudWatch metrics
- **Heroku**: `heroku pg:info`
- **Prisma**: Built-in query logging

### Application Logs

```typescript
// Use proper logging library
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Use in application
logger.info('User logged in', { userId: user.id });
logger.error('Database error', { error: error.message });
```

---

## Security Checklist

### Backend Security

- [ ] Use HTTPS only (SSL certificate)
- [ ] Strong JWT secrets (32+ character random strings)
- [ ] Environment variables not committed (.env in .gitignore)
- [ ] Database credentials secure
- [ ] CORS configured for specific origins
- [ ] Rate limiting implemented
- [ ] Helmet.js security headers enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (Prisma handles this)
- [ ] Password hashing with bcrypt (12+ rounds)
- [ ] Regular dependency updates
- [ ] No console.logs with sensitive data

### Mobile Security

- [ ] API uses HTTPS
- [ ] Tokens stored in SecureStore/Keychain
- [ ] No API keys in source code
- [ ] Certificate pinning (for high security)
- [ ] Proper token refresh flow
- [ ] Logout clears all stored data

### Database Security

- [ ] Strong database password
- [ ] Firewall rules (only allow from app servers)
- [ ] Regular backups
- [ ] Encrypted connections
- [ ] Least privilege access (app user != admin)

---

## Performance Optimization

### Backend

```typescript
// Enable compression
import compression from 'compression';
app.use(compression());

// Connection pooling
DATABASE_URL="postgresql://...?connection_limit=10"

// Caching (future)
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);
```

### Database

```sql
-- Add necessary indexes
CREATE INDEX idx_sessions_user_created ON learning_sessions(user_id, created_at);
CREATE INDEX idx_follows_follower ON follows(follower_id);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM learning_sessions WHERE user_id = 'uuid';
```

### Mobile

- Enable Hermes engine (enabled by default in Expo)
- Use ProGuard/R8 for Android (reduces APK size)
- Optimize images (use WebP format)
- Implement pagination for lists
- Cache API responses

---

## Scaling Strategy

### Phase 1: Single Server (0-10K users)
- Current architecture
- Monitor performance

### Phase 2: Vertical Scaling (10K-50K users)
- Upgrade server resources (CPU, RAM)
- Optimize database queries
- Add Redis caching

### Phase 3: Horizontal Scaling (50K-500K users)
- Load balancer
- Multiple API servers
- Database read replicas
- CDN for static assets

### Phase 4: Microservices (500K+ users)
- Separate services (auth, sessions, feed)
- Message queues
- Containerization (Docker/Kubernetes)
- Auto-scaling

---

## Rollback Strategy

### If Deployment Fails

**Backend:**
```bash
# PM2 rollback
pm2 list
pm2 delete learnsocial-api
git checkout previous-working-commit
npm run build
pm2 start dist/server.js --name learnsocial-api
```

**Heroku:**
```bash
# Rollback to previous release
heroku releases
heroku rollback v123
```

**Database:**
```bash
# Restore backup
psql $DATABASE_URL < backup_file.sql

# Or use cloud provider's backup restore
```

---

## Cost Estimation

### Starter Setup (Under $50/month)

- **Railway/Heroku**: $7-15/month (hobby tier)
- **Database**: Included with above
- **Domain**: $12/year
- **SSL**: Free (Let's Encrypt)
- **Total**: ~$10-20/month

### Production Setup ($100-300/month)

- **AWS EC2** (t3.small): $15/month
- **AWS RDS** (db.t3.micro): $15/month
- **Load Balancer**: $20/month
- **Backups/Storage**: $10/month
- **Monitoring**: $20/month
- **CDN** (CloudFlare): Free tier ok
- **Domain**: $12/year
- **Total**: ~$80-100/month

### Scale Setup ($500+/month)

- Multiple servers, caching, CDN, premium monitoring
- Grows with user base

---

## Maintenance Schedule

### Daily
- Check error logs
- Monitor server health
- Review user feedback

### Weekly
- Review analytics
- Check database performance
- Update dependencies (security patches)

### Monthly
- Full backup verification
- Security audit
- Performance optimization review
- Cost analysis

### Quarterly
- Major dependency updates
- Infrastructure review
- Disaster recovery test

---

## Support and Troubleshooting

### Common Issues

**Server not starting:**
```bash
pm2 logs learnsocial-api --err
# Check for environment variable issues
```

**Database connection failed:**
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"
# Check security groups/firewall
```

**SSL certificate issues:**
```bash
sudo certbot renew
sudo systemctl restart nginx
```

---

## Useful Commands

```bash
# Backend
pm2 restart learnsocial-api
pm2 logs learnsocial-api
pm2 monit

# Database
heroku pg:psql  # Heroku
psql $DATABASE_URL  # Direct

# Nginx
sudo nginx -t  # Test config
sudo systemctl restart nginx

# Logs
tail -f /var/log/nginx/error.log
journalctl -u nginx -f

# Disk space
df -h
du -sh *
```

---

## Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Heroku Dev Center](https://devcenter.heroku.com/)
- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Let's Encrypt](https://letsencrypt.org/)

---

**Remember: Always test deployments in a staging environment first!** 🚀
