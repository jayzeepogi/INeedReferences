import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // URL to Citation API endpoint
  app.post("/api/extract-doi", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      // Extract DOI from URL
      const doiPatterns = [
        /doi\.org\/(10\.\d{4,}\/[^\s]+)/i,
        /dx\.doi\.org\/(10\.\d{4,}\/[^\s]+)/i,
        /doi:\s*(10\.\d{4,}\/[^\s]+)/i,
        /(10\.\d{4,}\/[^\s]+)/i,
      ];

      let extractedDoi: string | null = null;

      for (const pattern of doiPatterns) {
        const match = url.match(pattern);
        if (match) {
          extractedDoi = match[1] || match[0];
          break;
        }
      }

      // Check for arXiv URLs
      if (!extractedDoi) {
        const arxivMatch = url.match(/arxiv\.org\/(?:abs|pdf)\/(\d+\.\d+)/i);
        if (arxivMatch) {
          extractedDoi = `10.48550/arXiv.${arxivMatch[1]}`;
        }
      }

      if (!extractedDoi) {
        return res.status(404).json({ error: "DOI not found in URL" });
      }

      res.json({ doi: extractedDoi });
    } catch (error) {
      console.error("Error extracting DOI:", error);
      res.status(500).json({ error: "Failed to extract DOI" });
    }
  });

  // Generate citation from DOI
  app.post("/api/generate-citation", async (req, res) => {
    try {
      const { doi, format = 'apa' } = req.body;
      
      if (!doi) {
        return res.status(400).json({ error: "DOI is required" });
      }

      // Map format names to CrossRef style names
      const formatMap: { [key: string]: string } = {
        'apa': 'apa',
        'mla': 'modern-language-association',
        'chicago': 'chicago-author-date',
        'harvard': 'harvard-cite-them-right',
        'vancouver': 'vancouver',
        'ieee': 'ieee',
        'bibtex': 'bibtex',
      };

      const styleParam = formatMap[format] || 'apa';

      // Call CrossRef content negotiation API
      const crossrefUrl = `https://dx.doi.org/${doi}`;
      const response = await fetch(crossrefUrl, {
        headers: {
          'Accept': `text/bibliography; style=${styleParam}`,
        },
        redirect: 'follow',
      });

      if (!response.ok) {
        return res.status(404).json({ error: "Citation not found for this DOI" });
      }

      const citation = await response.text();
      res.json({ citation: citation.trim() });
    } catch (error) {
      console.error("Error generating citation:", error);
      res.status(500).json({ error: "Failed to generate citation" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
