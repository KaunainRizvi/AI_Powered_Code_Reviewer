import { useState } from 'react';
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import './App.css';
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [code, setCode] = useState(`function sum() {\n  return 1 + 1;\n}`);
  const [review, setReview] = useState(``);

  const API_KEY = "AIzaSyDGkXo3jUP0yv6PAWd6kg_g0GtBhuTzBDo"; // your dummy public key

  async function reviewCode() {
    const genAI = new GoogleGenerativeAI(API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
      Review the following JavaScript code and give suggestions:

      \`\`\`javascript
      ${code}
      \`\`\`

      Focus on:
      - Code quality
      - Errors or bugs
      - Performance improvements
      - Best practices
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      setReview(text);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setReview("❌ Failed to get AI response. Check console for details.");
    }
  }

  return (
    <main>
      <div className="left">
        <div className="code">
          <Editor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 16,
              border: "1px solid #ddd",
              borderRadius: "5px",
              height: "100%",
              width: "100%",
            }}
          />
        </div>
        <div onClick={reviewCode} className="review">Review</div>
      </div>
      <div className="right">
        <Markdown rehypePlugins={[rehypeHighlight]}>
          {review}
        </Markdown>
      </div>
    </main>
  );
}

export default App;
