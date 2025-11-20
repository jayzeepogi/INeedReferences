import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface Filters {
  yearFrom: string;
  yearTo: string;
  field: string;
  publicationType: string;
}

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
}

export default function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="flex flex-wrap gap-4 items-end" data-testid="panel-filters">
      <div className="flex-1 min-w-[150px]">
        <Label htmlFor="year-from" className="text-sm">Year From</Label>
        <Select value={filters.yearFrom} onValueChange={(value) => onFilterChange('yearFrom', value)}>
          <SelectTrigger id="year-from" data-testid="select-year-from">
            <SelectValue placeholder="Any year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any year</SelectItem>
            {years.map(year => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <Label htmlFor="year-to" className="text-sm">Year To</Label>
        <Select value={filters.yearTo} onValueChange={(value) => onFilterChange('yearTo', value)}>
          <SelectTrigger id="year-to" data-testid="select-year-to">
            <SelectValue placeholder="Any year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any year</SelectItem>
            {years.map(year => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[180px]">
        <Label htmlFor="field" className="text-sm">Field of Study</Label>
        <Select value={filters.field} onValueChange={(value) => onFilterChange('field', value)}>
          <SelectTrigger id="field" data-testid="select-field">
            <SelectValue placeholder="All fields" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All fields</SelectItem>
            <SelectItem value="computer-science">Computer Science</SelectItem>
            <SelectItem value="physics">Physics</SelectItem>
            <SelectItem value="biology">Biology</SelectItem>
            <SelectItem value="mathematics">Mathematics</SelectItem>
            <SelectItem value="chemistry">Chemistry</SelectItem>
            <SelectItem value="medicine">Medicine</SelectItem>
            <SelectItem value="economics">Economics</SelectItem>
            <SelectItem value="psychology">Psychology</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[180px]">
        <Label htmlFor="pub-type" className="text-sm">Publication Type</Label>
        <Select value={filters.publicationType} onValueChange={(value) => onFilterChange('publicationType', value)}>
          <SelectTrigger id="pub-type" data-testid="select-publication-type">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="journal">Journal Article</SelectItem>
            <SelectItem value="conference">Conference Paper</SelectItem>
            <SelectItem value="preprint">Preprint</SelectItem>
            <SelectItem value="review">Review Article</SelectItem>
            <SelectItem value="thesis">Thesis</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
