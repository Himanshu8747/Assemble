export interface File {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: File[];
}

export const initialFileStructure: File[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      {
        id: "2",
        name: "index.js",
        type: "file",
        content: "// index.js content\nconsole.log('Hello World!');",
      },
      {
        id: "3",
        name: "App.js",
        type: "file",
        content: "// App.js content\nfunction App() { return <h1>Hello!</h1>; }",
      },
    ],
  },
  {
    id: "4",
    name: "public",
    type: "folder",
    children: [
      {
        id: "5",
        name: "index.html",
        type: "file",
        content:
          "<!DOCTYPE html><html><head><title>My App</title></head><body></body></html>",
      },
    ],
  },
];

export const getLanguageFromFile = (fileName: string): string => {
  if (fileName.endsWith(".js")) return "javascript";
  if (fileName.endsWith(".ts")) return "typescript";
  if (fileName.endsWith(".html")) return "html";
  if (fileName.endsWith(".css")) return "css";
  if (fileName.endsWith(".py")) return "python";
  return "plaintext"; // default if no match
};

export const addItem = (
  files: File[],
  parentId: string | null,
  newItem: Omit<File, "id">
): File[] => {
  const newId = Math.random().toString(36).substr(2, 9);
  const addItemToLevel = (items: File[]): File[] => {
    if (parentId === null) {
      return [...items, { ...newItem, id: newId }];
    }
    return items.map((item) => {
      if (item.id === parentId) {
        return {
          ...item,
          children: [...(item.children || []), { ...newItem, id: newId }],
        };
      }
      if (item.children) {
        return { ...item, children: addItemToLevel(item.children) };
      }
      return item;
    });
  };
  return addItemToLevel(files);
};

export const deleteItem = (files: File[], itemId: string): File[] => {
  const deleteItemFromLevel = (items: File[]): File[] => {
    return items.filter((item) => item.id !== itemId).map((item) => {
      if (item.children) {
        return { ...item, children: deleteItemFromLevel(item.children) };
      }
      return item;
    });
  };
  return deleteItemFromLevel(files);
};
