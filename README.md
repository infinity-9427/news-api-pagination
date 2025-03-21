# News API with Authors

This API endpoint aggregates news articles from an external news service, associates each article with a randomly generated author, and stores author data in a database using Prisma. The result is a paginated list of news articles along with their corresponding author information.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Endpoint Details](#endpoint-details)

## Overview

The API:

-   Fetches top headlines from a news provider (via the News API).
-   Implements pagination by slicing the articles array based on the requested page and limit.
-   Retrieves a list of random users from the Random User API to simulate author data.
-   Uses Prisma to either update or create an author entry (via an "upsert" operation) based on the author's email.
-   Returns a JSON response that includes the current page, number of articles per page, and an array of articles each containing news and associated author details.

## Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/infinity-9427/news-api-pagination.git](https://github.com/infinity-9427/news-api-pagination.git)
    cd news-api-pagination
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up your database and Prisma:**

    ```bash
    npx prisma migrate dev --name init
    ```

4.  **Create a `.env` file at the root of your project and add the required environment variables:**

    ```bash
    NEWS_API_KEY=your_news_api_key_here
    DATABASE_URL=your_database_connection_string_here
    ```

5.  **Usage:**

    ```bash
    npm start
    ```

    Access the API at:

    -   `http://localhost:5000/api/v1/news`
    -   `http://localhost:5000/api/v1/news/?page=2`

## Endpoint Details

**GET /api/v1/news**

**Description:** Retrieves a paginated list of news articles with associated author information.

**Query Parameters:**

-   `page` (optional): The page number to retrieve. Defaults to 1 if not provided. The number of articles per page is fixed to 10.

**Example Request:**

```http
GET http://localhost:5000/api/v1/news/?page=2
```