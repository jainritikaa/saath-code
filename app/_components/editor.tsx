import React, { useEffect, useRef, useState } from 'react';
import Editor, { OnChange, OnMount, loader } from '@monaco-editor/react';
import io from 'socket.io-client';
import 'tailwindcss/tailwind.css';
import Terminal from './terminal'; // Ensure you have this component

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
  const activeFile = files[activeFileIndex];

  useEffect(() => {
    // Handle incoming code updates from server
    socket.on('code_update', (updatedFile: File) => {
      setFiles((prevFiles) =>
        prevFiles.map((file, index) =>
          index === activeFileIndex ? updatedFile : file
        )
      );
    });

    // Handle code execution result from server
    socket.on('code_result', (result: string) => {
      setTerminalOutput(result);
    });

    return () => {
      socket.off('code_update');
      socket.off('code_result');
    };
  }, [activeFileIndex]);

  const handleEditorChange: OnChange = (value) => {
    const updatedFile = { ...activeFile, code: value || '' };
    setFiles((prevFiles) =>
      prevFiles.map((file, index) =>
        index === activeFileIndex ? updatedFile : file
      )
    );
    socket.emit('code_update', updatedFile);
  };

  const handleEditorDidMount: OnMount = (editor) => {
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
    const newFile: File = {
      name: `file${files.length + 1}.js`,
      language: 'javascript',
      code: '// Start coding...',
    };
    setFiles([...files, newFile]);
    setActiveFileIndex(files.length);
  };

  const removeFile = (index: number) => {
    if (files.length > 1) {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      setActiveFileIndex(index === activeFileIndex ? 0 : activeFileIndex > index ? activeFileIndex - 1 : activeFileIndex);
    }
  };

  const runCode = () => {
    const { code, language } = activeFile;
    if (code && language) {
      socket.emit('run_code', { code, language });
    } else {
      console.error('Invalid data: Ensure both code and language are strings.');
    }
  };

  const handleFileNameChange = (index: number, newName: string) => {
    const newLanguage = getFileLanguage(newName);
    const updatedFiles = files.map((file, i) =>
      i === index ? { ...file, name: newName, language: newLanguage } : file
    );
    setFiles(updatedFiles);
  };

  return (
    <div className="w-full max-w-4xl bg-transparent rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <button
          className="run-button"
          onClick={runCode}
          title="Run Code"
        >
          &#9654;
        </button>
      </div>
      <div className="flex">
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
                key={index}
                className={`px-1 w-20 border ${index === activeFileIndex ? 'border-blue-500' : 'border-gray-300'} rounded`}
                onClick={() => setActiveFileIndex(index)}
                onDoubleClick={() => setEditingFileIndex(index)} // Enable editing on double-click
              >
                {file.name}
              </button>
            )}
            <button
              className="ml-1 text-red-500"
              onClick={() => removeFile(index)}
              disabled={files.length === 1}
              title="Remove File"
            >
              &#x2715;
            </button>
          </div>
        ))}
        <button onClick={addNewFile} title="Add New File">
          &#43;
        </button>
      </div>
      <Editor
        height="70vh"
        defaultLanguage={activeFile.language}
        defaultValue={activeFile.code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="custom-light"
      />
      <Terminal output={terminalOutput} />
    </div>
  );
};

export default CodeEditor;
