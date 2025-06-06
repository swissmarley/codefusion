import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CodePreview from "./CodePreview";
import { Sun, Moon } from 'lucide-react';
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [enhancementPrompt, setEnhancementPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [useStreaming, setUseStreaming] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Utility function to extract code from triple backticks if needed
  const parseCodeOutput = (text) => {
    const codeBlockRegex = /```([\s\S]*?)```/;
    const match = text.match(codeBlockRegex);
    if (match && match[1]) {
      return match[1].trim();
    } else {
      return text.trim();
    }
  };

  // New download function to save generated code as HTML file
  const handleDownloadCode = () => {
    const blob = new Blob([generatedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-code.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --------------------------------------------------------------------------------
  // 1) Handle the initial code generation
  // --------------------------------------------------------------------------------
  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt first!");
      return;
    }
    setGeneratedCode("");
    setIsLoading(true);

    if (useStreaming) {
      // --- STREAMING approach ---
      try {
        const response = await fetch("http://localhost:5004/generate-code-stream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }), // direct user instructions
        });

        if (!response.ok) {
          setIsLoading(false);
          setGeneratedCode("Error generating code. Check console for details.");
          console.error("HTTP error", response.status, response.statusText);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let done = false;
        let codeAccumulator = "";

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          if (doneReading) {
            done = true;
          } else {
            const chunk = decoder.decode(value, { stream: true });
            // SSE events come in as lines prefixed with "data: "
            const lines = chunk.split("\n");
            for (let line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const jsonText = line.substring(6); // remove "data: "
                  const token = JSON.parse(jsonText);
                  codeAccumulator += token;
                  setGeneratedCode(codeAccumulator);
                } catch (err) {
                  console.error("JSON parse error on line:", line, err);
                }
              }
            }
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error streaming code:", error);
        setIsLoading(false);
        setGeneratedCode("Error generating code. Check console for details.");
      }
    } else {
      // --- NON-STREAMING approach (Axios) ---
      try {
        const response = await axios.post("http://localhost:5004/generate-code", {
          prompt,
        });
        const raw = response.data.generated_code || "";
        setGeneratedCode(parseCodeOutput(raw));
      } catch (error) {
        console.error("Error generating code:", error);
        setGeneratedCode("Error generating code. Check console for details.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // --------------------------------------------------------------------------------
  // 2) Handle subsequent enhancements / modifications to the already generated code
  // --------------------------------------------------------------------------------
  const handleEnhanceCode = async () => {
    if (!enhancementPrompt.trim()) {
      alert("Please enter enhancement instructions!");
      return;
    }
    setIsLoading(true);

    const combinedPrompt = `
      The current code is:
      \`\`\`
      ${generatedCode}
      \`\`\`

      The user wants to enhance or modify it with the following instructions:
      "${enhancementPrompt}"

      Please return the updated, complete code.
    `;

    setGeneratedCode(""); // Clear out while we wait for new code

    if (useStreaming) {
      try {
        const response = await fetch("http://localhost:5004/generate-code-stream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: combinedPrompt }),
        });

        if (!response.ok) {
          setIsLoading(false);
          setGeneratedCode("Error generating code. Check console for details.");
          console.error("HTTP error", response.status, response.statusText);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let done = false;
        let codeAccumulator = "";

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          if (doneReading) {
            done = true;
          } else {
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");
            for (let line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const jsonText = line.substring(6);
                  const token = JSON.parse(jsonText);
                  codeAccumulator += token;
                  setGeneratedCode(codeAccumulator);
                } catch (err) {
                  console.error("JSON parse error on line:", line, err);
                }
              }
            }
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error streaming code:", error);
        setIsLoading(false);
        setGeneratedCode("Error generating code. Check console for details.");
      }
    } else {
      try {
        const response = await axios.post("http://localhost:5004/generate-code", {
          prompt: combinedPrompt,
        });
        const raw = response.data.generated_code || "";
        setGeneratedCode(parseCodeOutput(raw));
      } catch (error) {
        console.error("Error generating code:", error);
        setGeneratedCode("Error generating code. Check console for details.");
      } finally {
        setIsLoading(false);
      }
    }

    setEnhancementPrompt("");
  };

  return (
    <div className="container">
      <img src="/logo.png" alt="Logo" className="logo"/>
      <h1 className="title">AI CodeFusion</h1>
      <button 
          onClick={toggleTheme} 
          className="theme-toggle"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

      {/* 1) Initial Prompt Section */}
      <div className="inputSection">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          className="textarea"
          placeholder="Describe the app you want to build..."
        />

        <div style={{ marginTop: "1rem" }}>
          <label style={{ marginRight: "1rem" }}>
            <input
              type="checkbox"
              checked={useStreaming}
              onChange={() => setUseStreaming(!useStreaming)}
            />
            Stream code
          </label>

          <button 
            onClick={handleGenerateCode} 
            className="button" 
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Code"}
          </button>
        </div>
      </div>

      {/* 2) Enhancement Section */}
      {generatedCode && (
        <div className="enhancementSection">
          <h3>Refine / Enhance Your Code</h3>
          <p>You can provide more instructions to modify or extend the current code:</p>
          <textarea
            value={enhancementPrompt}
            onChange={(e) => setEnhancementPrompt(e.target.value)}
            rows={3}
            className="textarea"
            placeholder="e.g., Add a new section, fix a bug, or adjust the design..."
          />
          <button
            onClick={handleEnhanceCode}
            className="button"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Enhance / Modify Code"}
          </button>
        </div>
      )}

      {/* 3) Two-column Layout: Code + Preview */}
      <div className="contentSection">
        <div className="codeContainer">
          <h2>Generated Code</h2>
          <div className="copyWrapper">
            {/* The Copy Button */}
            <button
              className="copyButton"
              onClick={() => {
                navigator.clipboard.writeText(generatedCode);
                alert("Code copied to clipboard!");
              }}
            >
              📋
            </button>
            {/* New Download Button */}
            <button className="downloadButton" onClick={handleDownloadCode}>
              📥
            </button>
          </div>
          <pre className="codeBox">{generatedCode}</pre>
        </div>
        <div className="previewContainer">
          <CodePreview code={generatedCode} />
        </div>
      </div>
    </div>
  );
}

export default App;