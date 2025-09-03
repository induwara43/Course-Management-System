# Course Management System - Deployment Instructions

## Option 1: Access Live Application
The application is already deployed and accessible at:
**[https://course-management-system-fef1.onrender.com](https://course-management-system-fef1.onrender.com)**

### Login Credentials:
- **Admin Login:** 
  - Username: `admin`
  - Password: `admin123`

### Important Note:
Since this application is hosted on Render's free tier, **the application will automatically shutdown during periods of inactivity**. When you first access the application after it has been idle, it will take approximately **2-3 minutes** to start up again. Please be patient during the initial loading... once the application is active, it will work normally.

---

## Option 2: Local Deployment with Docker

### Prerequisites
- Git installed on your system
- Docker and Docker Compose installed
- Internet connection for downloading dependencies

### Step-by-Step Instructions

#### Step 1: Clone the Repository
```bash
git clone https://github.com/induwara43/course-management-system.git
cd course-management-system
```

#### Step 2: Verify Docker Compose Configuration
Ensure your project has the following files:
- `docker-compose.yml` (in backend directory "course-management")
- `Dockerfile` (in backend directory)
- `Dockerfile` (in frontend directory "course-management-ui")

#### Step 3: Build and Start the Application
```bash
cd course-management
docker-compose up --build
```

This command will:
- Build the Spring Boot backend image
- Build the React frontend image
- Start PostgreSQL database
- Create and start all containers
- Set up networking between services

#### Step 4: Wait for Services to Initialize
The first build may take 5-10 minutes. Wait for these log messages:
- Backend: `Started CourseManagementApplication`
- Frontend: `nginx: [notice] 1#1: start worker processes`
- Database: `database system is ready to accept connections`

#### Step 5: Access the Application
Once all services are running, open your browser and navigate to:
**http://localhost:3000**

### Login Credentials (Local):
- **Admin Login:**
  - Username: `admin`
  - Password: `admin123`

### Stopping the Application
To stop all containers:
```bash
docker-compose down
```

To stop and remove all data:
```bash
docker-compose down -v
```

---

## Application Features

### Admin Dashboard
- Course Management (Add/Edit/Delete courses)
- Student Management (Add/Edit/Delete students)
- Grade Entry and Management
- Student Enrollment in Courses

### Student Portal
- Check grades and transcripts
- Generate & Print Student Transcript

---

## Troubleshooting

### Common Issues and Solutions

1. **Port Already in Use Error**
   ```bash
   # Change ports in docker-compose.yml if needed
   # Default ports: 3000 (frontend), 8080 (backend), 5432 (database)
   ```

2. **Database Connection Issues**
   ```bash
   # Ensure PostgreSQL container is healthy before backend starts
   docker-compose logs db
   ```

3. **Frontend Not Loading**
   ```bash
   # Check if all services are running
   docker-compose ps
   ```

4. **API Calls Failing**
   ```bash
   # Verify backend is accessible
   curl http://localhost:8080/api/courses
   ```

### Rebuild After Code Changes
```bash
docker-compose down
docker-compose up --build
```

---

## System Architecture

- **Frontend:** React.js with Bootstrap UI
- **Backend:** Spring Boot REST API
- **Database:** PostgreSQL
- **Containerization:** Docker & Docker Compose
- **Deployment:** Render.com (Production)

---

The live version at [https://course-management-system-fef1.onrender.com](https://course-management-system-fef1.onrender.com) is always available as an alternative to local deployment.
