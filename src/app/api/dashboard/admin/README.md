# Admin Dashboard API Documentation

Complete API reference for the MediScan AI admin dashboard.

## 📋 Table of Contents

- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Dashboard Stats](#dashboard-stats)
  - [Users Management](#users-management)
  - [Doctors](#doctors)
  - [Pharmacists](#pharmacists)
  - [Team](#team-admins)
  - [Drugs](#drugs)
  - [Analytics](#analytics)
  - [Activity Log](#activity-log)
  - [Settings](#settings)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## 🔐 Authentication

All admin endpoints require JWT authentication with admin role.

### Headers
```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Getting the Token
```javascript
const token = localStorage.getItem('authToken');
```

---

## 📊 Endpoints

### Dashboard Stats

#### `GET /api/dashboard/admin`

Fetch comprehensive dashboard statistics.

**Response:**
```json
{
  "message": "Admin dashboard data fetched successfully",
  "data": {
    "totalUsers": 150,
    "totalDoctors": 30,
    "totalPatients": 100,
    "totalPharmacists": 20,
    "totalPrescriptions": 450,
    "totalDrugs": 1200,
    "activeUsers": 140,
    "pendingUsers": 10,
    "newUsersThisMonth": 25,
    "newUsersThisWeek": 8,
    "recentUsers": [
      {
        "_id": "...",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "role": "doctor",
        "status": "active",
        "createdAt": "2026-06-27T10:00:00.000Z"
      }
    ],
    "recentPrescriptions": [...],
    "stats": {
      "userGrowthMonth": 25,
      "userGrowthWeek": 8,
      "activePercentage": 93
    }
  }
}
```

---

### Users Management

#### `GET /api/dashboard/admin/users`

List all users with optional filtering.

**Query Parameters:**
- `role` - Filter by role (doctor | patient | pharmacist | admin)
- `search` - Search by name or email

**Example:**
```
GET /api/dashboard/admin/users?role=doctor&search=john
```

**Response:**
```json
{
  "message": "Users fetched successfully",
  "data": [
    {
      "_id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "mobileNumber": "+1234567890",
      "role": "doctor",
      "status": "active",
      "specialization": "Cardiology",
      "createdAt": "2026-06-27T10:00:00.000Z"
    }
  ]
}
```

#### `PATCH /api/dashboard/admin/users`

Update user status (active/inactive).

**Request Body:**
```json
{
  "userId": "...",
  "status": "inactive"
}
```

**Response:**
```json
{
  "message": "User status updated successfully"
}
```

#### `DELETE /api/dashboard/admin/users?userId=...`

Delete a user by ID.

**Query Parameters:**
- `userId` (required) - User ID to delete

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

**Notes:**
- Admins cannot delete themselves
- Returns 400 if attempting self-deletion

---

### Doctors

#### `GET /api/dashboard/admin/doctors`

Get list of all doctors.

**Response:**
```json
{
  "message": "Doctors fetched successfully",
  "data": [
    {
      "_id": "...",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "mobileNumber": "+1234567890",
      "specialization": "Pediatrics",
      "govId": "DOC123456",
      "status": "active",
      "createdAt": "2026-06-27T10:00:00.000Z"
    }
  ]
}
```

---

### Pharmacists

#### `GET /api/dashboard/admin/pharmacy`

Get list of all pharmacists.

**Response:**
```json
{
  "message": "Pharmacists fetched successfully",
  "data": [
    {
      "_id": "...",
      "firstName": "Mike",
      "lastName": "Johnson",
      "email": "mike@example.com",
      "mobileNumber": "+1234567890",
      "govId": "PHA123456",
      "status": "active",
      "createdAt": "2026-06-27T10:00:00.000Z"
    }
  ]
}
```

---

### Team (Admins)

#### `GET /api/dashboard/admin/team`

Get list of all admin users.

**Response:**
```json
{
  "message": "Admin team fetched successfully",
  "data": [
    {
      "_id": "...",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@example.com",
      "mobileNumber": "+1234567890",
      "status": "active",
      "createdAt": "2026-06-27T10:00:00.000Z"
    }
  ]
}
```

---

### Drugs

#### `GET /api/dashboard/admin/drugs`

Get list of all drugs in the system.

**Response:**
```json
{
  "message": "Drugs fetched successfully",
  "data": [
    {
      "_id": "...",
      "name": "Aspirin",
      "description": "Pain reliever",
      "manufacturer": "PharmaCo",
      "createdAt": "2026-06-27T10:00:00.000Z"
    }
  ]
}
```

---

### Analytics

#### `GET /api/dashboard/admin/analytics`

Get detailed analytics and chart data.

**Response:**
```json
{
  "message": "Analytics data fetched successfully",
  "data": {
    "userGrowth": [
      { "month": "2026-01", "count": 15 },
      { "month": "2026-02", "count": 23 },
      { "month": "2026-03", "count": 30 }
    ],
    "usersByRole": [
      { "role": "patient", "count": 100 },
      { "role": "doctor", "count": 30 },
      { "role": "pharmacist", "count": 20 }
    ],
    "usersByStatus": [
      { "status": "active", "count": 140 },
      { "status": "pending", "count": 10 }
    ],
    "usersByProvider": [
      { "provider": "local", "count": 120 },
      { "provider": "google", "count": 20 },
      { "provider": "github", "count": 5 },
      { "provider": "apple", "count": 5 }
    ],
    "prescriptionTrends": [
      { "date": "2026-06-01", "count": 15 },
      { "date": "2026-06-02", "count": 18 }
    ]
  }
}
```

**Use Cases:**
- User growth charts (line/bar charts)
- Role distribution (pie/donut charts)
- OAuth provider breakdown
- Prescription activity trends

---

### Activity Log

#### `GET /api/dashboard/admin/activity`

Get recent system activities.

**Query Parameters:**
- `limit` - Number of results (default: 50, max: 100)
- `skip` - Offset for pagination (default: 0)

**Example:**
```
GET /api/dashboard/admin/activity?limit=20&skip=0
```

**Response:**
```json
{
  "message": "Activity log fetched successfully",
  "data": [
    {
      "type": "user_registered",
      "timestamp": "2026-06-27T10:00:00.000Z",
      "data": {
        "userId": "...",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "doctor",
        "provider": "google"
      }
    },
    {
      "type": "prescription_created",
      "timestamp": "2026-06-27T09:55:00.000Z",
      "data": {
        "prescriptionId": "...",
        "patientName": "Jane Smith",
        "symptoms": "Headache",
        "medicationCount": 2
      }
    }
  ],
  "pagination": {
    "limit": 50,
    "skip": 0,
    "total": 100
  }
}
```

#### `POST /api/dashboard/admin/activity`

Log a custom admin action.

**Request Body:**
```json
{
  "type": "user_banned",
  "data": {
    "userId": "...",
    "reason": "Terms violation",
    "bannedUntil": "2026-07-27"
  }
}
```

**Response:**
```json
{
  "message": "Activity logged successfully",
  "data": {
    "type": "user_banned",
    "data": {...},
    "adminId": "...",
    "adminEmail": "admin@example.com",
    "timestamp": "2026-06-27T10:00:00.000Z"
  }
}
```

---

### Settings

#### `GET /api/dashboard/admin/settings`

Get system configuration.

**Response:**
```json
{
  "message": "Settings fetched successfully",
  "data": {
    "type": "system",
    "maxPrescriptionScans": 5,
    "allowSelfRegistration": true,
    "requireEmailVerification": false,
    "maintenanceMode": false,
    "allowedOAuthProviders": ["google", "github", "apple"],
    "defaultUserRole": "patient",
    "sessionTimeout": 172800,
    "createdAt": "2026-06-27T10:00:00.000Z",
    "updatedAt": "2026-06-27T10:00:00.000Z"
  }
}
```

#### `PATCH /api/dashboard/admin/settings`

Update system settings.

**Request Body:**
```json
{
  "maxPrescriptionScans": 10,
  "allowSelfRegistration": false,
  "maintenanceMode": true
}
```

**Response:**
```json
{
  "message": "Settings updated successfully",
  "data": {
    "type": "system",
    "maxPrescriptionScans": 10,
    "allowSelfRegistration": false,
    "maintenanceMode": true,
    "updatedAt": "2026-06-27T10:05:00.000Z",
    "updatedBy": "..."
  }
}
```

---

## ⚠️ Error Handling

### Error Response Format
```json
{
  "message": "Error description"
}
```

### HTTP Status Codes

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| 200 | OK | Successful request |
| 400 | Bad Request | Invalid parameters or body |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | User is not an admin |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

### Common Errors

#### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```
**Solution:** Include valid JWT token in Authorization header

#### 403 Forbidden
```json
{
  "message": "Forbidden: Admin access required"
}
```
**Solution:** Ensure user has admin role

#### 400 Bad Request
```json
{
  "message": "userId and status are required"
}
```
**Solution:** Include all required fields in request

---

## 🔒 Security Best Practices

1. **Never log tokens** - Don't console.log authentication tokens
2. **Validate input** - Always validate user input before sending
3. **Handle errors gracefully** - Don't expose sensitive error details
4. **Use HTTPS** - Always use HTTPS in production
5. **Token expiry** - Handle token expiration (2 days default)

---

## 📱 Frontend Integration Examples

### React/Next.js Hook
```typescript
import { useState, useEffect } from 'react';

export function useAdminStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/dashboard/admin', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { data, loading, error };
}
```

### Delete User
```typescript
async function deleteUser(userId: string) {
  const token = localStorage.getItem('authToken');
  const response = await fetch(
    `/api/dashboard/admin/users?userId=${userId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}
```

### Update Settings
```typescript
async function updateSettings(newSettings: any) {
  const token = localStorage.getItem('authToken');
  const response = await fetch('/api/dashboard/admin/settings', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newSettings),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}
```

---

## 🧪 Testing

### Using cURL

```bash
# Get dashboard stats
curl -X GET http://localhost:3000/api/dashboard/admin \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Update user status
curl -X PATCH http://localhost:3000/api/dashboard/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID","status":"inactive"}'

# Delete user
curl -X DELETE "http://localhost:3000/api/dashboard/admin/users?userId=USER_ID" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Create a new request
2. Set method (GET, POST, PATCH, DELETE)
3. Add Authorization header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE`
4. For POST/PATCH, add request body as JSON
5. Send request

---

## 📊 Rate Limiting

Currently not implemented. Consider adding rate limiting for:
- 100 requests per minute per IP
- 1000 requests per hour per user
- Use Redis for distributed rate limiting

---

## 🔄 Versioning

Current Version: **v1**

Future versions will be accessible via:
```
/api/v2/dashboard/admin/...
```

---

## 📞 Support

For issues or questions:
1. Check this documentation first
2. Review error messages carefully
3. Check browser console for client-side errors
4. Review server logs for backend errors

---

## 📝 Changelog

### v1.0.0 (2026-06-27)
- Initial release
- Dashboard stats endpoint
- User management (GET, PATCH, DELETE)
- Analytics endpoint
- Activity logging
- System settings management
- OAuth role selection support
