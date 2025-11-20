import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full" data-testid="form-search">
      <div className="flex gap-4">
        <Input
          type="search"
          placeholder="Please input your research title here, we will handle the rest... You can also search with keywords!"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 text-base flex-1"
          data-testid="input-search"
        />
        <Button type="submit" className="h-12 px-8" data-testid="button-search">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </form>
  );
}
