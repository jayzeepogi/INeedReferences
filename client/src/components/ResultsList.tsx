import type { Paper } from "@shared/schema";
import PaperResult from "./PaperResult";

interface ResultsListProps {
  papers: Paper[];
  totalCount: number;
  currentPage: number;
  resultsPerPage: number;
}

export default function ResultsList({ papers, totalCount, currentPage, resultsPerPage }: ResultsListProps) {
  const startIndex = (currentPage - 1) * resultsPerPage + 1;
  const endIndex = Math.min(currentPage * resultsPerPage, totalCount);

  if (papers.length === 0) {
    return (
      <div className="text-center py-12" data-testid="text-no-results">
        <p className="text-muted-foreground">No results found. Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-sm text-muted-foreground" data-testid="text-results-count">
        Showing {startIndex}-{endIndex} of {totalCount} results
      </div>
      
      <div className="divide-y">
        {papers.map((paper) => (
          <PaperResult key={paper.id} paper={paper} />
        ))}
      </div>
    </div>
  );
}
