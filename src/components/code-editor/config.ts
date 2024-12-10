import { Language, Theme, EditorConfig } from './types';

export const languages: Language[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
];

export const themes: Theme[] = [
  { value: "vs-dark", label: "Dark" },
  { value: "light", label: "Light" },
];

export const defaultEditorConfig: EditorConfig = {
  fontSize: 14,
  minimap: { enabled: false },
  lineNumbers: "on",
  roundedSelection: false,
  scrollBeyondLastLine: false,
  automaticLayout: true,
};