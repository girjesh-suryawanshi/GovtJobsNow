import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Hash } from "lucide-react";
import type { SearchJobsParams } from "@/types/job";

interface AdvancedSearchTagsProps {
  onAdvancedSearch: (searchTerms: string[]) => void;
  currentSearch: string;
}

export default function AdvancedSearchTags({ onAdvancedSearch, currentSearch }: AdvancedSearchTagsProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  // Popular search suggestions based on government job trends
  const popularSearches = [
    "clerk", "assistant", "officer", "engineer", "teacher", "police", 
    "constable", "technician", "pharmacist", "nurse", "accountant", 
    "analyst", "supervisor", "inspector", "specialist", "manager"
  ];

  const skillBasedSearches = [
    "computer", "diploma", "b.tech", "graduate", "postgraduate", 
    "typing", "data entry", "accounting", "hindi", "english"
  ];

  const handleAddTag = (term: string) => {
    if (term && !tags.includes(term.toLowerCase())) {
      const newTags = [...tags, term.toLowerCase()];
      setTags(newTags);
      onAdvancedSearch(newTags);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    onAdvancedSearch(newTags);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleAddTag(inputValue.trim());
    }
  };

  const clearAllTags = () => {
    setTags([]);
    onAdvancedSearch([]);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Hash className="h-4 w-4 text-blue-600" />
        <h3 className="font-semibold text-gray-900">Advanced Search Tags</h3>
      </div>
      
      {/* Tag Input */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Add search terms (e.g., clerk, b.tech, typing)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button 
          onClick={() => handleAddTag(inputValue.trim())}
          disabled={!inputValue.trim() || tags.includes(inputValue.toLowerCase())}
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Active Tags */}
      {tags.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Active Search Tags:</span>
            <Button variant="ghost" size="sm" onClick={clearAllTags}>
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Badge key={tag} variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 hover:bg-blue-500 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Popular Searches */}
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Job Types:</h4>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map(term => (
              <Badge 
                key={term} 
                variant="outline" 
                className="cursor-pointer hover:bg-blue-50 hover:border-blue-300"
                onClick={() => handleAddTag(term)}
              >
                {term}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Skills & Qualifications:</h4>
          <div className="flex flex-wrap gap-2">
            {skillBasedSearches.map(term => (
              <Badge 
                key={term} 
                variant="outline" 
                className="cursor-pointer hover:bg-green-50 hover:border-green-300"
                onClick={() => handleAddTag(term)}
              >
                {term}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Searching for jobs containing:</strong> {tags.join(', ')}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Jobs must match at least one of these terms in title, department, or qualifications.
          </p>
        </div>
      )}
    </div>
  );
}