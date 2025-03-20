# News API with Authors

This API endpoint aggregates news articles from an external news service, associates each article with a randomly generated author, and stores author data in a database using Prisma. The result is a paginated list of news articles along with their corresponding author information.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Endpoint Details](#endpoint-details)
- [Error Handling](#error-handling)
- [Technology Stack](#technology-stack)

## Overview

The API:
- Fetches top headlines from a news provider (via the News API).
- Implements pagination by slicing the articles array based on the requested page and limit.
- Retrieves a list of random users from the Random User API to simulate author data.
- Uses Prisma to either update or create an author entry (via an "upsert" operation) based on the author's email.
- Returns a JSON response that includes the current page, number of articles per page, and an array of articles each containing news and associated author details.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/infinity-9427/news-api-pagination.git
   cd news-api-pagination
