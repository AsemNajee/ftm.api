# Routers

## Routes for categories
Main route is `/categories` 
|Method|Route| description|data|
|---|---|---|---|
|GET|/ | get all categories with majors|`[titel, _id, majros: [title, _id]]`
|POST|/| create new category `admin`| `title`|

## Routes for majors
Main route is `/majors` 
|Method|Route| description|data|
|---|---|---|---|
|GET|/ | get all majors| `[{title}]`|
|POST|/| create new major `admin`| `{title}`|

## Routes for teachers
Main route is `/teachers` 
|Method|Route| description|data|
|---|---|---|---|
|GET|/ | get all teachers|`[{title, role}]`|
|POST|/| create new teacher `admin`| `{title, role}`|

## Routes for info
Main route is `/info` 
|Method|Route| description|data|
|---|---|---|---|
|GET|/ | get all info| `{seen, message}`
|POST|/seen| update the seen of the site (institute) `admin`| `{seen}`|
|POST|/message| update the message of the site (institute) `admin`| `{message}`|

## Router for login
for entering dashboard only using jwt bearer
|Method|Route|description|data|
|---|---|---|---|
|POST|/login|login to dashboard| `{username, password}`|
