'use client';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import React, { useState, useRef, useTransition } from 'react';
import {
  Upload,
  FileText,
  Image,
  Sparkles,
  Activity,
  Heart,
  X,
  Loader2,
} from 'lucide-react';
import {
  chatAction,
  diagnoseImageAction,
  generateSummaryAction,
} from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

type Message = {
  type: 'user' | 'ai';
  text: string;
  file?: UploadedFile;
  isFile?: boolean;
};

type UploadedFile = {
  name: string;
  type: string;
  size: number;
  dataUri: string;
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUri = event.target?.result as string;
        const fileData: UploadedFile = {
          name: file.name,
          type: file.type,
          size: file.size,
          dataUri: dataUri,
        };

        setUploadedFiles(prev => [...prev, fileData]);

        setMessages(prev => [
          ...prev,
          {
            type: 'user',
            text: file.name,
            file: fileData,
            isFile: true,
          },
          {
            type: 'ai',
            text: `✓ File "${file.name}" uploaded successfully. ${
              file.type.includes('image')
                ? "I'm ready to analyze this medical image."
                : "I'm ready to analyze this PDF document."
            } Please type your question or ask me to analyze it.`,
          },
        ]);
      };
      reader.readAsDataURL(file);
    }

    if(e.target) {
        e.target.value = '';
    }
  };

  const handleSend = async () => {
    if (!input.trim() && uploadedFiles.length === 0) return;

    const userMessageText = input;
    const userMessage: Message = { type: 'user', text: userMessageText, isFile: false };

    // Add user message to UI
    setMessages(prev => [...prev, userMessage]);
    setInput('');


    startTransition(async () => {
        let aiResponse = 'Sorry, I encountered an error. Please try again.';

        // Handle greetings locally
        const lowerInput = userMessageText.toLowerCase();
        if (
            !uploadedFiles.length &&
            lowerInput.match(
            /^(hi|hello|hey|good morning|good afternoon|good evening|greetings)$/
            )
        ) {
            aiResponse =
            "👋 Hello! I'm your AI Medical Assistant. I'm here to help you analyze medical images and documents.\n\n🔬 I can help you with:\n• Disease detection from medical images\n• PDF medical report analysis\n• Treatment recommendations\n• Risk assessment\n• Dietary advice\n\nTo get started, simply upload a medical image or PDF document, then ask me to analyze it!";
            setMessages(prev => [...prev, { type: 'ai', text: aiResponse }]);
            return;
        }

        try {
            if (uploadedFiles.length > 0) {
                const file = uploadedFiles[0]; // For simplicity, handle one file at a time
                if (file.type.startsWith('image/')) {
                    const result = await diagnoseImageAction({ photoDataUri: file.dataUri, message: userMessageText });
                    if(result.error) throw new Error(result.error);
                    aiResponse = result.response || aiResponse;
                } else if (file.type === 'application/pdf') {
                    // First, get summary to use as context
                    const summaryResult = await generateSummaryAction({ fileDataUri: file.dataUri, fileType: file.type });
                    if(summaryResult.error) throw new Error(summaryResult.error);
                    const documentContent = summaryResult.summary || 'Could not process PDF content.';

                    // Then, chat about it
                    const chatResult = await chatAction({ documentContent, message: userMessageText });
                    if(chatResult.error) throw new Error(chatResult.error);
                    aiResponse = chatResult.response || aiResponse;
                }
            } else {
                 const result = await chatAction({ documentContent: 'No document provided', message: userMessageText });
                 if(result.error) throw new Error(result.error);
                 aiResponse = result.response || aiResponse;
            }

        } catch (error: any) {
            console.error('Error processing request:', error);
            aiResponse = `Sorry, I encountered an error: ${error.message}`;
            toast({
                variant: 'destructive',
                title: 'Request Failed',
                description: error.message
            });
        }
        
        setMessages(prev => [...prev, { type: 'ai', text: aiResponse }]);
        setUploadedFiles([]); // Clear files after they are processed
    });
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-purple-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-4 border-b border-purple-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">AI Medical Assistant</h3>
            <p className="text-sm text-purple-100">
              {isProcessing
                ? '🔄 Processing request...'
                : '✨ Ready to analyze your documents'}
            </p>
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-purple-200">
          <p className="text-xs text-purple-700 mb-2 font-semibold">
            📁 Uploaded Documents:
          </p>
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-white border-2 border-purple-300 rounded-xl px-3 py-2 text-sm shadow-sm"
              >
                {file.type.includes('pdf') ? (
                  <FileText className="w-4 h-4 text-red-500" />
                ) : (
                  <Image className="w-4 h-4 text-blue-500" />
                )}
                <span className="text-gray-700 max-w-[150px] truncate font-medium">
                  {file.name}
                </span>
                <button
                  onClick={() => removeFile(idx)}
                  className="hover:bg-red-100 rounded-full p-1 transition-colors"
                >
                  <X className="w-3 h-3 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
                <Activity className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text mb-3">
                Start Your Medical Analysis
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Upload a medical document (PDF or image) to begin. I'll analyze
                it using advanced AI and OCR technology to provide detailed
                insights.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-lg ${
                  msg.type === 'user'
                    ? msg.isFile
                      ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white'
                      : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white'
                    : 'bg-white border-2 border-purple-200 text-gray-900'
                }`}
              >
                {msg.isFile && msg.file && (
                  <div className="flex items-center gap-2 mb-2 opacity-90">
                    {msg.file.type.includes('pdf') ? (
                      <FileText className="w-4 h-4" />
                    ) : (
                      <Image className="w-4 h-4" />
                    )}
                    <span className="text-xs font-semibold">Uploaded:</span>
                  </div>
                )}
                <div className="whitespace-pre-line">{msg.text}</div>
              </div>
            </div>
          ))
        )}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white border-2 border-purple-300 text-gray-900 rounded-2xl px-5 py-3 shadow-lg">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className="w-3 h-3 bg-gradient-to-r from-pink-600 to-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className="w-3 h-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            title="Upload image or PDF"
          >
            <Upload className="w-5 h-5 text-white" />
          </button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your medical documents..."
            disabled={isProcessing}
            className="flex-1 px-4 py-3 bg-white border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:opacity-50 placeholder-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={isProcessing || (!input.trim() && uploadedFiles.length === 0)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isProcessing ? <Loader2 className="animate-spin"/> : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Separator = () => (
  <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent my-12"></div>
);

const HelpSection = () => {
  return (
    <div className="space-y-8">
      <h3 className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-center">
        How It Works
      </h3>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 hover:shadow-xl transition-all">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2 text-lg">
            Upload Document
          </h4>
          <p className="text-sm text-gray-600">
            Upload medical images or PDF reports
          </p>
        </div>
        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:shadow-xl transition-all">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2 text-lg">AI Analysis</h4>
          <p className="text-sm text-gray-600">
            Ask questions to trigger AI-powered analysis
          </p>
        </div>
        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:shadow-xl transition-all">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2 text-lg">
            Get Insights
          </h4>
          <p className="text-sm text-gray-600">
            Receive detailed medical insights instantly
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <SidebarProvider
      style={
        { 
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)", 
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div>
            <Chat />
          </div>
          <Separator />
          <HelpSection />
        </div>
      </main>
    </div>
    </SidebarInset>
    </SidebarProvider>
  );
}
