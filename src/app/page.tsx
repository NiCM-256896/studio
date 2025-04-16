'use client';

import {parseAndRankTechnologies} from '@/ai/flows/parse-and-rank-technologies';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useEffect, useState} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"

export default function Home() {
  const [technologies, setTechnologies] = useState('');
  const [rankedTechnologies, setRankedTechnologies] = useState<
    {technology: string; relevance: number}[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await parseAndRankTechnologies({technologies});
      setRankedTechnologies(result.rankedTechnologies);
      toast({
        title: "Technologies Ranked!",
        description: "The technologies have been successfully ranked.",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      })
      console.error('Error parsing and ranking technologies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) {
      setRankedTechnologies([]); // Clear previous results when loading
    }
  }, [isLoading]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Framework Finder</h1>
      <div className="flex flex-col gap-4">
        <div>
          <Input
            type="text"
            placeholder="Enter frameworks or technologies (comma-separated)"
            value={technologies}
            onChange={e => setTechnologies(e.target.value)}
          />
        </div>
        <div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/80"
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
        {rankedTechnologies.length > 0 && (
          <div className="overflow-x-auto">
              <Table>
                <TableCaption>A list of technologies, ranked by relevance.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Technology</TableHead>
                    <TableHead>Relevance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankedTechnologies.map(tech => (
                    <TableRow key={tech.technology}>
                      <TableCell className="font-medium">{tech.technology}</TableCell>
                      <TableCell>{tech.relevance.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </div>
        )}
      </div>
    </div>
  );
}
