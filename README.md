// README.md
# School Management API

A Node.js REST API for managing school data with proximity-based sorting functionality.

## Features

- Add new schools with validation
- Retrieve schools sorted by distance from user location
- MySQL database with proper indexing
- Comprehensive input validation
- Error handling and logging
- CORS support
- Health check endpoint

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd school-management-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a MySQL database:
```sql
CREATE DATABASE school_management;
```

4. Configure environment variables:
Create a `.env` file in the root directory with:
```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=school_management
PORT=3000
NODE_ENV=development
```

5. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### 1. Add School
**POST** `/api/addSchool`

**Request Body:**
```json
{
  "name": "ABC Public School",
  "address": "123 Main Street, City, State 12345",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Response:**
```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "ABC Public School",
    "address": "123 Main Street, City, State 12345",
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}
```

### 2. List Schools
**GET** `/api/listSchools?latitude={userLat}&longitude={userLon}`

**Query Parameters:**
- `latitude`: User's latitude (-90 to 90)
- `longitude`: User's longitude (-180 to 180)

**Response:**
```json
{
  "success": true,
  "message": "Schools retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Nearest School",
      "address": "456 Close Street, City, State",
      "latitude": 40.7130,
      "longitude": -74.0065,
      "distance": 0.52
    }
  ],
  "userLocation": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "totalSchools": 1
}
```

### 3. Health Check
**GET** `/api/health`

## Database Schema

```sql
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_coordinates (latitude, longitude)
);
```

## Testing

Use the provided Postman collection for testing the APIs. The collection includes:
- Pre-configured requests for both endpoints
- Example data
- Test scripts for validation

## Deployment

### Heroku Deployment

1. Install Heroku CLI
2. Login to Heroku: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables:
```bash
heroku config:set DB_HOST=your_db_host
heroku config:set DB_USER=your_db_user
heroku config:set DB_PASSWORD=your_db_password
heroku config:set DB_NAME=your_db_name
heroku config:set NODE_ENV=production
```
5. Deploy: `git push heroku main`

### Railway Deployment

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

## Error Handling

The API includes comprehensive error handling for:
- Input validation errors
- Database connection issues
- Duplicate entries
- Server errors

## Security Features

- Input validation and sanitization
- SQL injection prevention
- CORS configuration
- Rate limiting ready
- Environment variable protection

## Performance Optimizations

- Database connection pooling
- Indexed coordinates for faster queries
- Efficient distance calculation using Haversine formula
- Response caching ready

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License