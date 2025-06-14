
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText, Type, Hash } from "lucide-react";
import { CustomSection } from "@/pages/Index";

interface CustomSectionDisplayProps {
  section: CustomSection;
}

export const CustomSectionDisplay = ({ section }: CustomSectionDisplayProps) => {
  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "link":
        return <ExternalLink className="h-4 w-4" />;
      case "markdown":
        return <Hash className="h-4 w-4" />;
      case "file":
        return <FileText className="h-4 w-4" />;
      default:
        return <Type className="h-4 w-4" />;
    }
  };

  const renderContent = () => {
    if (section.type === "link") {
      const isValidUrl = section.content.startsWith("http://") || section.content.startsWith("https://");
      if (isValidUrl) {
        return (
          <a 
            href={section.content} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline flex items-center space-x-1"
          >
            <span>{section.content}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        );
      }
    }

    if (section.type === "markdown") {
      return (
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap text-slate-700 bg-slate-50 p-3 rounded border text-sm">
            {section.content}
          </pre>
        </div>
      );
    }

    return (
      <div className="text-slate-700 whitespace-pre-wrap">
        {section.content}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        {getTypeIcon(section.type)}
        <Badge variant="outline" className="text-xs">
          {section.type || "text"}
        </Badge>
        <span className="text-xs text-slate-500">
          Updated {new Date(section.updatedAt).toLocaleDateString()}
        </span>
      </div>
      <div className="pl-6">
        {renderContent()}
      </div>
    </div>
  );
};
