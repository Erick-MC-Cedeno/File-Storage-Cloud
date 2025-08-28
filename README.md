# File-Storage-Cloud
File-Storage-Cloud is a secure and scalable cloud-based file storage solution designed to handle all types of files while ensuring privacy and data protection. It provides users with a reliable platform to store, organize, and manage their files in the cloud, with a focus on safety, accessibility, and confidentiality.


## 🛠️ Tech Stack
- ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) **React**
- ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white) **Node.js**
- ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat&logo=express) **Express.js**
- ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white) **MongoDB**
- ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) **Docker**
- ![Docker Compose](https://img.shields.io/badge/Docker%20Compose-2496ED?style=flat&logo=docker&logoColor=white) **Docker Compose**
- ![Git](https://img.shields.io/badge/Git-F05033?style=flat&logo=git&logoColor=white) **Git**

 
 ## Usage and Installation
 
 ```bash
 git clone https://github.com/pratik-choudhari/File-Storage-Cloud.git
 ```
 
 
 ```bash
 cd File-Storage-Cloud
 ```

 ```bash
 cd backend
 ```

  ```bash
  npm install
  or 
  pnpm install
 ```

 ```bash
  pnpm add -g nodemon
  or 
  npm install -g nodemon
 ```
 

 ## start DB intance
 ```bash
 docker-compose up -d
 ```

 ## start frontend

  ```bash
  cd frontend
  ```

   ```bash
   npm install
   or 
   pnpm install
   ```

   ```bash
  npm start
 ```


## api endpoints



### Auth Routes

- **POST /api/auth/signup**  
  Allows registering a new user by providing full name, username, password, and gender.

- **POST /api/auth/login**  
  Allows a user to log in with a username and password. Generates an authentication token.

- **POST /api/auth/logout**  
  Logs out the current user by clearing the authentication cookie.

---

### User Routes

- **GET /api/user**  
  Returns all registered users except the authenticated user. Authentication is required.

---

### Files Routes

- **POST /api/files/upload**  
  Allows uploading a file to the server. Uses `multer` to handle in-memory file uploads and requires authentication.  
  The file must be sent as `form-data` with the key `"file"`.

- **GET /api/files/:id**  
  Allows downloading a specific file by its ID. Authentication is required.

- **DELETE /api/files/:id**  
  Allows deleting a specific file by its ID. Authentication is required.

---

### Others

- **GET /health**  
  Endpoint to check the server’s status.

- **404 Handler**  
  Responds with an error if the requested route does not exist.

- **Error Handler**  
  Catches unhandled errors and responds with a generic server error.




