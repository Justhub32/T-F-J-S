import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCommentSchema, type Comment } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { ObjectUploader } from "./ObjectUploader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trash2, Image as ImageIcon, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { UploadResult } from '@uppy/core';

interface CommentsSectionProps {
  articleId: string;
}

export function CommentsSection({ articleId }: CommentsSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

  const form = useForm({
    resolver: zodResolver(insertCommentSchema.pick({ content: true })),
    defaultValues: {
      content: "",
    },
  });

  // Fetch comments
  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: ["/api/articles", articleId, "comments"],
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: async (data: { content: string; imageUrl?: string }) => {
      const response = await fetch(`/api/articles/${articleId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`${response.status}: ${error}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/articles", articleId, "comments"],
      });
      form.reset();
      setUploadedImageUrl("");
      toast({
        title: "Success",
        description: "Comment posted successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`${response.status}: ${error}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/articles", articleId, "comments"],
      });
      toast({
        title: "Success",
        description: "Comment deleted successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGetUploadParameters = async () => {
    const response = await fetch("/api/objects/upload", {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to get upload URL");
    }
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadURL = result.successful[0].uploadURL;
      if (uploadURL) {
        try {
          const response = await fetch("/api/comment-images", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageURL: uploadURL }),
            credentials: "include",
          });
          if (!response.ok) {
            throw new Error("Failed to process image");
          }
          const data = await response.json();
          setUploadedImageUrl(data.objectPath);
          toast({
            title: "Success",
            description: "Image uploaded successfully!",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to process uploaded image.",
            variant: "destructive",
          });
        }
      }
    }
  };

  const onSubmit = (data: { content: string }) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to post a comment.",
        variant: "destructive",
      });
      window.location.href = "/api/login";
      return;
    }

    createCommentMutation.mutate({
      ...data,
      imageUrl: uploadedImageUrl || undefined,
    });
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const getUserInitials = (name?: string) => {
    if (name) {
      const parts = name.split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name[0].toUpperCase();
    }
    return "U";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <Card>
          <CardHeader>
            <h4 className="font-medium">Add a Comment</h4>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Comment</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Share your thoughts..."
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload */}
                <div className="flex items-center gap-4">
                  <ObjectUploader
                    maxNumberOfFiles={1}
                    maxFileSize={5 * 1024 * 1024} // 5MB
                    onGetUploadParameters={handleGetUploadParameters}
                    onComplete={handleUploadComplete}
                    buttonClassName="h-9"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Add Photo
                  </ObjectUploader>

                  {uploadedImageUrl && (
                    <Badge variant="secondary" className="gap-1">
                      <ImageIcon className="h-3 w-3" />
                      Photo added
                    </Badge>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={createCommentMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">Sign in to join the conversation</p>
              <Button onClick={() => window.location.href = "/api/login"}>
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-muted rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-24" />
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.authorAvatar || undefined} />
                    <AvatarFallback>
                      {getUserInitials(comment.authorName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {comment.authorName || "Anonymous User"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      
                      {user && user.id === comment.userId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={deleteCommentMutation.isPending}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>

                    {comment.imageUrl && (
                      <div className="mt-3">
                        <img
                          src={comment.imageUrl}
                          alt="Comment attachment"
                          className="max-w-md rounded-lg border shadow-sm"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}