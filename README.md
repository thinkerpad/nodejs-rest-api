# 📘 U.S. States REST API

A RESTful API built using **Node.js**, **Express**, and **MongoDB** that provides detailed information and fun facts about the 50 U.S. states. This project is the final assignment for the INF 653 - Back-End Web Development I course at Fort Hays State University.

---

## 🚀 Features

- 📂 GET all U.S. states (with optional contiguous/non-contiguous query filter)
- 🔍 GET a single state by code
- 💡 GET a random fun fact for a state
- 🏛️ GET capital, nickname, population, and admission date for a state
- ➕ POST fun facts to a state
- ✏️ PATCH to update a specific fun fact
- ❌ DELETE a specific fun fact
- ⚠️ Custom 404 error handling for HTML, JSON, and plain text
- 🌐 Deployed using Glitch

---

## 📁 API Endpoints

### Base URL
https://your-project-name.glitch.me/states/


### GET Requests

| Route                        | Description                                         |
|-----------------------------|-----------------------------------------------------|
| `/`                         | Returns all 50 states                               |
| `/?contig=true`             | Returns only contiguous states (excludes AK and HI)|
| `/?contig=false`            | Returns only non-contiguous states (AK and HI)     |
| `/:state`                   | Returns full info about a single state             |
| `/:state/funfact`           | Returns a random fun fact                          |
| `/:state/capital`           | Returns the state capital                          |
| `/:state/nickname`          | Returns the state nickname                         |
| `/:state/population`        | Returns the state population                       |
| `/:state/admission`         | Returns the admission date                         |

### POST Request

| Route               | Body                                              | Description                          |
|--------------------|---------------------------------------------------|--------------------------------------|
| `/:state/funfact`  | `{ "funfacts": ["fact1", "fact2"] }`              | Adds one or more fun facts to a state|

### PATCH Request

| Route               | Body                                          | Description                                  |
|--------------------|-----------------------------------------------|----------------------------------------------|
| `/:state/funfact`  | `{ "index": 1, "funfact": "Updated fact" }`   | Updates a specific fun fact by 1-based index |

### DELETE Request

| Route               | Body             | Description                                      |
|--------------------|------------------|--------------------------------------------------|
| `/:state/funfact`  | `{ "index": 1 }` | Deletes a specific fun fact by 1-based index     |

---

## 🧰 Tech Stack

- **Node.js**
- **Express**
- **MongoDB** (Mongoose)
- **dotenv**
- **CORS**
- **Thunder Client / Postman**

---

## 📄 Project Structure
nodejs-rest-api/
│
├── controllers/
│ └── states.controller.js
├── data/
│ ├── mongoDb.js
│ └── statesData.json
├── models/
│ └── States.js
├── middlewares/
│ └── verifyState.js
├── routes/
│ └── states.routes.js
├── views/
│ ├── index.html
│ └── 404.html
├── .env
├── server.js
└── README.md


---

## 🧪 Testing

You can test your API locally using:

- Thunder Client (VSCode Extension)
- Postman
- Or directly in the browser for simple GET requests

---

## 📌 Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. **Install dependencies**
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

3. **Create your .env file**
PORT=5050
DATABASE_URI=your_mongodb_connection_string

4. **Run the development server**
npm start
