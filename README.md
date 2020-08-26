
- [Witty Name](#witty-name)
  - [Introduction](#introduction)
    - [Start App](#start-app)
      - [Pre Reqs](#pre-reqs)
    - [Tech Stack](#tech-stack)
  - [To Do List](#to-do-list)
    - [Server](#server)
    - [Client](#client)

# Witty Name

## Introduction

### Start App
#### Pre Reqs
Yarn 1.22 installed. I make no guarantees about running this code with npm. 

```
git clone ...
cd witty-name-bp
yarn set version berry
yarn start
```

### Tech Stack
- Client
  - React, ReactDOM, React-Bootstrap
  - Typescript
- API Server
  - Fastify
  - Typescript

## To Do List

 - [X] Start a Git repo
 - [X] Start a Git repo for the Fastify+TS boilerplate

### Server

 - [X] Write a simple histogram
 - [X] Add the histogram logging as a Fastify Plugin
 - [ ] See if typescript compiler supports import aliases
 - [ ] Start on adding database
   - [ ] Decide on DB ORM (prisma? raw pg?)

### Client

 - [ ] Add an index.html file
 - [ ] Start on frontend code