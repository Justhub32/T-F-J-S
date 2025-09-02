import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Music, Upload, Loader2 } from "lucide-react";
import { ObjectUploader } from "./ObjectUploader";
import type { UploadResult } from "@uppy/core";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AudioUploaderProps {
  onUploadComplete?: (audioUrl: string) => void;
}

export function AudioUploader({ onUploadComplete }: AudioUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleGetUploadParameters = async () => {
    try {
      const response = await fetch('/api/objects/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to get upload parameters');
      }
      
      const { uploadURL } = await response.json();
      return {
        method: 'PUT' as const,
        url: uploadURL,
      };
    } catch (error) {
      console.error('Error getting upload parameters:', error);
      throw error;
    }
  };

  const handleUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      setIsUploading(true);
      try {
        const uploadedFile = result.successful[0];
        const uploadURL = uploadedFile.uploadURL as string;
        
        // Set ACL policy for the uploaded audio file
        const response = await fetch('/api/background-audio', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audioURL: uploadURL,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to process audio upload');
        }

        const { objectPath } = await response.json();
        const audioUrl = objectPath;

        toast({
          title: "Audio uploaded successfully!",
          description: "Your background audio file is ready to use.",
        });

        onUploadComplete?.(audioUrl);
        
      } catch (error) {
        console.error('Error processing audio upload:', error);
        toast({
          title: "Upload failed",
          description: "There was an error processing your audio file.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Music className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Background Audio</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload your custom audio file to play as background music. Supports MP3, WAV, and OGG formats.
        </p>
      </div>

      <ObjectUploader
        maxNumberOfFiles={1}
        maxFileSize={50 * 1024 * 1024} // 50MB limit for audio files
        onGetUploadParameters={handleGetUploadParameters}
        onComplete={handleUploadComplete}
        buttonClassName="w-full"
      >
        {isUploading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing audio...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Upload className="w-4 h-4 mr-2" />
            Upload Audio File
          </div>
        )}
      </ObjectUploader>

      <div className="text-xs text-gray-500">
        Supported formats: MP3, WAV, OGG • Max size: 50MB
      </div>
    </div>
  );
}