# setup project 

### Create some directories like 
- Server
- Client

**Server**: server is backend directory that handle database intraction.

**Client** : client is a frontend directory for user interaction.




- Project Setup: 
    First of all create a server and client directory accordingly.
    So inside server dir we manage all the backend related task. Like microservices like chat, main and user.

So first of all we need to start one by one user microservices then chat microservices etc.


## 1. User Microservice: 
- setup project
    Create a user dir and then cd to user and then run:
    ```  
      npm init
    ```
- Make sure to install typescript globaly on your machin by runnning
    ``` 
    npm i -g typescript
    ```
- Now Run npx tsc -init to configure typescript in user
   ```
   npx tsc -init
   ```
   this will create a tsconfig.json file so in this file i have seted some path variable like "rootDir": "./src",  "outDir": "./dist", etc.
   thats it

and finally we have to install some packages that will needed by running these commands listed below.

``` 
npm i express dotenv mongoose
```

and then run
```
npm i -D @types/express @types/mongoose @types/dotenv nodemon concurrently
```


docker run -d --hostname rabbitmq-host --name rabbitmq-container -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin123 -p 5672:5672 -p 15672:15672 rabbitmq:3-management