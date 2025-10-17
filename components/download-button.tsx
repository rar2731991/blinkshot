import React from "react";
import DownloadIcon from "@/components/icons/download-icon";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  imageData: string;
  prompt: string;
  onDownload?: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  imageData, 
  prompt, 
  onDownload 
}) => {
  const handleDownload = () => {
    try {
      // Create a link element
      const link = document.createElement("a");
      
      // Convert base64 to blob
      const byteCharacters = atob(imageData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });
      
      // Create download URL and trigger download
      const url = URL.createObjectURL(blob);
      link.href = url;
      
      // Generate filename from prompt (sanitized) or use default
      const sanitizedPrompt = prompt
        .replace(/[^a-zA-Z0-9 ]/g, '') // Remove special characters
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .toLowerCase()
        .substring(0, 50); // Limit length
      
      const filename = sanitizedPrompt 
        ? `blinkshot_${sanitizedPrompt}.png` 
        : `blinkshot_${Date.now()}.png`;
      
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      URL.revokeObjectURL(url);
      
      // Call optional callback
      onDownload?.();
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new window
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<img src="data:image/png;base64,${imageData}" alt="Generated Image" />`);
      }
    }
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      size="sm"
      className="inline-flex items-center gap-2 bg-gray-500 border-gray-350 text-gray-200 hover:bg-gray-400 hover:text-white"
    >
      <DownloadIcon className="size-4" />
      Download
    </Button>
  );
};

export default DownloadButton;
