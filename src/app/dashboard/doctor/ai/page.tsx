'use client';

import React, { useState, useRef, useTransition } from 'react';
import { Upload, FileText, Image, X, Loader2, Send, Languages } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  chatAction,
  diagnoseImageAction,
  generateSummaryAction,
} from '@/app/actions';
import { AppSidebar } from "@/components/ui/app-sidebar1"
import { SiteHeader } from "@/components/site-header1"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
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

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
];

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getLanguageInstruction = (langCode: string): string => {
    const languageNames: Record<string, string> = {
      'hi': 'Hindi (हिंदी)',
      'kn': 'Kannada (ಕನ್ನಡ)',
      'ta': 'Tamil (தமிழ்)',
      'te': 'Telugu (తెలుగు)',
      'mr': 'Marathi (मराठी)',
      'bn': 'Bengali (বাংলা)',
      'gu': 'Gujarati (ગુજરાતી)',
    };

    if (langCode === 'en') return '';
    
    return `\n\n[LANGUAGE INSTRUCTION]: Please respond ONLY in ${languageNames[langCode] || langCode} language. Translate all content including medical information accurately while keeping medical terminology precise. Write your entire response in ${languageNames[langCode] || langCode}.`;
  };

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
        
        const uploadMessages: Record<string, string> = {
          en: `✓ File "${file.name}" uploaded successfully. ${
            file.type.includes('image')
              ? "I'm ready to analyze this medical image."
              : "I'm ready to analyze this PDF document."
          } Please type your question or ask me to analyze it.`,
          hi: `✓ फ़ाइल "${file.name}" सफलतापूर्वक अपलोड हो गई। ${
            file.type.includes('image')
              ? "मैं इस चिकित्सा छवि का विश्लेषण करने के लिए तैयार हूं।"
              : "मैं इस PDF दस्तावेज़ का विश्लेषण करने के लिए तैयार हूं।"
          } कृपया अपना प्रश्न टाइप करें या मुझे इसका विश्लेषण करने के लिए कहें।`,
          kn: `✓ ಫೈಲ್ "${file.name}" ಯಶಸ್ವಿಯಾಗಿ ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ। ${
            file.type.includes('image')
              ? "ನಾನು ಈ ವೈದ್ಯಕೀಯ ಚಿತ್ರವನ್ನು ವಿಶ್ಲೇಷಿಸಲು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ।"
              : "ನಾನು ಈ PDF ದಾಖಲೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಲು ಸಿದ್ಧವಾಗಿದ್ದೇನೆ।"
          } ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಅದನ್ನು ವಿಶ್ಲೇಷಿಸಲು ನನಗೆ ಹೇಳಿ।`,
          ta: `✓ கோப்பு "${file.name}" வெற்றிகரமாக பதிவேற்றப்பட்டது। ${
            file.type.includes('image')
              ? "இந்த மருத்துவ படத்தை பகுப்பாய்வு செய்ய நான் தயாராக உள்ளேன்."
              : "இந்த PDF ஆவணத்தை பகுப்பாய்வு செய்ய நான் தயாராக உள்ளேன்."
          } தயவுசெய்து உங்கள் கேள்வியை தட்டச்சு செய்யவும் அல்லது அதை பகுப்பாய்வு செய்ய என்னிடம் கேளுங்கள்.`,
          te: `✓ ఫైల్ "${file.name}" విజయవంతంగా అప్‌లోడ్ చేయబడింది। ${
            file.type.includes('image')
              ? "ఈ వైద్య చిత్రాన్ని విశ్లేషించడానికి నేను సిద్ధంగా ఉన్నాను."
              : "ఈ PDF పత్రాన్ని విశ్లేషించడానికి నేను సిద్ధంగా ఉన్నాను।"
          } దయచేసి మీ ప్రశ్నను టైప్ చేయండి లేదా దానిని విశ్లేషించమని నన్ను అడగండి.`,
          mr: `✓ फाईल "${file.name}" यशस्वीरित्या अपलोड झाली। ${
            file.type.includes('image')
              ? "मी या वैद्यकीय प्रतिमेचे विश्लेषण करण्यास तयार आहे."
              : "मी या PDF दस्तऐवजाचे विश्लेषण करण्यास तयार आहे."
          } कृपया तुमचा प्रश्न टाइप करा किंवा मला ते विश्लेषण करण्यास सांगा.`,
          bn: `✓ ফাইল "${file.name}" সফলভাবে আপলোড হয়েছে। ${
            file.type.includes('image')
              ? "আমি এই চিকিৎসা ছবি বিশ্লেষণ করতে প্রস্তুত।"
              : "আমি এই PDF নথি বিশ্লেষণ করতে প্রস্তুত।"
          } অনুগ্রহ করে আপনার প্রশ্ন টাইপ করুন বা আমাকে এটি বিশ্লেষণ করতে বলুন।`,
          gu: `✓ ફાઇલ "${file.name}" સફળતાપૂર્વક અપલોડ થઈ ગઈ। ${
            file.type.includes('image')
              ? "હું આ તબીબી છબીનું વિશ્લેષણ કરવા તૈયાર છું."
              : "હું આ PDF દસ્તાવેજનું વિશ્લેષણ કરવા તૈયાર છું."
          } કૃપા કરીને તમારો પ્રશ્ન ટાઇપ કરો અથવા મને તેનું વિશ્લેષણ કરવા કહો.`,
        };

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
            text: uploadMessages[selectedLanguage] || uploadMessages.en,
          },
        ]);
      };
      reader.readAsDataURL(file);
    }

    if (e.target) {
      e.target.value = '';
    }
  };

  const handleSend = async () => {
    if (!input.trim() && uploadedFiles.length === 0) return;

    const userMessageText = input;
    const userMessage: Message = {
      type: 'user',
      text: userMessageText,
      isFile: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
      let aiResponse = 'Sorry, I encountered an error. Please try again.';

      const greetings: Record<string, string> = {
        en: "👋 Hello! I'm your AI Medical Assistant. Upload a medical image or PDF document, then ask me to analyze it!",
        hi: "👋 नमस्ते! मैं आपका AI मेडिकल असिस्टेंट हूं। एक चिकित्सा छवि या PDF दस्तावेज़ अपलोड करें, फिर मुझे इसका विश्लेषण करने के लिए कहें!",
        kn: "👋 ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ವೈದ್ಯಕೀಯ ಸಹಾಯಕ. ವೈದ್ಯಕೀಯ ಚಿತ್ರ ಅಥವಾ PDF ದಾಖಲೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ, ನಂತರ ಅದನ್ನು ವಿಶ್ಲೇಷಿಸಲು ನನಗೆ ಹೇಳಿ!",
        ta: "👋 வணக்கம்! நான் உங்கள் AI மருத்துவ உதவியாளர். மருத்துவ படம் அல்லது PDF ஆவணத்தை பதிவேற்றவும், பின்னர் அதை பகுப்பாய்வு செய்ய என்னிடம் கேளுங்கள்!",
        te: "👋 నమస్కారం! నేను మీ AI వైద్య సహాయకుడిని. వైద్య చిత్రం లేదా PDF పత్రాన్ని అప్‌లోడ్ చేయండి, ఆపై దానిని విశ్లేషించమని నన్ను అడగండి!",
        mr: "👋 नमस्कार! मी तुमचा AI वैद्यकीय सहाय्यक आहे. एक वैद्यकीय प्रतिमा किंवा PDF दस्तऐवज अपलोड करा, नंतर मला ते विश्लेषण करण्यास सांगा!",
        bn: "👋 নমস্কার! আমি আপনার AI চিকিৎসা সহায়ক। একটি চিকিৎসা ছবি বা PDF নথি আপলোড করুন, তারপর আমাকে এটি বিশ্লেষণ করতে বলুন!",
        gu: "👋 નમસ્તે! હું તમારો AI તબીબી સહાયક છું. તબીબી છબી અથવા PDF દસ્તાવેજ અપલોડ કરો, પછી મને તેનું વિશ્લેષણ કરવા કહો!",
      };

      const lowerInput = userMessageText.toLowerCase();
      if (
        !uploadedFiles.length &&
        lowerInput.match(
          /^(hi|hello|hey|good morning|good afternoon|good evening|greetings|namaste|नमस्ते|ನಮಸ್ಕಾರ|வணக்கம்|నమస్కారం|નમસ્તે)$/i
        )
      ) {
        aiResponse = greetings[selectedLanguage] || greetings.en;
        setMessages(prev => [...prev, { type: 'ai', text: aiResponse }]);
        return;
      }

      try {
        const languageInstruction = getLanguageInstruction(selectedLanguage);
        const messageWithLanguage = userMessageText + languageInstruction;

        if (uploadedFiles.length > 0) {
          const file = uploadedFiles[0];
          if (file.type.startsWith('image/')) {
            const result = await diagnoseImageAction({
              photoDataUri: file.dataUri,
              message: messageWithLanguage
            });
            if (result.error) throw new Error(result.error);
            aiResponse = result.response || aiResponse;
          } else if (file.type === 'application/pdf') {
            const summaryResult = await generateSummaryAction({
              fileDataUri: file.dataUri,
              fileType: file.type
            });
            if (summaryResult.error) throw new Error(summaryResult.error);
            const documentContent = summaryResult.summary || 'Could not process PDF content.';
            
            const chatResult = await chatAction({
              documentContent,
              message: messageWithLanguage
            });
            if (chatResult.error) throw new Error(chatResult.error);
            aiResponse = chatResult.response || aiResponse;
          }
        } else {
          const result = await chatAction({
            documentContent: 'No document provided',
            message: messageWithLanguage
          });
          if (result.error) throw new Error(result.error);
          aiResponse = result.response || aiResponse;
        }
      } catch (error: any) {
        console.error('Error processing request:', error);
        const errorMessages: Record<string, string> = {
          en: `Sorry, I encountered an error: ${error.message}`,
          hi: `क्षमा करें, मुझे एक त्रुटि का सामना करना पड़ा: ${error.message}`,
          kn: `ಕ್ಷಮಿಸಿ, ನನಗೆ ದೋಷ ಎದುರಾಗಿದೆ: ${error.message}`,
          ta: `மன்னிக்கவும், எனக்கு பிழை ஏற்பட்டது: ${error.message}`,
          te: `క్షమించండి, నాకు లోపం ఎదురైంది: ${error.message}`,
          mr: `माफ करा, मला एक त्रुटी आली: ${error.message}`,
          bn: `দুঃখিত, আমি একটি ত্রুটির সম্মুখীন হয়েছি: ${error.message}`,
          gu: `માફ કરશો, મને ભૂલ આવી: ${error.message}`,
        };
        aiResponse = errorMessages[selectedLanguage] || errorMessages.en;
      }

      setMessages(prev => [...prev, { type: 'ai', text: aiResponse }]);
      setUploadedFiles([]);
    });
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  const placeholders: Record<string, string> = {
    en: 'Ask about your medical documents...',
    hi: 'अपने चिकित्सा दस्तावेज़ों के बारे में पूछें...',
    kn: 'ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ...',
    ta: 'உங்கள் மருத்துவ ஆவணங்களைப் பற்றி கேளுங்கள்...',
    te: 'మీ వైద్య పత్రాల గురించి అడగండి...',
    mr: 'तुमच्या वैद्यकीय कागदपत्रांबद्दल विचारा...',
    bn: 'আপনার চিকিৎসা নথি সম্পর্কে জিজ্ঞাসা করুন...',
    gu: 'તમારા તબીબી દસ્તાવેજો વિશે પૂછો...',
  };

  const emptyStateMessages: Record<string, { title: string; subtitle: string }> = {
    en: {
      title: 'Upload a medical document to begin',
      subtitle: "I'll analyze it and answer your questions"
    },
    hi: {
      title: 'शुरू करने के लिए एक चिकित्सा दस्तावेज़ अपलोड करें',
      subtitle: 'मैं इसका विश्लेषण करूंगा और आपके प्रश्नों का उत्तर दूंगा'
    },
    kn: {
      title: 'ಪ್ರಾರಂಭಿಸಲು ವೈದ್ಯಕೀಯ ದಾಖಲೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      subtitle: 'ನಾನು ಅದನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತೇನೆ ಮತ್ತು ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸುತ್ತೇನೆ'
    },
    ta: {
      title: 'தொடங்க மருத்துவ ஆவணத்தை பதிவேற்றவும்',
      subtitle: 'நான் அதை பகுப்பாய்வு செய்து உங்கள் கேள்விகளுக்கு பதிலளிப்பேன்'
    },
    te: {
      title: 'ప్రారంభించడానికి వైద్య పత్రాన్ని అప్‌లోడ్ చేయండి',
      subtitle: 'నేను దానిని విశ్లేషిస్తాను మరియు మీ ప్రశ్నలకు సమాధానం ఇస్తాను'
    },
    mr: {
      title: 'सुरुवात करण्यासाठी वैद्यकीय दस्तऐवज अपलोड करा',
      subtitle: 'मी त्याचे विश्लेषण करेन आणि तुमच्या प्रश्नांची उत्तरे देईन'
    },
    bn: {
      title: 'শুরু করতে একটি চিকিৎসা নথি আপলোড করুন',
      subtitle: 'আমি এটি বিশ্লেষণ করব এবং আপনার প্রশ্নের উত্তর দেব'
    },
    gu: {
      title: 'શરૂ કરવા માટે તબીબી દસ્તાવેજ અપલોડ કરો',
      subtitle: 'હું તેનું વિશ્લેષણ કરીશ અને તમારા પ્રશ્નોના જવાબ આપીશ'
    },
  };

  return (
    
    <Card className="shadow-lg">
      <CardContent className="p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between bg-accent/10 border border-accent/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-accent-foreground" />
            <span className="text-sm font-medium text-accent-foreground">Select Language:</span>
          </div>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="bg-accent/20 border border-dashed border-accent rounded-lg p-4">
            <p className="text-sm font-medium text-accent-foreground mb-3">📁 Uploaded Documents:</p>
            <div className="space-y-2">
              {uploadedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-background p-3 rounded-lg shadow-sm border">
                  <div className="flex items-center gap-3">
                    {file.type.includes('pdf') ? (
                      <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                    ) : (
                      <Image className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(idx)}
                    className="text-destructive h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border rounded-lg" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground text-lg font-medium">
                    {emptyStateMessages[selectedLanguage]?.title || emptyStateMessages.en.title}
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">
                    {emptyStateMessages[selectedLanguage]?.subtitle || emptyStateMessages.en.subtitle}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        msg.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border shadow-sm'
                      }`}
                    >
                      {msg.isFile && msg.file && (
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-current/20">
                          {msg.file.type.includes('pdf') ? (
                            <FileText className="w-4 h-4" />
                          ) : (
                            <Image className="w-4 h-4" />
                          )}
                          <span className="text-xs font-medium">Uploaded:</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isPending && (
                  <div className="flex justify-start">
                    <div className="bg-card border shadow-sm rounded-lg p-4">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 md:p-8 border-t">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*,.pdf"
          className="hidden"
        />
        <div className="flex gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
            className="shrink-0"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <Input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={placeholders[selectedLanguage] || placeholders.en}
            disabled={isPending}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isPending || (!input.trim() && uploadedFiles.length === 0)}
            className="shrink-0"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
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
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="font-headline text-2xl font-bold tracking-tighter sm:text-5xl md:text-3xl">
          AI Medical Assistant
        </h1>
        <p className="text-muted-foreground mt-2">
          Upload medical images or PDF reports for AI-powered analysis
        </p>
      </div>
      <AIChat />
    </div>
    </SidebarInset>
    </SidebarProvider>
  );
}