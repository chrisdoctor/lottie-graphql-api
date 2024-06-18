# Lottie Animatio Management System API with Node.js, TypeScript and GraphQL

## Description

This is a Node.js API built using TypeScript and GraphQL. It provides functionality to write data to a MongoDB database and to search for data within the database. The search functionality allows users to find items based on a keyword, which can match substrings within the `tags` field or the `description` field of the items.

## Features

- **Add Item**: Write data to MongoDB.
- **Search Items**: Search for data in MongoDB using a keyword.

## Prerequisites

- Node.js
- Docker
- MongoDB

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/chrisdoctor/lottie-graphql-api
   cd lottie-graphql-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start MongoDB using Docker Compose from a separate repository:

   ```bash
   git clone https://github.com/chrisdoctor/lottie-mongo-container
   cd lottie-mongo-container
   docker-compose up -d
   ```

4. Start the application:

   ```bash
   npm run start
   ```

## Usage

### Adding an Item

To add an item to the database, send a GraphQL mutation request:

**Mutation:**

```graphql
mutation AddItem($input: AddItemInput!) {
  addItem(input: $input) {
    id
    description
    author
    tags
    dateUploaded
    lottieFile {
      filename
      contents
    }
  }
}
```

### Searching for Items

To search for items in the database, send a GraphQL query request:

**Query:**

```graphql
query SearchItems($keyword: String!) {
  searchItems(keyword: $keyword) {
    id
    description
    author
    tags
    dateUploaded
    lottieFile {
      filename
      contents
    }
  }
}
```

## GraphQL Schema

### Item

```graphql
type Item {
  id: ID!
  description: String!
  author: String!
  tags: [String!]!
  dateUploaded: String!
  lottieFile: LottieFile!
}
```

### LottieFile

```graphql
type LottieFile {
  filename: String!
  contents: String!
}
```
