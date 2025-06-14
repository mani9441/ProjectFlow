
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CustomSectionEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialType?: string;
  onSave: (title: string, content: string, type?: string) => void;
  onCancel: () => void;
}

export const CustomSectionEditor = ({ 
  initialTitle = "", 
  initialContent = "", 
  initialType = "text",
  onSave, 
  onCancel 
}: CustomSectionEditorProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [type, setType] = useState(initialType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave(title.trim(), content.trim(), type);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="section-title">Section Title *</Label>
          <Input
            id="section-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., API Endpoints, Meeting Notes"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="section-type">Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="link">Link</SelectItem>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="file">File Reference</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="section-content">Content *</Label>
        <Textarea
          id="section-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            type === "link" 
              ? "https://example.com" 
              : type === "markdown"
              ? "## Heading\n\nSome **markdown** content"
              : "Enter your content here"
          }
          rows={4}
          required
        />
      </div>

      <div className="flex space-x-2">
        <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
          Save Section
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
