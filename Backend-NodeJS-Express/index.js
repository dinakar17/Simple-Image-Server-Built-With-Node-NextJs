import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

// This is the port number on which the server will run.
const PORT = process.env.PORT || 5000;

// app.listen() is used to start the server and `const server` is used to store the server instance.
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message); 
  
    server.close(() => {
      process.exit(1);
    });
});

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
  
    server.close(() => {
      process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      console.log('💥 Process terminated!');
    });
});



