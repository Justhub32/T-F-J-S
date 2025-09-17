import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit, Trash2, Image, Settings, LogIn, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { insertArticleSchema, insertSiteSettingsSchema, type InsertArticle, type Article, type SiteSettings, type InsertSiteSettings } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import RichTextEditor from "@/components/rich-text-editor";
import { ObjectUploader } from "@/components/ObjectUploader";
import { AudioUploader } from "@/components/AudioUploader";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import type { UploadResult } from "@uppy/core";

interface ArticleFormData extends Omit<InsertArticle, 'imageUrl'> {
  imageFile?: File;
}

const handleGetUploadParameters = async () => {
  const response = await fetch('/api/objects/upload/public', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to get upload URL');
  }
  const { uploadURL } = await response.json();
  return {
    method: 'PUT' as const,
    url: uploadURL,
  };
};

export default function Admin() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>("");
  const { toast } = useToast();

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <User className="h-16 w-16 text-ocean mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h1>
          <p className="text-gray-600 mb-6">
            You need to sign in to access the admin panel and create articles.
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="bg-ocean hover:bg-teal-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
          >
            <LogIn className="h-5 w-5" />
            Sign In with Replit
          </Button>
        </div>
      </div>
    );
  }

  const { data: articles, isLoading } = useQuery({
    queryKey: ["/api/articles"],
    queryFn: () => api.articles.getAll(),
  });

  const { data: siteSettings } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: () => api.settings.get(),
  });

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(insertArticleSchema.extend({
      imageFile: insertArticleSchema.shape.imageUrl.optional()
    }).omit({ imageUrl: true })),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      category: "",
      subcategory: "",
      author: "Admin",
      isDraft: false,
      isFeatured: false,
      isRealtime: false,
      sourceUrl: "",
      tags: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      let imageUrl = backgroundImageUrl;
      
      if (data.imageFile) {
        const uploadResult = await api.upload.image(data.imageFile);
        imageUrl = uploadResult.imageUrl;
      }

      const articleData: InsertArticle = {
        ...data,
        imageUrl,
        subcategory: data.subcategory || undefined,
        isRealtime: data.isRealtime || false,
        sourceUrl: data.sourceUrl || undefined,
        tags: data.tags || [],
        isFeatured: data.isFeatured || false,
      };
      delete (articleData as any).imageFile;

      return api.articles.create(articleData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      setIsCreateDialogOpen(false);
      form.reset();
      setImagePreview("");
      setBackgroundImageUrl("");
      toast({ title: "Success", description: "Article created successfully!" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create article",
        variant: "destructive"
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ArticleFormData> }) => {
      let imageUrl = editingArticle?.imageUrl;
      
      if (data.imageFile) {
        const uploadResult = await api.upload.image(data.imageFile);
        imageUrl = uploadResult.imageUrl;
      } else if (backgroundImageUrl) {
        imageUrl = backgroundImageUrl;
      }

      const articleData: Partial<InsertArticle> = {
        ...data,
        imageUrl,
      };
      delete (articleData as any).imageFile;

      return api.articles.update(id, articleData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      setEditingArticle(null);
      form.reset();
      setImagePreview("");
      toast({ title: "Success", description: "Article updated successfully!" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update article",
        variant: "destructive"
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.articles.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({ title: "Success", description: "Article deleted successfully!" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete article",
        variant: "destructive"
      });
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (heroBackgroundUrl: string) => {
      return api.settings.update({ heroBackgroundUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings updated",
        description: "Homepage backdrop has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ArticleFormData) => {
    console.log('Form submission attempted with data:', data);
    console.log('Form errors:', form.formState.errors);
    
    if (editingArticle) {
      updateMutation.mutate({ id: editingArticle.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    form.reset({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      category: article.category,
      author: article.author,
      isDraft: article.isDraft,
    });
    setImagePreview(article.imageUrl || "");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('imageFile', file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    form.reset({
      title: "",
      content: "",
      excerpt: "",
      category: "",
      subcategory: "",
      author: "Admin",
      isDraft: false,
      isFeatured: false,
      isRealtime: false,
      sourceUrl: "",
      tags: [],
    });
    setImagePreview("");
    setEditingArticle(null);
  };

  const handleBackdropUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadURL = result.successful[0].uploadURL;
      
      // Set ACL policy for the uploaded image
      try {
        const response = await fetch('/api/article-backdrops', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ imageURL: uploadURL }),
        });
        
        if (response.ok) {
          const { publicUrl } = await response.json();
          setBackgroundImageUrl(publicUrl);
          toast({
            title: "Success",
            description: "Backdrop image uploaded successfully",
          });
        }
      } catch (error) {
        console.error('Error setting backdrop ACL:', error);
        toast({
          title: "Error",
          description: "Failed to process uploaded image",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
              <p className="text-gray-600">Manage your articles and community content</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Signed in as</p>
                <p className="font-medium text-gray-900">
                  {(user as any)?.firstName && (user as any)?.lastName 
                    ? `${(user as any).firstName} ${(user as any).lastName}`
                    : (user as any)?.email || 'Admin User'}
                </p>
              </div>
              <Button
                onClick={() => window.location.href = '/api/logout'}
                variant="outline"
                className="flex items-center gap-2"
                data-testid="button-logout"
              >
                <User className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="bg-white">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Manage Articles</h2>
              <Dialog open={isCreateDialogOpen || !!editingArticle} onOpenChange={(open) => {
                if (!open) {
                  setIsCreateDialogOpen(false);
                  resetForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-ocean hover:bg-teal-600">
                    <Plus className="w-4 h-4 mr-2" />
                    New Article
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingArticle ? "Edit Article" : "Create New Article"}
                    </DialogTitle>
                  </DialogHeader>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter article title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="tech">Tech</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="jiu-jitsu">
                                  <span className="category-jiu-jitsu">Jiu-Jitsu</span>
                                </SelectItem>
                                <SelectItem value="surf">
                                  <span className="category-surf">Surf</span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Featured Image
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-ocean transition-colors">
                          {imagePreview ? (
                            <div className="space-y-4">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="max-h-48 mx-auto rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setImagePreview("");
                                  form.setValue('imageFile', undefined);
                                }}
                              >
                                Remove Image
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                              <p className="text-gray-600">Drop image here or click to upload</p>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="image-upload"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('image-upload')?.click()}
                                className="mt-2"
                              >
                                Choose File
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Article Backdrop Image
                        </label>
                        <p className="text-sm text-gray-500 mb-4">
                          Upload a custom backdrop image that will appear behind the article text
                        </p>
                        
                        {backgroundImageUrl && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Current Backdrop:</p>
                            <img 
                              src={backgroundImageUrl} 
                              alt="Article backdrop preview" 
                              className="w-full max-w-md h-32 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setBackgroundImageUrl("")}
                              className="mt-2"
                            >
                              Remove Backdrop
                            </Button>
                          </div>
                        )}
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-ocean transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;

                              try {
                                const uploadResult = await api.upload.image(file);
                                setBackgroundImageUrl(uploadResult.imageUrl);
                                toast({
                                  title: "Success",
                                  description: "Backdrop image uploaded successfully",
                                });
                              } catch (error) {
                                toast({
                                  title: "Error", 
                                  description: "Failed to upload backdrop image",
                                  variant: "destructive"
                                });
                              }
                            }}
                            className="hidden"
                            id="backdrop-upload"
                          />
                          <Button
                            type="button"
                            onClick={() => document.getElementById('backdrop-upload')?.click()}
                            className="bg-ocean hover:bg-teal-600 text-white"
                          >
                            <Image className="w-4 h-4 mr-2" />
                            Upload Backdrop Image
                          </Button>
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="excerpt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Excerpt</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Brief description of the article"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <RichTextEditor
                                content={field.value}
                                onChange={field.onChange}
                                placeholder="Start writing your article..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Author</FormLabel>
                            <FormControl>
                              <Input placeholder="Author name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isDraft"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Save as draft</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-3 pt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsCreateDialogOpen(false);
                            resetForm();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={createMutation.isPending || updateMutation.isPending}
                          className="bg-ocean hover:bg-teal-600"
                        >
                          {editingArticle ? "Update Article" : "Create Article"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Articles List */}
            <div className="bg-white rounded-lg shadow-sm">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-64"></div>
                        <div className="h-3 bg-gray-200 rounded w-48"></div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : articles && articles.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {articles.map((article) => (
                    <div key={article.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{article.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            article.category === "tech-finance" ? "bg-ocean/10 text-ocean" : "bg-surf/10 text-surf"
                          }`}>
                            {article.category === "tech-finance" ? "Tech+Finance" : "Jiu-Jitsu+Surf"}
                          </span>
                          <span>{article.isDraft ? "Draft" : "Published"}</span>
                          <span>{formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(article)}
                          className="text-ocean hover:text-teal-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this article?")) {
                              deleteMutation.mutate(article.id);
                            }
                          }}
                          className="text-red-500 hover:text-red-600"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
                  <p className="text-gray-600 mb-6">Get started by creating your first article.</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-ocean hover:bg-teal-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Article
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Site Settings</h3>
              
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Homepage Background Image
                  </label>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload a new background image for the homepage hero section
                  </p>
                  
                  {/* Current Background Preview */}
                  {siteSettings?.heroBackgroundUrl && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Current Background:</p>
                      <img 
                        src={siteSettings.heroBackgroundUrl} 
                        alt="Current background" 
                        className="w-full max-w-md h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-ocean transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        try {
                          const uploadResult = await api.upload.image(file);
                          await updateSettingsMutation.mutateAsync(uploadResult.imageUrl);
                        } catch (error) {
                          toast({
                            title: "Error", 
                            description: "Failed to upload background image",
                            variant: "destructive"
                          });
                        }
                      }}
                      className="hidden"
                      id="homepage-background-upload"
                    />
                    <Button
                      type="button"
                      onClick={() => document.getElementById('homepage-background-upload')?.click()}
                      className="bg-ocean hover:bg-teal-600 text-white"
                      disabled={updateSettingsMutation.isPending}
                    >
                      <Image className="w-4 h-4 mr-2" />
                      {updateSettingsMutation.isPending ? "Uploading..." : "Upload Background Image"}
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Audio
                  </label>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload a custom audio file to play as background music instead of the default ocean sounds
                  </p>
                  
                  {/* Current Audio Preview */}
                  {siteSettings?.backgroundAudioUrl && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Current Background Audio:</p>
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                        <audio controls className="flex-1">
                          <source src={siteSettings.backgroundAudioUrl} />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    </div>
                  )}

                  <AudioUploader
                    onUploadComplete={(audioUrl) => {
                      toast({
                        title: "Background audio updated!",
                        description: "Your custom background audio is now ready to use.",
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
