
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Sparkles, DollarSign } from 'lucide-react';

const geminiPricing = {
  flash: {
    input: 0.35, // per 1 million tokens
    output: 0.70, // per 1 million tokens
  },
};

const avgRequest = {
  inputTokens: 500,
  outputTokens: 1500,
};

const calculateCost = () => {
  const inputCost = (avgRequest.inputTokens / 1_000_000) * geminiPricing.flash.input;
  const outputCost = (avgRequest.outputTokens / 1_000_000) * geminiPricing.flash.output;
  return inputCost + outputCost;
};

const costPerGeneration = calculateCost();
const generationsPerDollar = 1 / costPerGeneration;

export default function AdminCostPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Gemini 1.5 Cost Analysis</h2>
        <p className="text-muted-foreground">
          An estimate of how much value can be generated for every $1 spent on the Gemini 1.5 Flash model.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pricing Model (Gemini 1.5 Flash)</CardTitle>
            <CardDescription>Costs are based on the number of tokens processed.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Price per 1 Million Tokens</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Input Tokens (Prompts)</TableCell>
                  <TableCell className="text-right font-mono">${geminiPricing.flash.input.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Output Tokens (Responses)</TableCell>
                  <TableCell className="text-right font-mono">${geminiPricing.flash.output.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Request Analysis</CardTitle>
            <CardDescription>Based on a standard "Topic Generation" request.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead className="text-right">Estimated Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Input Tokens</TableCell>
                  <TableCell className="text-right font-mono">{avgRequest.inputTokens.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Output Tokens</TableCell>
                  <TableCell className="text-right font-mono">{avgRequest.outputTokens.toLocaleString()}</TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell className="font-semibold">Cost per Generation</TableCell>
                  <TableCell className="text-right font-mono font-semibold">${costPerGeneration.toFixed(6)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-gradient-to-r from-primary/10 to-primary/20 border-primary/30">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-full w-fit mb-2">
                <DollarSign className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-headline">Generations per Dollar</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
            <p className="text-5xl font-bold text-foreground">
                ≈ {Math.floor(generationsPerDollar).toLocaleString()}
            </p>
            <p className="text-muted-foreground mt-1">
                full topic generations (notes, flashcards, and a quiz) for every $1 spent.
            </p>
        </CardContent>
      </Card>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription>
          These figures are estimates based on average usage. Actual costs may vary depending on the complexity and length of the topics and the AI's response.
        </AlertDescription>
      </Alert>
    </div>
  );
}
