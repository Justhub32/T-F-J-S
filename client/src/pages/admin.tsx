import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit, Trash2, Image, Settings } from "lucide-react";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { insertArticleSchema, type InsertArticle, type Article } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import RichTextEditor from "@/components/rich-text-editor";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface ArticleFormData extends Omit<InsertArticle, 'imageUrl'> {
  imageFile?: File;
}

export default function Admin() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { toast } = useToast();

  const { data: articles, isLoading } = useQuery({
    queryKey: ["/api/articles"],
    queryFn: () => api.articles.getAll(),
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
      author: "Admin",
      isDraft: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      let imageUrl = "";
      
      if (data.imageFile) {
        const uploadResult = await api.upload.image(data.imageFile);
        imageUrl = uploadResult.imageUrl;
      }

      const articleData: InsertArticle = {
        ...data,
        imageUrl: imageUrl || undefined,
      };
      delete (articleData as any).imageFile;

      return api.articles.create(articleData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      setIsCreateDialogOpen(false);
      form.reset();
      setImagePreview("");
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

  const onSubmit = (data: ArticleFormData) => {
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
      author: "Admin",
      isDraft: false,
    });
    setImagePreview("");
    setEditingArticle(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
          <p className="text-gray-600">Manage your articles and community content</p>
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
                                <SelectItem value="jiu-jitsu">Jiu-Jitsu</SelectItem>
                                <SelectItem value="surf">Surf</SelectItem>
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
              
              <div className="space-y-6 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <Input defaultValue="ChillVibes Community" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description
                  </label>
                  <Textarea
                    rows={3}
                    defaultValue="A lifestyle digital community spreading chill vibes through tech, finance, jiu-jitsu, and surf culture."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Keywords
                  </label>
                  <Input placeholder="lifestyle, tech, finance, jiu-jitsu, surf, community" />
                </div>

                <Button className="bg-ocean hover:bg-teal-600">
                  <Settings className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
