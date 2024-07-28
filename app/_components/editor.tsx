import React, { useEffect, useRef, useState } from 'react';
import Editor, { OnChange, OnMount, loader } from '@monaco-editor/react';
import io from 'socket.io-client';
import 'tailwindcss/tailwind.css';
import Terminal from './terminal'; // Ensure Terminal component is correctly imported

// Initialize socket connection
const socket = io('http://localhost:4000'); // Ensure this matches your server URL

interface File {
  name: string;
  language: string;
  code: string;
}

const languageExtensions: { [key: string]: string } = {
  javascript: 'js',
  typescript: 'ts',
  python: 'py',
  java: 'java',
  cpp: 'cpp',
  html: 'html',
  css: 'css',
};

const getFileLanguage = (fileName: string): string => {
  const extension = fileName.split('.').pop();
  const language = Object.keys(languageExtensions).find(
    (key) => languageExtensions[key] === extension
  );
  return language || 'plaintext';
};

const CodeEditor: React.FC = () => {
  const editorRef = useRef<any>(null);
  const [files, setFiles] = useState<File[]>([
    { name: 'file1.js', language: 'javascript', code: '// Start coding in JavaScript...' },
  ]);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [editingFileIndex, setEditingFileIndex] = useState<number | null>(null); // State to keep track of the file being edited
  const [terminalOutput, setTerminalOutput] = useState<string>(''); // State to hold terminal output
  const [readMeContent, setReadMeContent] = useState<string>(''); // State to hold ReadMe content
  const activeFile = files[activeFileIndex];

  useEffect(() => {
    console.log('Setting up socket event listeners');
    // Handle incoming code updates from server
    socket.on('code_update', (updatedFile: File) => {
      console.log('Received code update from server:', updatedFile);
      setFiles((prevFiles) =>
        prevFiles.map((file, index) =>
          index === activeFileIndex ? updatedFile : file
        )
      );
    });

    // Handle code execution result from server
    socket.on('code_result', (result: string) => {
      console.log('Received code execution result from server:', result);
      setTerminalOutput(result);
    });

    return () => {
      console.log('Removing socket event listeners');
      socket.off('code_update');
      socket.off('code_result');
    };
  }, [activeFileIndex]);

  const handleEditorChange: OnChange = (value) => {
    console.log('Editor content changed');
    const updatedFile = { ...activeFile, code: value || '' };
    setFiles((prevFiles) =>
      prevFiles.map((file, index) =>
        index === activeFileIndex ? updatedFile : file
      )
    );
    socket.emit('code_update', updatedFile);
  };

  const handleEditorDidMount: OnMount = (editor) => {
    console.log('Editor mounted');
    editorRef.current = editor;
    loader.init().then(monaco => {
      monaco.editor.defineTheme('custom-light', {
        base: 'vs', // can also be 'vs-dark' or 'hc-black'
        inherit: true, // inherit the base theme
        rules: [],
        colors: {
          'editorLineNumber.foreground': '#CCCCCC', // light line numbers
        }
      });
    });
  };

  const addNewFile = () => {
    console.log('Adding a new file');
    const newFile: File = {
      name: `file${files.length + 1}.js`,
      language: 'javascript',
      code: '// Start coding...',
    };
    setFiles([...files, newFile]);
    setActiveFileIndex(files.length);
  };

  const removeFile = (index: number) => {
    console.log('Removing file at index:', index);
    if (files.length > 1) {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      setActiveFileIndex(index === activeFileIndex ? 0 : activeFileIndex > index ? activeFileIndex - 1 : activeFileIndex);
    }
  };

  const runCode = () => {
    console.log('Running code for file:', activeFile);
    const { code, language } = activeFile;
    if (code && language) {
      socket.emit('run_code', { code, language });
    } else {
      console.error('Invalid data: Ensure both code and language are strings.');
    }
  };

  const handleFileNameChange = (index: number, newName: string) => {
    console.log('Changing file name at index:', index, 'to:', newName);
    const newLanguage = getFileLanguage(newName);
    const updatedFiles = files.map((file, i) =>
      i === index ? { ...file, name: newName, language: newLanguage } : file
    );
    setFiles(updatedFiles);
  };

  const generateReadMe = async () => {
    console.log('Generating ReadMe for file:', activeFile);

    try {
      console.log('Active file code:', activeFile.code); // Debug: Log the active file code

      const response = await fetch('http://localhost:3000/api/auth/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: activeFile.code,
        }),
      });

      const data = await response.json();

      console.log('ReadMe generated successfully:', data);
      setReadMeContent(data.readme); // Ensure you're accessing the correct property
    } catch (error) {
      console.error('Failed to generate ReadMe:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-transparent rounded-lg">
      <div className="flex ">
        {files.map((file, index) => (
          <div key={index} className="flex items-center">
            {editingFileIndex === index ? (
              <input
                type="text"
                value={file.name}
                onBlur={() => setEditingFileIndex(null)} // End editing when input loses focus
                onChange={(e) => handleFileNameChange(index, e.target.value)}
                className={`px-1 w-20 border ${index === activeFileIndex ? 'border-blue-500' : 'border-gray-300'} rounded`}
                autoFocus
              />
            ) : (
              <button
                className={`text-left inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow hover:bg-primary/90 px-4 py-1 rounded-sm ${index === activeFileIndex ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-blue-600'}`}
                onClick={() => {
                  setActiveFileIndex(index);
                  setEditingFileIndex(index); // Start editing on button click
                }}
              >
                {file.name}
              </button>
            )}
            {index === activeFileIndex && (
              <button
                className="text-left inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow hover:bg-primary/90 px-2 py-1 rounded-sm bg-gray-300 text-red-600 hover:bg-red-700"
                onClick={() => removeFile(index)}
              >
                x
              </button>
            )}
          </div>
        ))}
        <button
          className="text-left inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow hover:bg-primary/90 px-2 py-1 rounded-sm bg-gray-300 text-white hover:bg-green-700"
          onClick={addNewFile}
        >
          +
        </button>
      </div>
      <div className="editor-container">
        <Editor
          height="50vh"
          defaultLanguage="javascript"
          language={activeFile.language}
          value={activeFile.code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            theme: 'custom-light',
          }}
        />
      </div>
      <button
        className="text-left inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow hover:bg-primary/90 px-2 py-1 rounded-sm bg-gray-300 text-white hover:bg-green-700"
        onClick={runCode}
      >
        Run Code
      </button>
      <button
        className="text-left inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow hover:bg-primary/90 px-2 py-1 rounded-sm bg-gray-300 text-white hover:bg-green-700"
        onClick={generateReadMe}
      >
        Generate ReadMe
      </button>
      <Terminal output={terminalOutput} readMeContent={readMeContent} />
    </div>
  );
};

export default CodeEditor;
