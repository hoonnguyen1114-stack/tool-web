# 🔑 Password Variant Tool PRO v2.0

**Multi-Stage Mutation Engine** - Advanced password variant generator

## Architecture

```
project/
├── frontend/               # Client-side code
│   ├── index.html         # Main HTML
│   ├── css/               # Styles
│   └── js/                # Frontend JavaScript
│       ├── config.js      # Configuration & rules
│       ├── ui.js          # UI logic
│       ├── api.js         # API calls
│       └── main.js        # Entry point
├── backend/               # Server-side code
│   ├── server.js          # Express app
│   ├── routes/
│   │   └── variants.js    # API endpoints
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validation.js
│   └── utils/
│       ├── rules.js       # Transformation rules
│       └── validators.js  # Validation logic
├── .env.example           # Environment template
├── package.json           # Dependencies
└── README.md
```

## Security Features

✅ **Frontend-Backend Separation**: Logic hidden on backend  
✅ **Rate Limiting**: Prevents abuse (10 requests per 15 seconds)  
✅ **Input Validation**: Joi schema validation  
✅ **CORS Protection**: Configurable origin  
✅ **Helmet.js**: Security headers  
✅ **File Upload Limits**: 5MB max  
✅ **Error Handling**: Safe error messages  

## Installation

### Prerequisites
- Node.js >= 14
- npm or yarn

### Setup

1. **Clone repository**
```bash
git clone https://github.com/hoonnguyen1114-stack/tool-web.git
cd tool-web
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

4. **Edit .env** (optional)
```env
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
MAX_RESULTS=100000
```

5. **Start server**
```bash
# Development
npm run dev

# Production
npm start
```

6. **Access**
```
http://localhost:5000
```

## API Endpoints

### 1. Basic Rules
```bash
POST /api/variants/basic
```

**Request:**
```json
{
  "data": [
    {"user": "john", "pass": "password123"}
  ],
  "rules": ["1a", "2a", "3e"],
  "maxResults": 100000,
  "chunkSize": 500
}
```

**Response:**
```json
{
  "success": true,
  "totalGenerated": 12450,
  "totalInput": 1,
  "ratio": 12450,
  "allResults": ["john:password123lower", ...]
}
```

### 2. Advanced (with chaining)
```bash
POST /api/variants/advanced
```

**Request:**
```json
{
  "data": [...],
  "rules": [...],
  "depth": 2,
  "maxResults": 100000,
  "chunkSize": 500
}
```

### 3. Custom Patterns
```bash
POST /api/variants/custom
```

**Request:**
```json
{
  "data": [...],
  "prefixes": ["vn_", "admin_"],
  "suffixes": [".pro", "@vip"],
  "separators": ["_", "-"],
  "maxResults": 100000
}
```

## Rules Reference

| Rule ID | Description | Example |
|---------|-------------|----------|
| 1a | Lowercase | `password` |
| 1b | UPPERCASE | `PASSWORD` |
| 1c | Capitalize | `Password` |
| 2a-2g | Add numbers | `password123` |
| 3a-3g | Add years | `password2024` |
| 4a-4f | Special chars | `password@` |
| 5a-5g | Vietnamese suffixes | `passwordvip` |
| 6a-6f | LEET speak | `p@ssw0rd` |
| 7a-7c | Separators | `pass_123` |
| 8a-8b | Reverse | `drowssap` |
| 9a-9b | Duplicate | `passwordpassword` |
| 10a-10d | Username variations | `john123` |
| 11a-11c | Combinations | `123password1` |
| 12a-12c | Phone numbers | `0123456789@` |

## Deployment

### Heroku
```bash
heroku create tool-web
git push heroku main
heroku config:set CORS_ORIGIN=https://tool-web.herokuapp.com
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Build & Run
```bash
docker build -t tool-web .
docker run -p 5000:5000 -e PORT=5000 tool-web
```

## Development

### Testing
```bash
npm test
```

## Performance Tips

1. **Adjust chunk size** for your server capacity
2. **Limit depth** to 2-3 for best performance
3. **Set max results** based on available memory
4. **Use custom patterns** for faster generation

## Limitations

- Max password length: 20 characters
- Max input file: 10,000 entries
- Max results: 1,000,000 variants
- Rate limit: 10 requests per 15 seconds

## License

MIT License

## Author

**@teddyvrp**

---

**Version 2.0** - Multi-Stage Mutation Engine  
Built with ❤️ for security professionals
