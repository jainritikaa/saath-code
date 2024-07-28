import { exec } from 'child_process';

export const executeCode = (code, language) => {
  return new Promise((resolve, reject) => {
    let command;

    switch (language) {
      case 'javascript':
        command = `node -e "${code.replace(/"/g, '\\"')}"`;
        break;
      case 'python':
        command = `python -c "${code.replace(/"/g, '\\"')}"`;
        break;
      case 'java':
        // Java code execution (assuming you have a .java file)
        // This requires javac and java to be available in PATH
        // Save code to a temporary file, compile, and run it
        command = `echo "${code.replace(/"/g, '\\"')}" > Temp.java && javac Temp.java && java Temp`;
        break;
      case 'cpp':
        // C++ code execution (assuming you have a .cpp file)
        // This requires g++ to be available in PATH
        // Save code to a temporary file, compile, and run it
        command = `echo "${code.replace(/"/g, '\\"')}" > temp.cpp && g++ temp.cpp -o temp && ./temp`;
        break;
      // Add more languages as needed
      default:
        return reject(new Error('Unsupported language'));
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      if (stderr) {
        return resolve(stderr);
      }
      return resolve(stdout);
    });
  });
};
