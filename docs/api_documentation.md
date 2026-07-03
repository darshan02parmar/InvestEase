# InvestEase Backend API Documentation

## Base URL

**Production**
`https://investease.onrender.com/api`

**Development**
`http://localhost:5000/api`

## Authentication

All protected endpoints require a JSON Web Token to be sent in the header:

`Authorization: Bearer <JWT_TOKEN>`

**Example**
`Authorization: Bearer eyJhbGc...`

---

## Endpoint Summary Quick Reference

| Module | Method | Endpoint | Authentication | Description |
|---|:---:|---|---|---|
| **Auth** | GET | `/api/auth/profile` | Required | Get the authenticated user's profile |
| | POST | `/api/auth/register` | Public | Register a new investor |
| | POST | `/api/auth/login` | Public | Authenticate, receive a JWT |
| **Dashboard** | GET | `/api/dashboard` | Required | Aggregated portfolio, SIP, KYC, health score |
| **Portfolio** | GET | `/api/portfolio` | Required | Portfolio value and allocation |
| | GET | `/api/portfolio/investments`| Required | List investments |
| | POST | `/api/portfolio/investments`| Required | Add an investment; triggers recompute chain |
| | DELETE | `/api/portfolio/investments/:id`| Required | Delete an investment by ID |
| **Systematic Investment Plan (SIP)** | GET | `/api/sips` | Required | List SIPs and status |
| | POST | `/api/sips` | Required | Create a SIP |
| | PUT | `/api/sips/:id` | Required | Update a SIP |
| **KYC** | POST | `/api/kyc/upload` | Required | Upload PAN / Aadhaar / address proof (Max 5MB) |
| | GET | `/api/kyc/status` | Required | Current KYC status |
| **Nominees** | GET | `/api/nominees` | Required | List nominees |
| | POST | `/api/nominees` | Required | Add a nominee (max 3 enforced server-side) |
| | PUT | `/api/nominees/:id` | Required | Update a nominee |
| | DELETE | `/api/nominees/:id` | Required | Remove a nominee |
| **Statements** | GET | `/api/statements` | Required | List previously generated statements |
| | POST | `/api/statements/download`| Required | Generate (or return cached) PDF for a given month/year |
| **Support** | POST | `/api/support` | Required | Submit a ticket |
| | GET | `/api/support` | Required | List own tickets |
| **Assistant** | POST | `/api/assistant/query` | Required | Submit to Guided Resolution Assistant |
| **Notifications** | GET | `/api/notifications` | Required | List notifications |
| | PUT | `/api/notifications/:id/read`| Required | Mark as read |
| **Admin** | GET | `/api/kyc/admin/pending` | Admin | Pending KYC queue |
| | PUT | `/api/kyc/admin/:id` | Admin | Approve or reject KYC documents |
| | GET | `/api/admin/dashboard` | Admin | Get Admin Dashboard data |

---

## Detailed API Reference

### 1. Authentication (`/api/auth`)

#### Register Investor
*   **Method**: `POST` `/api/auth/register`
*   **Authentication**: Public
*   **Request Body**:
    ```json
    {
      "name": "Darshan Parmar",
      "email": "darshan@investease.com",
      "password": "Password@123",
      "mobile": "9876543210"
    }
    ```
*   **Response Codes**:
    *   `201 Created`: User successfully registered. Returns signed JWT Token.
    *   `400 Bad Request`: Validation failed or email already exists.

#### Login User
*   **Method**: `POST` `/api/auth/login`
*   **Authentication**: Public
*   **Request Body**:
    ```json
    {
      "email": "demo@investease.com",
      "password": "Demo@123"
    }
    ```
*   **Response Codes**:
    *   `200 OK`: Successful login. Returns user profile details and signed JWT Token.
    *   `400 Bad Request`: Invalid credentials.
    *   `401 Unauthorized`: Authentication failed.
    *   `404 Not Found`: User does not exist.

#### Get Profile
*   **Method**: `GET` `/api/auth/profile`
*   **Authentication**: Required
*   **Response Codes**:
    *   `200 OK`: Returns authenticated user profile.
    *   `401 Unauthorized`: Invalid or missing token.
    *   `404 Not Found`: User profile not found.

---

### 2. Dashboard (`/api/dashboard`)

#### Get Dashboard Command Center Summary
*   **Method**: `GET` `/api/dashboard`
*   **Authentication**: Required
*   **Response Codes**:
    *   `200 OK`: Aggregated payload successfully assembled.
    *   `401 Unauthorized`: Invalid or missing token.
    *   `404 Not Found`: Dashboard data not found.

---

### 3. Portfolio (`/api/portfolio`)

#### Get Portfolio Summary
*   **Method**: `GET` `/api/portfolio`
*   **Authentication**: Required
*   **Response Codes**:
    *   `200 OK`: Returns portfolio value and allocation.
    *   `401 Unauthorized`: Invalid or missing token.

#### Get Investments
*   **Method**: `GET` `/api/portfolio/investments`
*   **Authentication**: Required
*   **Response Codes**:
    *   `200 OK`: Returns list of all investments.
    *   `401 Unauthorized`: Invalid or missing token.

#### Add Investment
*   **Method**: `POST` `/api/portfolio/investments`
*   **Authentication**: Required
*   **Response Codes**:
    *   `201 Created`: Investment successfully added, recompute chain triggered.
    *   `400 Bad Request`: Missing required investment data.
    *   `401 Unauthorized`: Invalid or missing token.

#### Delete Investment
*   **Method**: `DELETE` `/api/portfolio/investments/:id`
*   **Authentication**: Required
*   **Response Codes**:
    *   `200 OK`: Investment successfully removed.
    *   `401 Unauthorized`: Invalid or missing token.
    *   `403 Forbidden`: You do not have permission to delete this record.
    *   `404 Not Found`: Investment record not found.

