#!/bin/bash

echo "🔧 Step 1: Setting VITE_API_URL in frontend .env"
cd ~/task/frontend
cat > .env <<EOL
VITE_API_URL=http://<your-ec2-ip>:5000
EOL
echo "✅ Frontend .env created"

echo "🔧 Step 2: Creating backend .env file"
cd ~/task/backend
cat > .env <<EOL
PORT=5000
ACCESS_TOKEN_SECRET=your-access-secret
REFRESH_TOKEN_SECRET=your-refresh-secret
MONGODB_URI=your-mongodb-uri
GCP_BUCKET_NAME=your-gcp-bucket-name
EOL
echo "✅ Backend .env created"

echo "🔐 Step 3: Creating ServiceAccountKey.json"
mkdir -p services
cd services
cat > ServiceAccountKey.json <<EOL
{ YOUR_JSON_CONTENT_HERE }
EOL
echo "✅ ServiceAccountKey.json added"

echo "🐳 Step 4: Building and Running Docker container for backend"
cd ~/task/backend

docker stop task-backend 2>/dev/null || true
docker rm task-backend 2>/dev/null || true

docker build -t task-backend .
docker run -d --name task-backend -p 5000:5000 --env-file .env task-backend
echo "✅ Backend Docker container running"

echo "⚙️ Step 5: Updating nginx.conf (Manual step)"
echo "⚠️ Edit your nginx.conf and replace with:"
echo "
location /api/ {
    proxy_pass http://<your-ec2-backend-ip>:5000/;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
}
"
echo "📝 After editing nginx.conf, reload Nginx:"
echo "sudo systemctl reload nginx"

echo "🛡️ Step 6: Ensure your backend index.js has correct CORS settings:"
echo "
app.use(cors({
  origin: ['http://<your-ec2-ip>', 'http://localhost:5173'],
  credentials: true,
}));
"

echo "📦 Step 7: Ensuring .gitignore has sensitive files ignored"
cd ~/task
cat > .gitignore <<EOL
.env
services/ServiceAccountKey.json
node_modules/
dist/
EOL
echo "✅ .gitignore updated"

echo "🎉 Deployment Script Complete!"
