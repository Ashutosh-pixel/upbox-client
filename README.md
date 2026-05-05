# ☁️ UpBox – Frontend (Cloud Storage Client)

[![React](https://img.shields.io/badge/React-blue)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-white)](https://nextjs.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.0-purple)](https://redux-toolkit.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

Frontend client for UpBox — a production-grade Google Drive clone with chunk-based uploads, queue management, and real-time updates.

🔗 Live Project: https://www.upboxdrive.online/

## 🚀 Demo Features

- 📁 Nested folder navigation
- 📤 Single + bulk file uploads
- ⚡ Parallel chunk uploads
- 📊 Real-time upload progress (SSE)
- 🔍 Global search with autocomplete
- 🔄 Resume interrupted uploads

# 🏗️ System Architecture

```
                ┌──────────────────────┐
                │     React Client     │
                │  (Next.js / React)   │
                └─────────┬────────────┘
                          │
        ┌─────────────────▼─────────────────┐
        │        Upload Manager (JS)        │
        │  Queue + Chunk + Retry System     │
        └─────────────────┬─────────────────┘
                          │
        ┌─────────────────▼─────────────────┐
        │         Backend API (Node)        │
        │  Express + MongoDB + SSE Server   │
        └───────┬───────────────┬──────────┘
                │               │
      ┌─────────▼───┐     ┌────▼─────────┐
      │ MongoDB     │     │ AWS S3       │
      │ Atlas Search │     │ Storage      │
      └──────────────┘     └──────────────┘
```

# ⚙️ Core Features & Flow

## 📁 1. File Upload System (Multipart S3)

### Flow:

```
Client selects file
        ↓
UploadManager splits into chunks
        ↓
Backend creates upload session (uploadId)
        ↓
Client requests pre-signed URLs per chunk
        ↓
Chunks uploaded directly to S3
        ↓
Backend tracks uploadParts
        ↓
Complete multipart upload
```

### Key Features:

* Chunk-based upload (5MB default)
* Parallel upload support
* Retry mechanism
* Progress tracking per file

## 🔄 2. Upload Queue System (Frontend)

### Flow:

```
User selects multiple files
        ↓
Files added to UploadQueue
        ↓
Max 3 uploads run in parallel
        ↓
Remaining files wait in queue
        ↓
On completion → next file starts automatically
```

### Features:

* Global UploadManager (singleton)
* FIFO queue system
* Pause / Resume support
* Independent upload tasks

## 📡 3. Real-Time Updates (SSE)

### Flow:

```
Backend triggers event
        ↓
SSE connection pushes event
        ↓
Frontend Redux updates state
        ↓
UI updates instantly (no refresh)
```

### Events:

* file_uploaded
* folder_created
* folder_uploaded
* file_renamed
* update_storage

## 📂 4. Folder System

* Nested folder structure
* Parent-child relationship via `parentID`
* Path tracking (`pathIds`, `pathNames`)

## 🔍 5. Global Search (Atlas Search)

### Features:

* Full-text search on files & folders
* Autocomplete search
* User-isolated search (multi-tenant safe)
* Fast indexed queries

### Flow:

```
User types query
        ↓
MongoDB Atlas Search
        ↓
Filters by userID
        ↓
Returns ranked results
```

# 🧠 Design Decisions

## 1. UploadManager (Frontend Service)

* Keeps upload logic outside React
* Prevents re-render cancellation issues
* Handles queue, retry, concurrency


## 2. Redux (UI State Layer)

Used only for:

* Progress tracking
* Upload status
* UI updates

## 3. SSE instead of WebSockets

* Lightweight real-time updates
* Perfect for file/folder events
* No persistent bidirectional connection needed

## 4. S3 Multipart Upload

* Efficient large file handling
* Resume support via uploadId + parts
* Direct-to-S3 upload (`backend bypass for performance` and `t3micro sever limitation`)

## 5. MongoDB Atlas Search

* Fast search indexing
* Autocomplete support
* User-level filtering for security

# 🧱 Tech Stack

### Frontend:

* React / Next.js
* Redux Toolkit
* Axios

### Backend:

* Node.js
* Express.js
* MongoDB + Atlas Search
* AWS S3 SDK

### Infrastructure:

* AWS S3 (Storage)
* SSE (Real-time updates)

# ⚡ Performance Optimizations

* Chunked uploads (reduces memory usage)
* Parallel upload queue (max concurrency control)
* Indexed search (Atlas Search)
* SSE for low-latency updates
* Direct S3 uploads (no backend bottleneck)

# 🔐 Security

* User-based data isolation (`userID filter in search`)
* Pre-signed S3 URLs
* Backend validation for upload sessions

# 📈 Future Improvements

* Versioning system for files
* Folder operations
