export type CellType = "markdown" | "code";

export interface BaseCell {
  cell_type: CellType;
  source: string[];
}

export interface MarkdownCell extends BaseCell {
  cell_type: "markdown";
}

export interface Output {
  output_type: string;
  text?: string[];
  data?: { [key: string]: any };
  ename?: string;
  evalue?: string;
  traceback?: string[];
  name?: "stdout" | "stderr";
  execution_count?: number | null;
}

export interface CodeCell extends BaseCell {
  cell_type: "code";
  outputs: Output[];
  execution_count?: number | null;
  renderSource?: boolean; // New property to control if the code source should be rendered
}

export type SlideContent = MarkdownCell | CodeCell;