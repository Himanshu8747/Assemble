"use client";

import * as React from "react";
import { PanelLeftOpen, PanelLeftClose, Plus} from 'lucide-react';
import Editor from "@monaco-editor/react";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  File,
  initialFileStructure,
  getLanguageFromFile,
  addItem,
  deleteItem,
  moveItem,
} from "@/lib/file-utils";
import FileStructure from "./file-structure";

declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
  }
}

export default function CodeEditor() {
  const [code, setCode] = React.useState<string>("");
  const [language, setLanguage] = React.useState("javascript");
  const [theme, setTheme] = React.useState<"vs-dark" | "light">("vs-dark");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [fileStructure, setFileStructure] = React.useState<File[]>(initialFileStructure);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [sidebarWidth, setSidebarWidth] = React.useState(256);
  const [newItemName, setNewItemName] = React.useState("");
  const [newItemType, setNewItemType] = React.useState<"file" | "folder">("file");
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set());
  const [isUploading, setIsUploading] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false); // Added state for dialog

  const { toast } = useToast();

  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);

  const startDrag = (e: React.MouseEvent) => {
    setDragging(true);
    setStartX(e.clientX);
  };

  const handleDrag = (e: MouseEvent) => {
    if (!dragging) return;
    const delta = e.clientX - startX;
    setSidebarWidth((prevWidth) => Math.max(prevWidth + delta, 200));
    setStartX(e.clientX);
  };

  const stopDrag = () => {
    setDragging(false);
  };

  React.useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", stopDrag);
    } else {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", stopDrag);
    }
    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, [dragging]);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
    if (selectedFile) {
      setFileStructure((prev) =>
        prev.map((file) =>
          file.id === selectedFile.id ? { ...file, content: value || "" } : file
        )
      );
    }
  };

  const handleFileClick = (file: File) => {
    if (file.type === "file") {
      setCode(file.content || "");
      setSelectedFile(file);
      const languageFromFile = getLanguageFromFile(file.name);
      setLanguage(languageFromFile);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleAddItem = () => {
    if (!newItemName) return;
    const newItem: Omit<File, "id" | "path" | "children"> = {
      name: newItemName,
      type: newItemType,
      content: newItemType === "file" ? "" : undefined,
    };
    setFileStructure((prev) => addItem(prev, selectedItemId, newItem));
    setNewItemName("");
    setSelectedItemId(null);
    toast({
      title: "Item Added",
      description: `${newItemType === "file" ? "File" : "Folder"} "${newItemName}" has been added.`,
    });
    setDialogOpen(false);
  };

  const handleDeleteItem = (itemId: string) => {
    setFileStructure((prev) => {
      const updatedStructure = deleteItem(prev, itemId);
      const deletedItem = prev.find(item => item.id === itemId) || prev.flatMap(item => item.children).find(child => child?.id === itemId);
      if (deletedItem) {
        toast({
          title: "Item Deleted",
          description: `${deletedItem.type === "file" ? "File" : "Folder"} "${deletedItem.name}" has been deleted.`,
        });
      }
      return updatedStructure;
    });
    if (selectedFile && selectedFile.id === itemId) {
      setSelectedFile(null);
      setCode("");
    }
  };

  const handleDrop = (draggedId: string, targetId: string | null) => {
    setFileStructure((prev) => moveItem(prev, draggedId, targetId));
  };

  const handleFolderUpload = React.useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      const rootFolder: File = { id: 'root', name: 'root', type: 'folder', path: '', children: [] };
      const fileReadPromises: Promise<void>[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = file.webkitRelativePath;
        const pathParts = path.split('/');
        let currentNode = rootFolder;

        for (let j = 0; j < pathParts.length; j++) {
          const name = pathParts[j];
          const currentPath = '/' + pathParts.slice(0, j + 1).join('/');
          let childNode = currentNode.children.find((child) => child.name === name);

          if (!childNode) {
            childNode = { 
              id: `${currentNode.id}-${name}`, 
              name, 
              type: j === pathParts.length - 1 ? 'file' : 'folder', 
              path: currentPath,
              children: [],
              content: j === pathParts.length - 1 ? '' : undefined
            };
            currentNode.children.push(childNode);

            if (childNode.type === 'file') {
              const fileReadPromise = new Promise<void>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  childNode!.content = e.target?.result as string;
                  resolve();
                };
                reader.readAsText(file);
              });
              fileReadPromises.push(fileReadPromise);
            }
          }
          currentNode = childNode;
        }
      }

      await Promise.all(fileReadPromises);
      setFileStructure((prev) => [...prev, ...rootFolder.children]);
      setIsUploading(false);
      toast({
        title: "Folder Uploaded",
        description: `Folder "${rootFolder.children[0].name}" has been uploaded successfully.`,
      });
      setDialogOpen(false);
    }
  }, [toast]);

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <div
          ref={sidebarRef}
          className={`h-full bg-muted transition-all duration-300 ease-in-out ${
            sidebarOpen ? "w-[256px] border-r" : "w-0"
          }`}
          style={{
            width: sidebarOpen ? `${sidebarWidth}px` : "0px",
          }}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-2 border-b">
              {sidebarOpen ? (
                <>
                  <h2 className="text-sm font-semibold">File Explorer</h2>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}> {/* Updated Dialog */}
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Item</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="type" className="text-right">
                            Type
                          </Label>
                          <Select
                            value={newItemType}
                            onValueChange={(value: "file" | "folder") =>
                              setNewItemType(value)
                            }
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="file">File</SelectItem>
                              <SelectItem value="folder">Folder</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="folder-upload" className="text-right">
                            Upload Folder
                          </Label>
                          <Input
                            id="folder-upload"
                            type="file"
                            onChange={handleFolderUpload}
                            webkitdirectory="true"
                            multiple
                            className="col-span-3"
                            disabled={isUploading}
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddItem} disabled={isUploading}>
                        {isUploading ? "Uploading..." : "Add Item"}
                      </Button>
                    </DialogContent>
                  </Dialog>
                </>
              ) : null}
            </div>
            <ScrollArea className="flex-1 bg-gray-950 text-white">
              <div className="p-2 ">
                <FileStructure
                  fileStructure={fileStructure}
                  expandedFolders={expandedFolders}
                  handleFileClick={handleFileClick}
                  toggleFolder={toggleFolder}
                  handleDeleteItem={handleDeleteItem}
                  handleDrop={handleDrop}
                />
              </div>
            </ScrollArea>
          </div>
          {sidebarOpen && (
            <div
              className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-border hover:bg-primary"
              onMouseDown={startDrag}
            />
          )}
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between border-b p-2">
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="h-8 w-8"
                  >
                    {sidebarOpen ? (
                      <PanelLeftClose className="h-4 w-4" />
                    ) : (
                      <PanelLeftOpen className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}</p>
                </TooltipContent>
              </Tooltip>
              {selectedFile && (
                <span className="text-sm font-medium">
                  Current File: {selectedFile.name}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 bg-gray">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[130px] h-8">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={theme}
                onValueChange={(value: "vs-dark" | "light") => setTheme(value)}
              >
                <SelectTrigger className="w-[130px] h-8">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vs-dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="editor" className="flex-1">
            <div className="flex h-full flex-col">
              <TabsList className="mx-2 mt-2 justify-start bg-gray-950 text-white">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="editor" className="flex-1 p-0">
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  theme={theme}
                  onChange={handleEditorChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    padding: { top: 16 },
                  }}
                />
              </TabsContent>
              <TabsContent value="preview" className="flex-1 p-4">
                <div className="h-full w-full overflow-hidden rounded-md border bg-background">
                  <iframe
                    title="Code Preview"
                    className="h-full w-full"
                    srcDoc={`
                      <html>
                        <head>
                          <style>
                            body { 
                              font-family: Arial, sans-serif; 
                              margin: 0; 
                              padding: 1em;
                              background-color: ${
                                theme === "vs-dark" ? "#1e1e1e" : "#ffffff"
                              };
                              color: ${
                                theme === "vs-dark" ? "#ffffff" : "#000000"
                              };
                            }
                          </style>
                        </head>
                        <body>
                          <div id="root"></div>
                          <script type="module">
                            try {
                              ${code}
                              // For React-like code, attempt to render to #root
                              if (typeof App !== 'undefined' && typeof ReactDOM !== 'undefined') {
                                ReactDOM.render(React.createElement(App), document.getElementById('root'));
                              }
                            } catch (error) {
                              document.body.innerHTML = '<pre>' + error + '</pre>';
                            }
                          </script>
                        </body>
                      </html>
                    `}
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      <Toaster />
      </div>
    </TooltipProvider>
  );
}

