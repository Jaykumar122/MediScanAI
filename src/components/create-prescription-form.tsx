'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  createPrescription,
  getMedicationSuggestions,
} from '@/lib/actions';
import { PrescriptionSchema, Medication } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, PlusCircle, Trash2, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QrCodeDialog from './qr-code-dialog';

type PrescriptionFormValues = z.infer<typeof PrescriptionSchema>;

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function CreatePrescriptionForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setSuggesting] = useState(false);

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(PrescriptionSchema),
    defaultValues: {
      patientName: '',
      patientAge: 0,
      symptoms: '',
      medications: [{ name: '', dosage: '', frequency: '', quantity: '' }],
      maxScans: 5,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'medications',
  });

  const symptomsValue = form.watch('symptoms');
  const debouncedSymptoms = useDebounce(symptomsValue, 500);

  useEffect(() => {
    if (debouncedSymptoms && debouncedSymptoms.length > 3) {
      setSuggesting(true);
      getMedicationSuggestions({ symptoms: debouncedSymptoms }).then(
        (result) => {
          if (result.medications) {
            setSuggestions(
              result.medications
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            );
          } else {
            setSuggestions([]);
          }
          setSuggesting(false);
        }
      );
    } else {
      setSuggestions([]);
    }
  }, [debouncedSymptoms]);

  const addMedication = (medication?: Partial<Medication>) => {
    append({ name: '', dosage: '', frequency: '', quantity: '', ...medication });
  };

  const onSubmit = (data: PrescriptionFormValues) => {
    startTransition(async () => {
      const result = await createPrescription(data);
      if (result.success && result.token) {
        setGeneratedToken(result.token);
        setDialogOpen(true);
        toast({
          title: 'Success!',
          description: 'Prescription QR code has been generated.',
        });
        form.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            result.error || 'Something went wrong. Please try again.',
        });
      }
    });
  };

  return (
    <>
      <Card className="shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-6 md:p-8 grid gap-8">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="patientAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="35" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="maxScans"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Scans</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5" {...field} />
                    </FormControl>
                     <FormDescription>
                      Set how many times the QR code can be scanned. For unlimited scans, enter a very high number (e.g. 9999).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="relative">
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symptoms</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., headache, fever, cough..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {(isSuggesting || suggestions.length > 0) && (
                   <div className="mt-2 p-3 bg-accent/20 rounded-md border border-dashed border-accent">
                    <div className="flex items-center gap-2 text-sm font-medium text-accent-foreground mb-2">
                        <Bot className="h-5 w-5"/>
                        <span>AI Suggestions</span>
                        {isSuggesting && <Loader2 className="h-4 w-4 animate-spin"/>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map((med, index) => (
                        <Button
                            key={index}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="bg-background"
                            onClick={() => addMedication({ name: med })}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {med}
                        </Button>
                        ))}
                    </div>
                   </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Medications</h3>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 items-start p-4 border rounded-lg bg-card"
                    >
                      <FormField
                        control={form.control}
                        name={`medications.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Ibuprofen" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`medications.${index}.dosage`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dosage</FormLabel>
                            <FormControl>
                              <Input placeholder="200mg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`medications.${index}.frequency`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frequency</FormLabel>
                            <FormControl>
                              <Input placeholder="Twice a day" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`medications.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input placeholder="30 tablets" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-8 text-destructive"
                        onClick={() => remove(index)}
                        aria-label="Remove medication"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() => addMedication()}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Medication
                </Button>
              </div>
            </CardContent>
            <CardFooter className="p-6 md:p-8 border-t">
              <Button type="submit" disabled={isPending} className="w-full md:w-auto ml-auto">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Secure QR Code'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      {generatedToken && (
        <QrCodeDialog
          token={generatedToken}
          open={isDialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
}
