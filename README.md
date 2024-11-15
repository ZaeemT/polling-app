
# Polling App

A polling app with real-time updates and anonymous voting. I utilized TypeScript and MERN stack to build this. Used JWT for user authentication, moreover kept a record of IP addresses of anonymous voters along with user ID of registered users to prevent them from casting multiple votes. For real-time updates and reflection on those updates I used Socket.IO

## Demo

https://github.com/user-attachments/assets/cd8cb8f2-c22c-4a9f-bd28-18c190628310

## Run Locally

Clone the project

```bash
  git clone https://github.com/ZaeemT/polling-app.git
```

Go to the project directory

```bash
  cd polling-app
```

Go to client-side of the project

```bash
  cd client
```

Install client-side dependencies

```bash
  npm install
```

Start the client-side

```bash
  npm run dev
```

Similarly staying in the project directory, open another terminal to go to server-side of the project.
```bash
  cd server
```

Install server-side dependencies

```bash
  npm install
```

Start the server-side

```bash
  npm run dev
```

Look at the .env.example in the server folder and create your own .env file, which is needed to run this project.
