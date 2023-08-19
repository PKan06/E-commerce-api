
# The Complete E-Commerce Web API


# Introduction
This repository contains NodeJs backend routes for the E-Commerce Web API


# Getting started

### Install

```
npm install
```

### Start API

```
npm start
```

# Routes

### Products

```
GET      : /e-shopping/products
GET      : /e-shopping/products/:id
POST     : /e-shopping/products (only admin allowed)
PUT      : /e-shopping/products/:id (only admin allowed)
DELETE   : /e-shopping/products/:id (only admin allowed)
PUT gallery-images : /e-shopping/products/gallery-images/:id (only admin allowed)
GET featured products: /e-shopping/products/get/featured/:count (only admin allowed)
GET products count: /e-shopping/products/get/count (only admin allowed)
```

### Orders

```
coming soon
```

### Users

```
GET     : /e-shopping/users (only admin allowed)
GET     : /e-shopping/users/:id  (only admin allowed)
POST    : /e-shopping/users (only admin allowed)
PUT     : /e-shopping/users/:id (only admin allowed)
DELETE  : /e-shopping/users/:id (only admin allowed)
GET users count: /e-shopping/users/get/count (only admin allowed)
```

#### Register new user

```
POST     /e-shopping/users/register
```

#### Login user

To login the user and get the auth token (required to identify the allowed admin ) you can use:

```
POST     /e-shopping/users/login
```



## Detail description 


```
coming soon
```
