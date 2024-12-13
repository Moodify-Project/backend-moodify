# API Documentation

## Technologies Used

- [NodeJS](https://nodejs.org/): A cross-platform runtime environment built on Chrome's V8 JavaScript engine used to run JavaScript code on the server. It facilitates dependency management and database communication.
- [ExpressJS](https://expressjs.org/): A NodeJS web application framework.

---

## API Endpoints

### 1. POST /api/v1/auth/register
#### Request Body:
```json
{
    "username": "agung",
    "email": "agung5@gmail.com",
    "password": "Ayam123!"
}
```
#### Error Response:
```json
{
    "success": false,
    "message": "Username or email already registered"
}
```
#### Success Response:
```json
{
    "success": true,
    "message": "success registered"
}
```

### 2. POST /api/v1/auth/login
#### Request Body:
```json
{
    "email": "agung@gmail.com",
    "password": "Ayam1234!"
}
```
#### Error Response:
```json
{
    "status": false,
    "error": "No User found"
}
```
#### Success Response:
```json
{
    "status": true,
    "message": "login successfully",
    "accessToken": "<your_access_token>",
    "refreshToken": "<your_refresh_token>",
    "expRefreshToken": "2024-12-20T02:33:44.467Z"
}
```
#### Token Expired Response:
```json
{
    "message": "Invalid or expired token"
}
```

### 3. POST /api/v1/journals
#### Request Header:
```
Authorization: <your_bearer_token>
```
#### Request Body:
```json
{
    "journalContent": "<your_content>"
}
```
#### Error Responses:
**409 Conflict:**
```json
{
    "status": false,
    "message": "Journal already created today"
}
```
**422 Unprocessable Entity:**
```json
{
    "status": false,
    "message": "validation error when create new journal",
    "errors": [
        "String must contain at least 200 character(s)"
    ]
}
```
#### Success Response:
```json
{
    "status": true,
    "message": "Successfully created journal"
}
```

### 4. GET /api/v1/profiles/me
#### Request Header:
```
Authorization: <your_bearer_token>
```
#### Success Response:
```json
{
    "status": true,
    "result": {
        "email": "komangweda@gmail.com",
        "username": "KomangWeda",
        "name": "Mr. Wednesday",
        "gender": "male",
        "country": "Not Representing",
        "urlphoto": "https://storage.googleapis.com/bucket-profile-moodify/profileImage_komangweda@gmail.com_03122024_055647.jpeg"
    }
}
```

### 5. PUT /api/v1/profiles/me
#### Request Header:
```
Authorization: <your_bearer_token>
```
#### Request Body:
```json
{
    "name": "bagus candra",
    "gender": "male",
    "country": "USA"
}
```
#### Error Response:
```json
{
    "status": false,
    "error_msg": {
        "name": [
            "String must contain at least 4 character(s)"
        ]
    }
}
```
#### Success Response:
```json
{
    "status": true,
    "message": "Success update your profile"
}
```

### 6. PATCH /api/v1/profiles/photo
#### Request Header:
```
Authorization: <your_bearer_token>
```
#### Request Body (form-data):
```form_data
{
    "image": <image_file>
}
```
#### Error Responses:
**Image Size Above 2 MB:**
```json
{
    "status": false,
    "message": "internal server error, Max size of image file must be below 2 MB"
}
```
**No Value Provided:**
```json
{
    "status": false,
    "message": "Please provide your photo profile"
}
```
**Wrong Format:**
```json
{
    "status": false,
    "message": "internal server error, Only PNG, JPEG, JPG, and WEBP are allowed"
}
```
#### Success Response:
```json
{
    "status": true,
    "message": "success upload image",
    "imageUrl": "https://storage.googleapis.com/bucket-profile-moodify/profileImage_agung52@gmail.com_13122024_025756.png"
}
```

### 7. GET /api/v1/articles/bookmarks/me
#### Request Header:
```
Authorization: <your_bearer_token>
```
#### Success Response:
```json
{
    "status": true,
    "message": "successfully fetch bookmark article for user with email: komangweda@gmail.com",
    "articles": [
        {
            "id": "03e37921-8d94-4e6c-a584-b33ec4879453",
            "source": "Forbes",
            "author": "Lance Eliot",
            "title": "Generative AI Is Helping To Clear Up Brain Fog",
            "description": "People talk about having brain fog. The meaning differs. One creative way to aid diagnosing and resolving brain fog is via generative AI. Here's the inside scoop.",
            "url": "https://www.forbes.com/sites/lanceeliot/2024/11/24/generative-ai-is-helping-to-clear-up-brain-fog/",
            "urlToImage": "https://imageio.forbes.com/specials-images/imageserve/6742bd86c3e3f33f6f0ec417/0x0.jpg",
            "publishedAt": "2024-11-24T05:52:47.000Z",
            "content": "Generative AI and large language models (LLMs) are now one of the modern solutions..."
        }
    ]
}
```

### 8. GET /api/v1/journals?date=<query_params_date>
#### Request Header:
```
Authorization: <your_bearer_token>
```
#### Query Params:
`date` (string, e.g. 2024-12-10)

#### Error Response:
```json
{
    "status": false,
    "message": "Journal created that day is not found"
}
```
#### Success Response:
```json
{
    "status": true,
    "message": "Journal fetch successfully from database",
    "journal": {
        "emailAuthor": "komangweda@gmail.com",
        "journalId": "9f7fbc3e-be0c-4e0e-bec4-fc21012e88ee",
        "content": "Today felt like an emotional rollercoaster...",
        "createdAt": "2024-12-11T07:57:25.393Z",
        "updatedAt": "2024-12-11T07:57:25.393Z",
        "isPredicted": true
    }
}
```

### 9. GET /api/v1/articles?index=<index>

**Authorization:** `<your_bearer_token>`  
**Query Parameter:** `index` (integer, e.g., 0, 1, 2, 10)

#### Error Response: Redis Unavailable
```json
{
    "status": false,
    "error": "connect ECONNREFUSED <redis_ip>"
}
```

#### Success Response:
```json
{
    "status": true,
    "message": "success get article from DB",
    "index": 0,
    "totalArticle": 10,
    "data": [
        {
            "bookmarkedCount": 8,
            "id": "03e37921-8d94-4e6c-a584-b33ec4879453",
            "title": "Generative AI Is Helping To Clear Up Brain Fog",
            "description": "People talk about having brain fog. The meaning differs. One creative way to aid diagnosing and resolving brain fog is via generative AI. Here's the inside scoop.",
            "url": "https://www.forbes.com/sites/lanceeliot/2024/11/24/generative-ai-is-helping-to-clear-up-brain-fog/",
            "urlToImage": "https://imageio.forbes.com/specials-images/imageserve/6742bd86c3e3f33f6f0ec417/0x0.jpg?format=jpg&crop=2882,2160,x664,y0,safe&height=900&width=1600&fit=bounds",
            "publishedAt": "2024-11-24T05:52:47.000Z",
            "content": "Of the newest paths to try and cope with brain fog, generative AI and large language models (LLMs) ... [+] enter into the realm.\r\ngetty\r\nIn todays column, I explore the dreary and potentially imperil… "
        },
        {
            "bookmarkedCount": 5,
            "id": "02ab236c-358c-4d74-aba9-f17a439ad754",
            "title": "Generative AI As Your Faithful Guide Toward Manifestation And Achieving Your Dreams And Life Goals",
            "description": "A trending topic is manifestation. Here's what it is all about. Plus, the twist is that generative AI can aid in your manifestation pursuits. Pro tips are provided.",
            "url": "https://www.forbes.com/sites/lanceeliot/2024/11/25/generative-ai-as-your-faithful-guide-toward-manifestation-and-achieving-your-dreams-and-life-goals/",
            "urlToImage": "https://imageio.forbes.com/specials-images/imageserve/6744f29104d97693032485a5/0x0.jpg?format=jpg&crop=3013,2259,x365,y0,safe&height=900&width=1600&fit=bounds",
            "publishedAt": "2024-11-26T02:36:56.000Z",
            "content": "People are talking about manifestation, which turns out can be aided via the use of modern-day ... [+] generative AI and LLMs.\r\ngetty\r\nIn todays column, I explore the trending topic of manifestation,… "
        }
    ]
}
```

---

### 10. POST /api/v1/articles/bookmark

**Authorization:** `<your_bearer_token>`  
**Request Body:**
```json
{
    "articleId": "02ab236c-358c-4d74-aba9-f17a439ad754"
}
```

#### Error Response: Article ID Not Found
```json
{
    "status": false,
    "message": "Article with id: 03e37921-8d94-4e6c-a584-b33ec4879453a is not found"
}
```

#### Success Response:
```json
{
    "status": true,
    "message": "Success bookmarked article with id: 03e37921-8d94-4e6c-a584-b33ec4879453"
}
```

---

### 11. DELETE /api/v1/articles/bookmark

**Authorization:** `<your_bearer_token>`  
**Request Body:**
```json
{
    "articleId": "02ab236c-358c-4d74-aba9-f17a439ad754"
}
```

#### Error Response: Bookmarked Article Not Found
```json
{
    "status": false,
    "error": "can't delete article with id 02ab236c-358c-4d74-aba9-f17a439ad754",
    "message": "Article not found in bookmark with email: agung52@gmail.com"
}
```

#### Success Response:
```json
{
    "status": true,
    "message": "successfully delete article with id 03e37921-8d94-4e6c-a584-b33ec4879453 from bookmark"
}
```

---

### 12. POST /api/v1/auth/refresh_token

**Authorization:** `<your_bearer_token>`  
**Cookie:** `refreshToken=<your_refresh_token>`  

#### Success Response:
```json
{
    "expiredDate": "2024-11-29T02:52:13.318Z"
}
```

#### Error Response: Refresh Token Expired
```json
{
    "error": true,
    "message": "internal server error, token has expired"
}
```

#### Success Response:
```json
{
    "error": false,
    "message": "Successfully refreshed token",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFndW5nNTJAZ21haWwuY29tIiwiaWF0IjoxNzM0MDY3NjQ3LCJleHAiOjE3MzQxNTQwNDd9.dNE2J0KOAcK3cD33I-rnHqp64iuSD3SpCq9wAhX8gK0",
    "expiredDate": "2024-12-20T05:27:27.908Z"
}
```

---

### 13. GET /api/v1/journals/moods/weekly?date=<query_params_date>

**Authorization:** `<your_bearer_token>`  
**Query Parameter:** `date` (string, e.g., `2024-12-10`)

#### Success Response:
```json
{
    "error": false,
    "moods": {
        "anger": 8,
        "enthusiasm": 51,
        "happiness": 33,
        "sadness": 8,
        "worry": 3
    }
}
```

### Dokumentasi Postman

![Articles](dokumentation%20postman/detail%20articles.png)
![Detail Articles](dokumentation%20postman/detail%20articles.png)
![Edit Journal](dokumentation%20postman/edit%20journal.png)
![Edit Photo Profile](dokumentation%20postman/edit%20photo%20profile.png)
![Edit Profile](dokumentation%20postman/edit%20profile.png)
![Journal Create Success](dokumentation%20postman/journal%20create%20success.png)
![Journal Each Day](dokumentation%20postman/journal%20each%20day.png)
![Journal Validate Fail](dokumentation%20postman/journal%20validate%20fail.png)
![Login](dokumentation%20postman/login.png)
![Nations](dokumentation%20postman/nations.png)
![New Bookmark](dokumentation%20postman/new%20bookmark.png)
![Profile](dokumentation%20postman/profile.png)
![Refresh Token](dokumentation%20postman/refresh%20token.png)
![Register](dokumentation%20postman/register.png)
![Show Bookmark](dokumentation%20postman/show%20bookmark.png)
![Update Journal by Date](dokumentation%20postman/update%20journal%20by%20date.png)
![Weekly Mood](dokumentation%20postman/weekly%20mood.png)
