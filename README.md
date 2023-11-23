# Crowley's News API

## Overview

Crowley's News is a dynamic web application designed to deliver news articles with a focus on community interaction. Users can explore a variety of articles, each categorised under different topics ensuring a diverse and engaging reading experience.

Key Features:

* **Topic Navigation**: Easily navigate through articles based on topics, from technology to lifestyle.
* **User Authentication**: Ensure users are in the database in order to contribute through comments and votes.
* **Community Interaction**: Engage with other users through comments and voting, fostering a sense of community around shared interests.

### Live Demo https://crowleysnewsapi.onrender.com/api/

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your machine:

* [Node.js](https://nodejs.org/en) (Minimum version: 14.0.0)
* [PostgreSQL](https://www.postgresql.org/) (Minimum version: 12.0)

## Installing

Clone the repository to your local machine:

```
git clone https://github.com/WhitworthJoe/crowleys-news.git
```
Navigate to the project directory:
```
cd crowleys-news
```
Install dependencies
```
npm install dotenv;
npm install express;
npm install husky;
npm install jest;
npm install jest-sorted;
npm install jest-extended;
npm install mysql;
npm install nodejs;
npm install pg-format;
npm install pg;
npm install supertest;
```

## Environment

You will need to create the following '.env' files in the project root, with their respective variables:

.env.development file:
```
PGDATABASE=nc_news
```

.env.test file:
```
PGDATABASE=nc_news_test
```

.env.production
```
DATABASE_URL=your_database_URL
```

## Running Tests
Run tests using the following command:
```
npm run test
```