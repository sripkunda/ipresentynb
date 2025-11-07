import { useState } from "react";
import type { SlideContent } from "./types";
import Presentation from "./Presentation";

interface Notebook {
  cells: SlideContent[];
}

export default function Home() {
  const [slides, setSlides] = useState<SlideContent[]>([]);
  const [showPresentation, setShowPresentation] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".ipynb")) {
      alert("Please upload a valid .ipynb file");
      e.target.value = ""; // Reset file input
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const notebook = JSON.parse(event.target?.result as string) as Notebook;
        const parsedSlides: SlideContent[] = [];
        notebook.cells.forEach((cell) => {
          if (cell.cell_type === "code") {
            // Slide for the code block itself, explicitly rendering the source
            const codeCellWithoutOutputs = { ...cell, outputs: [], renderSource: true };
            parsedSlides.push(codeCellWithoutOutputs);
            // Create a new slide for each output
            cell.outputs.forEach(output => {
              parsedSlides.push({ ...cell, outputs: [output], renderSource: false }); // Do not render source for output-only slides
            });
          } else {
            parsedSlides.push(cell);
          }
        });
        setSlides(parsedSlides);
        setShowPresentation(true);
      } catch (error) {
        console.error("Error parsing notebook file:", error);
        alert("Could not parse the notebook file. Please ensure it is a valid .ipynb file.");
      }
    };
    reader.readAsText(file);
  };

  return showPresentation ? <Presentation slides={slides} /> : (
    <div className="flex items-center justify-center min-h-screen bg-main">
      <label className="cursor-pointer px-6 py-3 btn-primary btn">
        Upload Notebook
        <input type="file" accept=".ipynb" onChange={handleUpload} className="hidden" />
      </label>
    </div>
  );
}
