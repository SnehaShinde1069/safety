# Girl Safety System - Deployment Guide

## 🚀 Deployment Options

### Option 1: Local Deployment (Development)

#### Prerequisites
- Node.js v14+
- Python 3.8+
- MongoDB (local or cloud)

#### Steps

1. **Run Setup Script**
   - Windows: `setup.bat`
   - Mac/Linux: `bash setup.sh`

2. **Edit Configuration**
   - Update backend/.env
   - Update frontend/.env
   - Update ai-service/.env

3. **Start Services**
   
   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Terminal 2 - AI Service:**
   ```bash
   cd ai-service
   python app.py
   ```
   
   **Terminal 3 - Frontend:**
   ```bash
   cd frontend
   npm start
   ```

---

### Option 2: Docker Deployment

#### Create Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    container_name: gsystem-mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
    volumes:
      - mongodb_data:/data/db

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: gsystem-backend
    ports:
      - "5000:5000"
    environment:
      MONGO_URI: mongodb://admin:password123@mongodb:27017/girl-safety-system?authSource=admin
      JWT_SECRET: your_secret_key
      PORT: 5000
      FRONTEND_URL: http://localhost:3000
      FLASK_API_URL: http://flask:5001
    depends_on:
      - mongodb
    links:
      - mongodb

  flask:
    build:
      context: ./ai-service
      dockerfile: Dockerfile
    container_name: gsystem-flask
    ports:
      - "5001:5001"
    environment:
      FLASK_ENV: production
      BACKEND_URL: http://backend:5000
    depends_on:
      - backend

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: gsystem-frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:5000/api
      REACT_APP_AI_URL: http://localhost:5001/api
    depends_on:
      - backend

volumes:
  mongodb_data:
```

#### Run Docker Compose
```bash
docker-compose up -d
```

---

### Option 3: AWS Deployment

#### EC2 Instance Setup

1. **Launch EC2 Instance**
   - AMI: Ubuntu 20.04 LTS
   - Instance Type: t3.medium or larger
   - Security Groups: Open ports 80, 443, 5000, 5001, 3000

2. **Connect & Setup**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install Python
   sudo apt install -y python3 python3-pip
   
   # Install MongoDB
   sudo apt install -y mongodb
   
   # Clone repository
   git clone <your-repo-url> girl-safety-system
   cd girl-safety-system
   
   # Run setup script
   bash setup.sh
   ```

3. **Use PM2 for Process Management**
   ```bash
   sudo npm install -g pm2
   
   cd backend
   pm2 start server.js --name "gsystem-backend"
   
   cd ../ai-service
   pm2 start app.py --name "gsystem-flask"
   
   cd ../frontend
   pm2 build
   npm run build
   pm2 serve build 3000 --spa --name "gsystem-frontend"
   
   pm2 save
   pm2 startup
   ```

4. **Setup Nginx Reverse Proxy**
   ```nginx
   # /etc/nginx/sites-available/girl-safety-system
   
   upstream backend {
     server localhost:5000;
   }
   
   upstream flask {
     server localhost:5001;
   }
   
   upstream frontend {
     server localhost:3000;
   }
   
   server {
     listen 80;
     server_name your-domain.com;
   
     # Frontend
     location / {
       proxy_pass http://frontend;
     }
   
     # Backend API
     location /api {
       proxy_pass http://backend;
     }
   
     # Flask AI
     location /ai-api {
       rewrite ^/ai-api/(.*)$ /$1 break;
       proxy_pass http://flask;
     }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/girl-safety-system /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **SSL Certificate (Let's Encrypt)**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

### Option 4: Heroku Deployment

#### Deploy Backend

1. **Create Heroku Account & Install CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   heroku create girl-safety-backend
   ```

3. **Add MongoDB Atlas**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your_secret
   heroku config:set FRONTEND_URL=https://your-frontend.com
   ```

5. **Deploy**
   ```bash
   git subtree push --prefix backend heroku main
   ```

#### Deploy Frontend

1. **Build for Production**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir build
   ```

3. **Set API URL**
   - Update environment variables in Netlify settings
   - `REACT_APP_API_URL=https://girl-safety-backend.herokuapp.com/api`

---

### Option 5: Azure App Service

#### Backend Deployment

1. **Create Resource Group**
   ```bash
   az group create --name girl-safety-rg --location eastus
   ```

2. **Create App Service Plan**
   ```bash
   az appservice plan create --name girl-safety-plan --resource-group girl-safety-rg --sku B1 --is-linux
   ```

3. **Create Web App**
   ```bash
   az webapp create --resource-group girl-safety-rg --plan girl-safety-plan --name girl-safety-backend --runtime "NODE|18-lts"
   ```

4. **Deploy**
   ```bash
   cd backend
   az webapp up --resource-group girl-safety-rg --name girl-safety-backend
   ```

---

## 📊 Production Checklist

- [ ] Update all environment variables
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS/SSL
- [ ] Configure MongoDB with authentication
- [ ] Set up email service credentials
- [ ] Configure backups
- [ ] Set up monitoring (DataDog, New Relic, etc.)
- [ ] Configure logging aggregation
- [ ] Set up CI/CD pipeline
- [ ] Test all critical flows
- [ ] Configure rate limiting
- [ ] Set up automated tests
- [ ] Configure error tracking (Sentry)
- [ ] Set up uptime monitoring
- [ ] Document runbooks
- [ ] Configure database indexing
- [ ] Test disaster recovery
- [ ] Set up version control
- [ ] Configure auto-scaling (if using cloud)
- [ ] Review security headers

---

## 🔒 Security Best Practices

1. **Never commit .env files**
2. **Use HTTPS only in production**
3. **Implement CORS properly**
4. **Use strong JWT secrets**
5. **Hash all passwords**
6. **Validate all inputs**
7. **Implement rate limiting**
8. **Use CSRF tokens**
9. **Keep dependencies updated**
10. **Monitor suspicious activities**
11. **Regular security audits**
12. **Backup data regularly**

---

## 📈 Monitoring & Logging

### Application Monitoring
- Winston/Morgan for logging
- DataDog or New Relic integration
- Health check endpoints

### Database Monitoring
- MongoDB Atlas monitoring
- Query performance tracking
- Backup automation

### Performance Optimization
- Enable caching headers
- CDN for static assets
- Database query optimization
- API response compression

---

## 🆘 Troubleshooting Deployment

### Port Already in Use
```bash
# Find process on port
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Database Connection Issues
- Verify MongoDB is running
- Check connection string in .env
- Ensure network access (MongoDB Atlas IP whitelist)

### CORS Issues
- Check FRONTEND_URL in backend .env
- Configure CORS middleware properly
- Verify API routes are accessible

### Memory Issues
- Increase Node.js heap size: `NODE_OPTIONS=--max-old-space-size=2048`
- Monitor memory usage
- Optimize large operations

---

## 📝 Version Control

Recommended .gitignore:
```
node_modules/
.env
.env.local
dist/
build/
__pycache__/
*.pyc
.DS_Store
recorded_videos/
uploads/
```

---

## 🔄 CI/CD Pipeline Example (GitHub Actions)

```yaml
name: Deploy Girl Safety System

on:
  push:
    branches: [ main ]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd backend && npm install
          cd ../frontend && npm install
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Heroku
        env:
          HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
        run: |
          git subtree push --prefix backend heroku main
```

---

## 📞 Support

For deployment issues:
1. Check logs: `heroku logs --tail` or `pm2 logs`
2. Review error tracking (Sentry)
3. Check monitoring dashboards
4. Verify environment variables

---

Last Updated: January 2024
