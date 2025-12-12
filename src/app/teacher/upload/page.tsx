'use client';

import { useState } from 'react';
import { UploadCloud, File, Loader2, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const uploadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  file: z.instanceof(File).refine(file => file.size > 0, 'A file is required.'),
});

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
  });

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      form.setValue('file', e.dataTransfer.files[0]);
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      form.setValue('file', e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const onSubmit = (values: z.infer<typeof uploadSchema>) => {
    console.log(values);
    setIsUploading(true);
    // Simulate upload and processing
    toast({
        title: "Upload Started",
        description: "Your curriculum is being uploaded and processed by our AI."
    });
    setTimeout(() => {
        setIsUploading(false);
        toast({
            title: "Processing Complete!",
            description: `${values.title} is now ready for review.`
        });
        // In a real app, you'd get the new curriculum ID from the backend
        const newCurriculumId = 'solar-system-101';
        router.push(`/teacher/curriculum/${newCurriculumId}`);
    }, 3000);
  };

  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl font-headline">Upload New Curriculum</h1>
      <Card>
        <CardHeader>
          <CardTitle>Curriculum Details</CardTitle>
          <CardDescription>
            Provide a title and upload your curriculum file (PDF, DOCX, or image).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Curriculum Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Introduction to the Solar System" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem>
                    <FormLabel>Curriculum File</FormLabel>
                    <FormControl>
                      <div
                        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                          dragActive ? 'border-primary bg-accent/50' : 'border-border'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.docx,.jpg,.jpeg,.png"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                          <p className="mt-4 text-sm text-muted-foreground">
                            Drag and drop a file here, or click to select a file
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF, DOCX, JPG, PNG up to 10MB
                          </p>
                        </label>
                      </div>
                    </FormControl>
                    {fileName && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <File className="h-4 w-4" />
                        <span>{fileName}</span>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading & Processing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Upload and Simplify
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