---

### 4. Systematic Investment Plan (SIP) (`/api/sips`)

#### Create SIP Mandate
*   **Method**: `POST` `/api/sips`
*   **Authentication**: Required
*   **Request Body**:
    ```json
    {
      "fundName": "SBI Equity Hybrid Fund",
      "amount": 5000,
      "frequency": "Monthly"
    }
    ```
*   **Response Codes**:
    *   `201 Created`: SIP mandate successfully created.
    *   `400 Bad Request`: Validation failure.
    *   `401 Unauthorized`: Invalid or missing token.

#### Get SIPs
*   **Method**: `GET` `/api/sips`
*   **Authentication**: Required
*   **Response Codes**:
    *   `200 OK`: Returns all active, paused, and failed SIPs.
    *   `401 Unauthorized`: Invalid or missing token.

#### Update SIP Status
*   **Method**: `PUT` `/api/sips/:id`
*   **Authentication**: Required
*   **Request Body**:
    ```json
    {
      "status": "Paused"
    }
    ```
*   **Response Codes**:
    *   `200 OK`: SIP status successfully updated.
    *   `400 Bad Request`: Invalid status change.
    *   `401 Unauthorized`: Invalid or missing token.
    *   `404 Not Found`: SIP record not found.

---

### 5. Nominees (`/api/nominees`)

#### Add New Nominee
*   **Method**: `POST` `/api/nominees`
*   **Authentication**: Required
*   **Response Codes**:
    *   `201 Created`: Nominee successfully added.
    *   `400 Bad Request`: Validation failure or maximum nominee limit reached (3).
    *   `401 Unauthorized`: Invalid or missing token.

#### Get Configured Nominees
*   **Method**: `GET` `/api/nominees`
*   **Authentication**: Required
*   **Response Codes**:
    *   `200 OK`: Returns list of all configured nominees.
    *   `401 Unauthorized`: Invalid or missing token.

#### Update Nominee
*   **Method**: `PUT` `/api/nominees/:id`
*   **Authentication**: Required
*   **Response Codes**:
    *   `200 OK`: Nominee successfully updated.
    *   `400 Bad Request`: Validation failure.
    *   `401 Unauthorized`: Invalid or missing token.
    *   `404 Not Found`: Nominee record not found.

#### Remove Nominee
*   **Method**: `DELETE` `/api/nominees/:id`
*   **Authentication**: Required
*   **Response Codes**:
    *   `200 OK`: Nominee successfully removed.
    *   `401 Unauthorized`: Invalid or missing token.
    *   `403 Forbidden`: Permission denied.
    *   `404 Not Found`: Nominee record not found.

---

### 6. KYC (`/api/kyc`)

#### Submit KYC Documents
*   **Method**: `POST` `/api/kyc/upload`
*   **Authentication**: Required
*   **Response Codes**:
    *   `201 Created`: Documents uploaded successfully. Status set to Under Verification.
    *   `400 Bad Request`: Missing files or invalid file format.
    *   `401 Unauthorized`: Invalid or missing token.

#### Check KYC Status
*   **Method**: `GET` `/api/kyc/status`
*   **Authentication**: Required
*   **Response Codes**:
    *   `200 OK`: Returns current KYC status (Pending, Under Verification, Approved, Rejected).
    *   `401 Unauthorized`: Invalid or missing token.

---

### 7. Support & Assistant (`/api/support`, `/api/assistant`)

#### Submit Guided Resolution Support Request
*   **Method**: `POST` `/api/support`
*   **Authentication**: Required
*   **Response Codes**:
    *   `201 Created`: Support ticket successfully created.
    *   `400 Bad Request`: Validation failure.
    *   `401 Unauthorized`: Invalid or missing token.

#### Get Own Tickets
*   **Method**: `GET` `/api/support`
*   **Authentication**: Required
*   **Response Codes**:
    *   `200 OK`: Returns all tickets submitted by the user.
    *   `401 Unauthorized`: Invalid or missing token.

#### Assistant Query
*   **Method**: `POST` `/api/assistant/query`
*   **Authentication**: Required
*   **Response Codes**:
    *   `200 OK`: Returns the next node in the decision tree.
    *   `400 Bad Request`: Missing nodeId or answer.
    *   `401 Unauthorized`: Invalid or missing token.

---

### 8. Admin Operations (`/api/admin`, `/api/kyc/admin`)

#### Get Admin Dashboard Data
*   **Method**: `GET` `/api/admin/dashboard`
*   **Authentication**: Admin
*   **Response Codes**:
    *   `200 OK`: Returns admin dashboard metrics.
    *   `401 Unauthorized`: Invalid or missing token.
    *   `403 Forbidden`: User lacks admin privileges.

#### Fetch Pending KYC Reviews
*   **Method**: `GET` `/api/kyc/admin/pending`
*   **Authentication**: Admin
*   **Response Codes**:
    *   `200 OK`: Returns list of users pending KYC verification.
    *   `401 Unauthorized`: Invalid or missing token.
    *   `403 Forbidden`: User lacks admin privileges.

#### Approve/Reject KYC Request
*   **Method**: `PUT` `/api/kyc/admin/:id`
*   **Authentication**: Admin
*   **Response Codes**:
    *   `200 OK`: KYC status successfully updated.
    *   `400 Bad Request`: Validation failure.
    *   `401 Unauthorized`: Invalid or missing token.
    *   `403 Forbidden`: User lacks admin privileges.
    *   `404 Not Found`: KYC record not found.

---

### Error Response Shape

Every endpoint returns errors in a consistent shape via a single Express error-handling middleware:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Must be a valid email address" }]
}
```
