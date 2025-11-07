import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { SlideContent, Output, CodeCell } from "./types";

interface SlideProps {
  cell: SlideContent;
}

const formatBase64 = (source: string | string[]): string => {
  if (Array.isArray(source)) {
    return source.join('');
  }
  return source;
}

const renderOutput = (output: Output, index: number) => {
  switch (output.output_type) {
    case "stream":
      return (
        <pre key={index} className="p-2 text-sm output-stream">
          {output.text?.join("")}
        </pre>
      );
    case "execute_result":
    case "display_data":
      // Prioritize image and rich media types over plain text
      if (output.data?.["image/png"]) {
        return (
          <img
            key={index}
            src={`data:image/png;base64,${formatBase64(output.data["image/png"])}`}
            alt="output"
            className="max-w-full h-auto"
          />
        );
      }
      if (output.data?.["image/jpeg"]) {
        const b64 = formatBase64(output.data["image/jpeg"]);
        return (
          <img
            key={index}
            src={`data:image/jpeg;base64,${b64}`}
            alt="output" 
            className="max-w-full h-auto"
          />
        );
      }
      if (output.data?.["image/svg+xml"]) {
        const svgContent = formatBase64(output.data["image/svg+xml"]);
        return (
          <div
            key={index}
            className="max-w-full h-auto"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        );
      }
      if (output.data?.["text/html"]) {
        return (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: output.data["text/html"].join("") }}
          />
        );
      }
      if (output.data?.["text/plain"]) {
        return (
          <pre key={index} className="p-2 text-sm output-text">
            {output.data["text/plain"].join("")}
          </pre>
        );
      }
      return null;
    case "error":
      return (
        <pre key={index} className="p-2 text-sm output-error">
          {output.traceback?.join("\n")}
        </pre>
      );
    default:
      return null;
  }
};

export default function Slide({ cell }: SlideProps) {
  const source = cell.source.join("");

  return (
    <div className="p-8 slide-container w-full h-full overflow-y-auto">
      {cell.cell_type === "markdown" ? (
        <div className="markdown-slide"><ReactMarkdown>{source}</ReactMarkdown></div>
      ) : (
        <div className="h-full flex flex-col justify-center">
          {/* Conditionally render the code block based on renderSource flag */}
          {(cell as CodeCell).renderSource && (
            <SyntaxHighlighter language="python" style={oneDark}>
              {source}
            </SyntaxHighlighter>
          )}
          <div className="mt-4 space-y-2">
            {cell.outputs.map(renderOutput)}
          </div>
        </div>
      )}
    </div>
  );
}