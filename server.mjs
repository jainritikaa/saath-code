import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { executeCode } from './codeExecuter.js'; // Ensure this path is correct

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Update this to your client's origin if necessary
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('code_update', (file) => {
    console.log(`Code update received for file: ${file.name}`);
    console.log(`Code content: ${file.code}`);
    console.log(`Language: ${file.language}`);
  });

  socket.on('run_code', async (data) => {
    console.log('Run code request received');
    console.log('Received data:', data);
    
    const { code, language } = data;
    
    if (typeof code !== 'string' || typeof language !== 'string') {
      const errorMessage = 'Invalid data received. Ensure both code and language are strings.';
      console.error(errorMessage);
      socket.emit('code_result', `Error: ${errorMessage}`);
      return;
    }
    
    console.log(`Code to execute: ${code}`);
    console.log(`Language: ${language}`);
    
    try {
      const result = await executeCode(code, language); // Execute code based on the language
      console.log('Code execution result:', result);
      socket.emit('code_result', result); // Send back the result
    } catch (error) {
      console.error('Code execution error:', error);
      socket.emit('code_result', `Error: ${error.message}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
