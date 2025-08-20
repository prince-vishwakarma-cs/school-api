# School Management API

A Node.js REST API for managing school data with proximity-based sorting functionality.

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
