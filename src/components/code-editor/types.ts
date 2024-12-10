export interface Language {
  value: string;
  label: string;
}

export interface Theme {
  value: string;
  label: string;
}

export interface EditorConfig {
  fontSize: number;
  minimap: { enabled: boolean };
  lineNumbers: "on" | "off";
  roundedSelection: boolean;
  scrollBeyondLastLine: boolean;
  automaticLayout: boolean;
}