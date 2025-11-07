import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { SlideContent, Output, CodeCell } from "./types";

interface SlideProps {
  cell: SlideContent;
}

const formatBase64 = (source: string | string[]): string => {
  if (Array.isArray(source)) return source.join('');
  return source;
};

const renderOutput = (output: Output, index: number) => {
  switch (output.output_type) {
    case "stream":
      return (
        <pre key={index} className="p-2 text-sm output-stream whitespace-pre-wrap break-words">
          {output.text?.join("")}
        </pre>
      );
    case "execute_result":
    case "display_data":
      if (output.data?.["image/png"]) {
        return (
          <img
            key={index}
            src={`data:image/png;base64,${formatBase64(output.data["image/png"])}`}
            alt="output"
            className="max-w-full max-h-[70vh] object-contain mx-auto"
          />
        );
      }
      if (output.data?.["image/jpeg"]) {
        return (
          <img
            key={index}
            src={`data:image/jpeg;base64,${formatBase64(output.data["image/jpeg"])}`}
            alt="output"
            className="max-w-full max-h-[70vh] object-contain mx-auto"
          />
        );
      }
      if (output.data?.["image/svg+xml"]) {
        const svgContent = formatBase64(output.data["image/svg+xml"]);
        return (
          <div
            key={index}
            className="max-w-full max-h-[70vh] overflow-hidden flex justify-center"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        );
      }
      if (output.data?.["text/html"]) {
        return (
          <div
            key={index}
            className="max-w-full overflow-x-auto text-sm"
            dangerouslySetInnerHTML={{ __html: output.data["text/html"].join("") }}
          />
        );
      }
      if (output.data?.["text/plain"]) {
        return (
          <pre key={index} className="p-2 text-sm output-text whitespace-pre-wrap break-words">
            {output.data["text/plain"].join("")}
          </pre>
        );
      }
      return null;
    case "error":
      return (
        <pre key={index} className="p-2 text-sm text-red-400 whitespace-pre-wrap break-words">
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
    <div className="p-8 slide-container w-full h-full flex flex-col justify-center items-center overflow-hidden">
      {cell.cell_type === "markdown" ? (
        <div className="markdown-slide prose max-w-full overflow-hidden text-center">
          <ReactMarkdown>{source}</ReactMarkdown>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center overflow-hidden">
          {(cell as CodeCell).renderSource && (
            <div className="w-full flex justify-center"> {/* ✅ centers the code block */}
              <div className="max-h-[60vh] w-[70%] overflow-auto rounded-2xl shadow-inner bg-[#1e1e1e]">
                <SyntaxHighlighter
                  language="python"
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    padding: "1rem",
                    fontSize: "0.9rem",
                    maxHeight: "60vh",
                    overflowX: "auto",   // allow horizontal scrolling
                    overflowY: "auto",
                    whiteSpace: "pre",   // preserve width
                    wordBreak: "normal", // don't break long words
                  }}
                >
                  {source}
                </SyntaxHighlighter>
              </div>
            </div>
          )}
          <div className="mt-4 space-y-2 w-full flex flex-col items-center overflow-hidden">
            {cell.outputs.map(renderOutput)}
          </div>
        </div>
      )}
    </div>
  );
}
