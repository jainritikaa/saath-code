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
      default:
        return reject(new Error(`Unsupported language: ${language}`));
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      if (stderr) {
        return reject(new Error(stderr));
      }
      resolve(stdout);
    });
  });
};
