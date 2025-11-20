import type { Paper } from "@shared/schema";
import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PaperResultProps {
  paper: Paper;
}

export default function PaperResult({ paper }: PaperResultProps) {
  const [showFullAbstract, setShowFullAbstract] = useState(false);
  const [copiedDoi, setCopiedDoi] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const { toast } = useToast();
  
  const abstractPreview = paper.abstract.length > 250 
    ? paper.abstract.slice(0, 250) + "..." 
    : paper.abstract;

  // Generate APA 7th edition citation
  const generateAPACitation = () => {
    const authorsAPA = paper.authors.map((author, index) => {
      const parts = author.trim().split(' ');
      if (parts.length === 1) return author;
      const lastName = parts[parts.length - 1];
      const initials = parts.slice(0, -1).map(name => name[0] + '.').join(' ');
      return `${lastName}, ${initials}`;
    });

    let authorString = '';
    if (authorsAPA.length === 1) {
      authorString = authorsAPA[0];
    } else if (authorsAPA.length === 2) {
      authorString = `${authorsAPA[0]}, & ${authorsAPA[1]}`;
    } else if (authorsAPA.length <= 20) {
      authorString = authorsAPA.slice(0, -1).join(', ') + ', & ' + authorsAPA[authorsAPA.length - 1];
    } else {
      authorString = authorsAPA.slice(0, 19).join(', ') + ', ... ' + authorsAPA[authorsAPA.length - 1];
    }

    const citation = `${authorString} (${paper.year}). ${paper.title}. ${paper.journal ? `${paper.journal}. ` : ''}${paper.doi ? `https://doi.org/${paper.doi}` : ''}`;
    return citation;
  };

  const apaCitation = generateAPACitation();

  const copyToClipboard = async (text: string, type: 'doi' | 'citation') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'doi') {
        setCopiedDoi(true);
        setTimeout(() => setCopiedDoi(false), 2000);
      } else {
        setCopiedCitation(true);
        setTimeout(() => setCopiedCitation(false), 2000);
      }
      toast({
        title: "Copied!",
        description: `${type === 'doi' ? 'DOI link' : 'Citation'} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const paperUrl = paper.url || (paper.doi ? `https://doi.org/${paper.doi}` : '#');

  return (
    <article className="py-6 border-b last:border-b-0" data-testid={`paper-result-${paper.id}`}>
      <a 
        href={paperUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-lg font-semibold text-foreground hover:underline leading-relaxed block"
        data-testid={`link-paper-${paper.id}`}
      >
        {paper.title}
        <ExternalLink className="inline-block ml-2 h-4 w-4" />
      </a>
      
      <div className="mt-3 p-3 bg-muted/30 rounded-md border">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-1">APA 7th Edition Citation:</p>
            <p className="text-sm text-foreground leading-relaxed" data-testid={`text-citation-${paper.id}`}>
              {apaCitation}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(apaCitation, 'citation')}
            data-testid={`button-copy-citation-${paper.id}`}
            className="flex-shrink-0"
          >
            {copiedCitation ? (
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

      <div className="mt-3 flex flex-wrap gap-2 items-center text-sm">
        {paper.doi && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground" data-testid={`text-doi-${paper.id}`}>
              DOI: {paper.doi}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(`https://doi.org/${paper.doi}`, 'doi')}
              data-testid={`button-copy-doi-${paper.id}`}
              className="h-7 px-2"
            >
              {copiedDoi ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        )}
        {paper.citationCount !== null && paper.citationCount > 0 && (
          <span className="text-muted-foreground" data-testid={`text-citations-${paper.id}`}>
            • Cited by {paper.citationCount}
          </span>
        )}
      </div>
      
      <div className="mt-3 text-foreground leading-relaxed">
        <p data-testid={`text-abstract-${paper.id}`}>
          {showFullAbstract ? paper.abstract : abstractPreview}
          {paper.abstract.length > 250 && (
            <button
              onClick={() => setShowFullAbstract(!showFullAbstract)}
              className="ml-2 text-primary hover:underline"
              data-testid={`button-toggle-abstract-${paper.id}`}
            >
              {showFullAbstract ? "Read less" : "Read more"}
            </button>
          )}
        </p>
      </div>
    </article>
  );
}
