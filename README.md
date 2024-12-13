# backend-modify

### Technologies Used
* [NodeJS](https://nodejs.org/) This is a cross-platform runtime environment built on Chrome's V8 JavaScript engine used in running JavaScript codes on the server. It allows for installation and managing of dependencies and communication with databases.
* [ExpressJS](https://www.expresjs.org/) This is a NodeJS web application framework.

### API Endpoints
| HTTP Verbs | Endpoints | Action |
| --- | --- | --- |
| POST | /api/user/signup | To sign up a new user account |
| POST | /api/user/login | To login an existing user account |
| POST | /api/causes | To create a new cause |
| GET | /api/causes | To retrieve all causes on the platform |
| GET | /api/causes/:causeId | To retrieve details of a single cause |
| PATCH | /api/causes/:causeId | To edit the details of a single cause |
| DELETE | /api/causes/:causeId | To delete a single cause |

## Token Payload

Token payload should contain the following data:

```json
{
  "access_token": "<access_token>",
  "refresh_token": "<refresh_token>",
  "expires_in": "<seconds>"
}
```

## Dokumentasi Postman

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
