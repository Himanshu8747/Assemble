export interface File {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  children: File[];
  path: string;
}

export const initialFileStructure: File[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    path: "/src",
    children: [
      {
        id: "2",
        name: "index.js",
        type: "file",
        content: "// index.js content\nconsole.log('Hello World!');",
        path: "/src/index.js",
        children: []
      },
      {
        id: "3",
        name: "App.js",
        type: "file",
        content: "// App.js content\nfunction App() { return <h1>Hello!</h1>; }",
        path: "/src/App.js",
        children: []
      },
    ],
  },
  {
    id: "4",
    name: "public",
    type: "folder",
    path: "/public",
    children: [
      {
        id: "5",
        name: "index.html",
        type: "file",
        content:
          "<!DOCTYPE html><html><head><title>My App</title></head><body></body></html>",
        path: "/public/index.html",
        children: []
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
  newItem: Omit<File, "id" | "path" | "children">
): File[] => {
  const newId = Math.random().toString(36).substr(2, 9);
  const addItemToLevel = (items: File[], parentPath: string): File[] => {
    if (parentId === null) {
      const newPath = `/${newItem.name}`;
      return [...items, { ...newItem, id: newId, path: newPath, children: [] }];
    }
    return items.map((item) => {
      if (item.id === parentId) {
        const newPath = `${item.path}/${newItem.name}`;
        return {
          ...item,
          children: [...item.children, { ...newItem, id: newId, path: newPath, children: [] }],
        };
      }
      if (item.children) {
        return { ...item, children: addItemToLevel(item.children, item.path) };
      }
      return item;
    });
  };
  return addItemToLevel(files, "");
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

export const moveItem = (files: File[], draggedId: string, targetId: string | null): File[] => {
  let draggedItem: File | null = null;
  let newFiles: File[] = JSON.parse(JSON.stringify(files));

  const removeItem = (items: File[]): File[] => {
    return items.filter((item) => {
      if (item.id === draggedId) {
        draggedItem = item;
        return false;
      }
      if (item.children) {
        item.children = removeItem(item.children);
      }
      return true;
    });
  };

  newFiles = removeItem(newFiles);

  if (!draggedItem) return files;

  const insertItem = (items: File[]): File[] => {
    return items.map((item) => {
      if (item.id === targetId) {
        if (item.type === 'folder') {
          return {
            ...item,
            children: [...item.children, draggedItem!],
          };
        } else {
          return [item, draggedItem!];
        }
      }
      if (item.children) {
        item.children = insertItem(item.children);
      }
      return item;
    }).flat();
  };

  if (targetId) {
    newFiles = insertItem(newFiles);
  } else {
    newFiles.push(draggedItem);
  }

  return newFiles;
};

