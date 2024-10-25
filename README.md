# Cluster Manager Application

## Overview
This repository contains two projects: a backend application and a frontend application.

- **Backend:** Located in the `/cluster-manager-backend` folder.
- **Frontend:** Located in the `/next-project` folder.

## Application Functionality
The Cluster Manager Application is designed to manage and monitor clusters effectively. It provides a user-friendly interface for users to interact with cluster data, including metrics and snapshot policies. The application allows users to:

- Retrieve details of all clusters.
- Access performance metrics for specific clusters, including IOPS and throughput.
- View and update snapshot policies for clusters, ensuring data integrity and backup management.

## Installation Process

### Backend

1. Navigate to the backend directory:
   ```bash
   cd cluster-manager-backend
   ```

2. Install the AdonisJS CLI globally:
   ```bash
   npm install -g @adonisjs/cli
   ```

3. Install node modules:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   adonis serve --dev
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd next-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## API Endpoints

### Backend API

1. **Get All Clusters**
   - **Method:** `GET`
   - **Endpoint:** `/api/clusters`
   - **Description:** Retrieve the details of all clusters.

2. **Get Cluster Metrics**
   - **Method:** `GET`
   - **Endpoint:** `/api/clusters/metrics/:id`
   - **Description:** Fetches IOPS (Input/Output Operations per Second) and throughput data for a specific cluster by its ID.

3. **Get Snapshot Policy**
   - **Method:** `GET`
   - **Endpoint:** `/api/clusters/snapshot-policy/:id`
   - **Description:** Retrieves the snapshot policy for a specific cluster by its ID.

4. **Update Snapshot Policy**
   - **Method:** `POST`
   - **Endpoint:** `/api/clusters/snapshot-policy/:id`
   - **Description:** Updates the snapshot policy for a specific cluster identified by the `id`.
