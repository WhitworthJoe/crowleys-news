# Crowley's News API

## Overview

Crowley's News is a web application that 

### Live Demo https://crowleysnewsapi.onrender.com/api/

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### prerequisites

Make sure you have the folling installed on your machine:

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

To use this repo you will need to run 'npm install' and create two .env files - '.env.test' and '.env.development' - within your project!
You can do this in your command line with 'touch .env.test' and 'touch .env.development'.

In your .env files make sure to add the relevent PGDATABASE, as per below:

.env.development file:
```
PGDATABASE=nc_news
```

.env.test file:
```
PGDATABASE=nc_news_test
```
