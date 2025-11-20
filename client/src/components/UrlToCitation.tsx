import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Check, Link as LinkIcon, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function UrlToCitation() {
  const [url, setUrl] = useState("");
  const [citationFormat, setCitationFormat] = useState("apa");
  const [loading, setLoading] = useState(false);
  const [citation, setCitation] = useState("");
  const [doi, setDoi] = useState("");
  const [copied, setCopied] = useState(false);
  const [trustWarning, setTrustWarning] = useState<{
    trusted: boolean;
    message: string;
  } | null>(null);
  const { toast } = useToast();

  const trustedDomains = [
    'arxiv.org',
    'doi.org',
    'dx.doi.org',
    'nature.com',
    'science.org',
    'ieee.org',
    'acm.org',
    'springer.com',
    'sciencedirect.com',
    'wiley.com',
    'tandfonline.com',
    'jstor.org',
    'nih.gov',
    'pubmed.ncbi.nlm.nih.gov',
    'plos.org',
    'frontiersin.org',
    'mdpi.com',
    'oup.com',
    'cambridge.org',
    'aaas.org',
    'cell.com',
    'elsevier.com',
    'biomedcentral.com',
    'pnas.org',
  ];

  const extractDoiFromUrl = (inputUrl: string): string | null => {
    try {
      const url = inputUrl.trim();
      
      // First, check if it's already a DOI
      if (/^10\.\d{4,}\/[^\s]+/i.test(url)) {
        return url;
      }

      // Match DOI patterns in URL - more comprehensive patterns
      const doiPatterns = [
        // Standard DOI URLs
        /doi\.org\/(10\.\d{4,}[^\s]*)/i,
        /dx\.doi\.org\/(10\.\d{4,}[^\s]*)/i,
        // DOI in URL parameters or paths
        /[?&]doi=(10\.\d{4,}[^\s&]*)/i,
        /\/doi\/(10\.\d{4,}[^\s]*)/i,
        // DOI with prefix
        /doi:\s*(10\.\d{4,}[^\s]*)/i,
        // Plain DOI in text
        /(10\.\d{4,}\/[^\s,;)]*)/i,
      ];

      for (const pattern of doiPatterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          // Clean up the DOI (remove trailing punctuation and URL encoding)
          let doi = match[1];
          doi = decodeURIComponent(doi);
          doi = doi.replace(/[.,;)\]]+$/, ''); // Remove trailing punctuation
          return doi;
        }
      }

      // Check for arXiv URLs - multiple patterns
      const arxivPatterns = [
        /arxiv\.org\/abs\/(\d{4}\.\d{4,5})/i,
        /arxiv\.org\/pdf\/(\d{4}\.\d{4,5})/i,
        /arxiv\.org\/abs\/([a-z-]+\/\d{7})/i, // Old arXiv format
      ];

      for (const pattern of arxivPatterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          return `10.48550/arXiv.${match[1]}`;
        }
      }

      // Check for PubMed URLs
      const pubmedMatch = url.match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/i);
      if (pubmedMatch) {
        // Note: PubMed IDs need to be converted to DOI via API
        // For now, return null and let user know
        return null;
      }

      return null;
    } catch (error) {
      console.error('Error extracting DOI:', error);
      return null;
    }
  };

  const checkSourceTrustworthiness = (inputUrl: string): { trusted: boolean; message: string } => {
    try {
      // If it's just a DOI (not a URL), skip trustworthiness check
      if (/^10\.\d{4,}\/[^\s]+/i.test(inputUrl.trim())) {
        return {
          trusted: true,
          message: 'DOI entered directly. DOIs are managed by CrossRef and link to registered publications.'
        };
      }

      const urlObj = new URL(inputUrl);
      const domain = urlObj.hostname.toLowerCase().replace('www.', '');

      const isTrusted = trustedDomains.some(trustedDomain => 
        domain.includes(trustedDomain) || trustedDomain.includes(domain)
      );

      if (isTrusted) {
        return {
          trusted: true,
          message: `Source verified: ${domain} is a recognized academic publisher/repository.`
        };
      } else {
        return {
          trusted: false,
          message: `Warning: ${domain} is not in our list of verified academic sources. Please verify the credibility of this source independently.`
        };
      }
    } catch (error) {
      return {
        trusted: false,
        message: 'Could not verify URL. If you have a DOI, you can enter it directly (e.g., 10.1234/example).'
      };
    }
  };

  const generateCitationFromDoi = async (doiValue: string, format: string): Promise<string> => {
    try {
      const response = await fetch('/api/generate-citation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doi: doiValue, format }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate citation');
      }

      const data = await response.json();
      return data.citation;
    } catch (error) {
      throw new Error('Failed to generate citation');
    }
  };

  const handleGenerate = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setCitation("");
    setDoi("");
    setTrustWarning(null);

    try {
      // Check trustworthiness
      const trustCheck = checkSourceTrustworthiness(url);
      setTrustWarning(trustCheck);

      // Extract DOI
      const extractedDoi = extractDoiFromUrl(url);
      
      if (!extractedDoi) {
        toast({
          title: "DOI not found",
          description: "Could not extract DOI from this URL. Try entering the DOI directly (e.g., 10.1234/example) or paste a URL from doi.org, arXiv, or a publisher's website.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log('Extracted DOI:', extractedDoi);

      setDoi(extractedDoi);

      // Generate citation
      const generatedCitation = await generateCitationFromDoi(extractedDoi, citationFormat);
      setCitation(generatedCitation);

      toast({
        title: "Success",
        description: "Citation generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate citation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Citation copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full" data-testid="card-url-citation">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          URL to Citation Generator
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Paste a URL from an academic source to automatically extract the DOI and generate a citation
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="source-url">Source URL</Label>
          <div className="flex gap-2">
            <Input
              id="source-url"
              type="text"
              placeholder="https://doi.org/10.1234/example or 10.1234/example or https://arxiv.org/abs/1234.5678"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
              data-testid="input-source-url"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Enter a URL from a publisher, doi.org, arXiv, or paste a DOI directly
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="citation-format">Citation Format</Label>
          <Select value={citationFormat} onValueChange={setCitationFormat}>
            <SelectTrigger id="citation-format" data-testid="select-citation-format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apa">APA 7th Edition</SelectItem>
              <SelectItem value="mla">MLA 9th Edition</SelectItem>
              <SelectItem value="chicago">Chicago Author-Date</SelectItem>
              <SelectItem value="harvard">Harvard</SelectItem>
              <SelectItem value="vancouver">Vancouver</SelectItem>
              <SelectItem value="ieee">IEEE</SelectItem>
              <SelectItem value="bibtex">BibTeX</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full"
          data-testid="button-generate-citation"
        >
          {loading ? "Generating..." : "Generate Citation"}
        </Button>

        {trustWarning && (
          <Alert variant={trustWarning.trusted ? "default" : "destructive"} data-testid="alert-trust-warning">
            {trustWarning.trusted ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertTitle>{trustWarning.trusted ? "Verified Source" : "Unverified Source"}</AlertTitle>
            <AlertDescription>{trustWarning.message}</AlertDescription>
          </Alert>
        )}

        {doi && (
          <div className="p-3 bg-muted/30 rounded-md border space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Extracted DOI:</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(doi)}
                data-testid="button-copy-doi-extracted"
                className="h-7 px-2"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm font-mono text-foreground" data-testid="text-extracted-doi">
              {doi}
            </p>
          </div>
        )}

        {citation && (
          <div className="p-3 bg-muted/30 rounded-md border">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Generated Citation ({citationFormat.toUpperCase()}):
                </p>
                <p className="text-sm text-foreground leading-relaxed" data-testid="text-generated-citation">
                  {citation}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(citation)}
                data-testid="button-copy-generated-citation"
                className="flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-semibold">Supported formats:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li>Direct DOI: <code className="bg-muted px-1 rounded">10.1234/example</code></li>
            <li>DOI URL: <code className="bg-muted px-1 rounded">https://doi.org/10.1234/example</code></li>
            <li>arXiv: <code className="bg-muted px-1 rounded">https://arxiv.org/abs/1234.5678</code></li>
            <li>Publisher URLs containing DOI</li>
          </ul>
          <p className="mt-2 font-semibold">Trusted sources:</p>
          <p>arXiv, Nature, Science, IEEE, ACM, Springer, ScienceDirect, Wiley, PubMed, PLOS, and more</p>
        </div>
      </CardContent>
    </Card>
  );
}
