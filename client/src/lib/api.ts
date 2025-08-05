import { apiRequest } from "./queryClient";
import { Article, InsertArticle, SiteSettings, InsertSiteSettings } from "@shared/schema";

export const api = {
  articles: {
    getAll: (category?: string): Promise<Article[]> => 
      apiRequest("GET", `/api/articles${category ? `?category=${category}` : ""}`).then(res => res.json()),
    
    getFeatured: (limit?: number): Promise<Article[]> => 
      apiRequest("GET", `/api/articles/featured${limit ? `?limit=${limit}` : ""}`).then(res => res.json()),
    
    getById: (id: string): Promise<Article> => 
      apiRequest("GET", `/api/articles/${id}`).then(res => res.json()),
    
    create: (article: InsertArticle): Promise<Article> => 
      apiRequest("POST", "/api/articles", article).then(res => res.json()),
    
    update: (id: string, article: Partial<InsertArticle>): Promise<Article> => 
      apiRequest("PUT", `/api/articles/${id}`, article).then(res => res.json()),
    
    delete: (id: string): Promise<void> => 
      apiRequest("DELETE", `/api/articles/${id}`).then(() => {}),
  },
  
  upload: {
    image: async (file: File): Promise<{ imageUrl: string }> => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    }
  },

  settings: {
    get: (): Promise<SiteSettings> => 
      apiRequest("GET", "/api/settings").then(res => res.json()),
    
    update: (settings: Partial<InsertSiteSettings>): Promise<SiteSettings> => 
      apiRequest("PUT", "/api/settings", settings).then(res => res.json()),
  }
};
