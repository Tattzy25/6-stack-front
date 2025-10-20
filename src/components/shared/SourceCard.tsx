import { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { AskTaTTTy } from './AskTaTTTy';
import { SaveChip } from './SaveChip';
import { DiamondLoader } from './DiamondLoader';
import { sessionDataStore } from '../../services/submissionService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

const MIN_CHARACTERS = 50;

interface SourceCardProps {
  generatorType: 'freestyle' | 'couples' | 'coverup' | 'extend';
}

export function SourceCard({ generatorType }: SourceCardProps) {
  const { user } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inputTitle, setInputTitle] = useState('');
  const [questionTitle, setQuestionTitle] = useState('');
  const [showValidation, setShowValidation] = useState(false);
  
  // Focus tracking for Ask TaTTTy
  const [focusedField, setFocusedField] = useState<'q1' | 'q2' | null>(null);
  const [lastEditedField, setLastEditedField] = useState<'q1' | 'q2'>('q1');
  const [showLoader, setShowLoader] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  const q1Ref = useRef<HTMLTextAreaElement>(null);
  const q2Ref = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    // Show validation errors if fields are invalid
    if (!isValid) {
      setShowValidation(true);
      return;
    }

    // Store in session (NOT sent to backend yet)
    sessionDataStore.setSourceCardData(
      { 
        questionOne: inputTitle.trim(), 
        questionTwo: questionTitle.trim() 
      }, 
      user?.id
    );
    sessionDataStore.setGeneratorType(generatorType, user?.id);
    
    // Mark as submitted
    setIsSubmitted(true);
    setShowValidation(false);
  };

  // Check if each field meets minimum characters
  const isInputTitleValid = inputTitle.trim().length >= MIN_CHARACTERS;
  const isQuestionTitleValid = questionTitle.trim().length >= MIN_CHARACTERS;
  const isValid = isInputTitleValid && isQuestionTitleValid;

  // Generate error message based on which fields are invalid
  const getErrorMessage = () => {
    if (!isInputTitleValid && !isQuestionTitleValid) {
      return 'MIN 50 CHAR - Q1 & Q2';
    } else if (!isInputTitleValid) {
      return 'MIN 50 CHAR - Q1';
    } else if (!isQuestionTitleValid) {
      return 'MIN 50 CHAR - Q2';
    }
    return '';
  };

  // If content changes after submission, reset submitted state
  useEffect(() => {
    if (isSubmitted) {
      setIsSubmitted(false);
    }
  }, [inputTitle, questionTitle]);

  // Real-time streaming from AI
  const streamAIResponse = async (
    type: 'optimize' | 'ideas',
    field: 'q1' | 'q2',
    targetText: string,
    hasSelection: boolean,
    replaceSelection: boolean = false
  ) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/ai/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          contextType: 'tattty',
          targetField: field,
          targetText,
          hasSelection,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || `Stream failed: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      const setter = field === 'q1' ? setInputTitle : setQuestionTitle;
      const ref = field === 'q1' ? q1Ref : q2Ref;
      const currentValue = field === 'q1' ? inputTitle : questionTitle;
      
      let accumulatedText = '';
      
      // If replacing selection, preserve before/after text
      let beforeText = '';
      let afterText = '';
      if (replaceSelection && ref.current) {
        const { selectionStart, selectionEnd } = ref.current;
        beforeText = currentValue.substring(0, selectionStart);
        afterText = currentValue.substring(selectionEnd);
      } else {
        // Clear field for full replacement
        setter('');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.token) {
                accumulatedText += data.token;
                
                if (replaceSelection) {
                  setter(beforeText + accumulatedText + afterText);
                } else {
                  setter(accumulatedText);
                }
              }
              
              if (data.done) {
                return accumulatedText;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      return accumulatedText;
    } catch (error) {
      console.error('AI streaming error:', error);
      throw error;
    }
  };

  // Get current selection info for focused field
  const getSelectionInfo = (): { hasSelection: boolean; selectedText: string; field: 'q1' | 'q2' | null } => {
    const activeRef = focusedField === 'q1' ? q1Ref : focusedField === 'q2' ? q2Ref : null;
    
    if (!activeRef?.current) {
      return { hasSelection: false, selectedText: '', field: null };
    }

    const { selectionStart, selectionEnd, value } = activeRef.current;
    const hasSelection = selectionStart !== selectionEnd;
    const selectedText = hasSelection ? value.substring(selectionStart, selectionEnd) : '';

    return { hasSelection, selectedText, field: focusedField };
  };

  // Replace selection or full text in a field
  const replaceText = (field: 'q1' | 'q2', newText: string, replaceSelection: boolean = false) => {
    const ref = field === 'q1' ? q1Ref : q2Ref;
    const setter = field === 'q1' ? setInputTitle : setQuestionTitle;
    const currentValue = field === 'q1' ? inputTitle : questionTitle;

    if (replaceSelection && ref.current) {
      const { selectionStart, selectionEnd } = ref.current;
      const before = currentValue.substring(0, selectionStart);
      const after = currentValue.substring(selectionEnd);
      setter(before + newText + after);
    } else {
      setter(newText);
    }
  };

  // Handle "Optimize My Text"
  const handleOptimize = async () => {
    // Clear previous errors
    setAiError(null);

    // Prevent rapid clicks
    if (showLoader) {
      setAiError('Hold up! Still working...');
      return;
    }

    const { hasSelection, selectedText, field } = getSelectionInfo();
    
    // Determine target field
    const targetField = field || lastEditedField;
    const targetText = hasSelection 
      ? selectedText 
      : (targetField === 'q1' ? inputTitle : questionTitle);

    // ERROR 1: No text at all
    if (!targetText || !targetText.trim()) {
      if (inputTitle.trim() === '' && questionTitle.trim() === '') {
        setAiError('Both fields empty. Write something first!');
      } else if (hasSelection) {
        setAiError('Selection empty. Highlight actual text!');
      } else {
        setAiError(`Q${targetField === 'q1' ? '1' : '2'} empty. Write something first!`);
      }
      return;
    }

    // ERROR 2: Text too short (less than 10 chars)
    if (targetText.trim().length < 10) {
      setAiError('Too short! Need at least 10 characters.');
      return;
    }

    // ERROR 3: Only whitespace selected
    if (hasSelection && selectedText.trim() === '') {
      setAiError('Only whitespace selected. Highlight real text!');
      return;
    }

    // Show loader and stream AI response
    setShowLoader(true);

    try {
      await streamAIResponse('optimize', targetField, targetText, hasSelection, hasSelection);
      setShowLoader(false);
      setAiError(null);
    } catch (error) {
      setShowLoader(false);
      
      // Check if it's an API configuration error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('GROQ_API_KEY') || errorMessage.includes('not configured')) {
        setAiError('AI not configured. Check backend API key.');
      } else if (errorMessage.includes('Stream failed')) {
        setAiError('Connection failed. Check backend server.');
      } else {
        setAiError('AI error. Try again or check logs.');
      }
      console.error('Optimize error:', error);
    }
  };

  // Handle "Give Me Ideas"
  const handleIdeas = async () => {
    // Clear previous errors
    setAiError(null);

    // Prevent rapid clicks
    if (showLoader) {
      setAiError('Patience! Still working...');
      return;
    }

    const targetField = focusedField || lastEditedField;

    // ERROR: No field context (edge case)
    if (!targetField) {
      setAiError('Click on a field first!');
      return;
    }

    // Show loader and stream AI response
    setShowLoader(true);
    
    try {
      await streamAIResponse('ideas', targetField, '', false, false);
      setShowLoader(false);
      setAiError(null);
    } catch (error) {
      setShowLoader(false);
      
      // Check if it's an API configuration error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('GROQ_API_KEY') || errorMessage.includes('not configured')) {
        setAiError('AI not configured. Check backend API key.');
      } else if (errorMessage.includes('Stream failed')) {
        setAiError('Connection failed. Check backend server.');
      } else {
        setAiError('AI error. Try again or check logs.');
      }
      console.error('Ideas generation error:', error);
    }
  };

  return (
    <Card className="relative overflow-hidden border-2 border-accent/20" style={{
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
      borderRadius: '70px',
      minHeight: '600px',
      boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
    }}>
      <CardContent className="p-4 md:p-6 flex flex-col h-full">
        <div className="flex flex-col pt-[20px] pr-[0px] pb-[0px] pl-[0px] flex-1">
          <label className="block text-white px-2 mt-[0px] mr-[0px] mb-[8px] ml-[0px] font-[Roboto_Condensed] font-bold font-normal not-italic text-[24px]" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
            Input Title
          </label>
          <div className="relative">
            <textarea 
              ref={q1Ref}
              value={inputTitle}
              onChange={(e) => {
                setInputTitle(e.target.value);
                setLastEditedField('q1');
              }}
              onFocus={() => setFocusedField('q1')}
              onBlur={() => setFocusedField(null)}
              disabled={showLoader}
              className="w-full px-4 py-2 bg-transparent border border-accent/30 rounded-2xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 transition-colors resize-y disabled:opacity-50"
              placeholder="Enter text..."
              style={{ minHeight: '200px' }}
            />
            {showLoader && focusedField === 'q1' && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-2xl">
                <DiamondLoader size={60} scale={0.7} />
              </div>
            )}
          </div>
          
          <div className="mt-[32px] mr-[0px] mb-[0px] ml-[0px]">
            <label className="block text-white mb-2 px-2 font-[Roboto_Condensed] text-[24px]" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
              Question or Title
            </label>
            <div className="relative">
              <textarea 
                ref={q2Ref}
                value={questionTitle}
                onChange={(e) => {
                  setQuestionTitle(e.target.value);
                  setLastEditedField('q2');
                }}
                onFocus={() => setFocusedField('q2')}
                onBlur={() => setFocusedField(null)}
                disabled={showLoader}
                className="w-full px-4 py-2 bg-transparent border border-accent/30 rounded-2xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 transition-colors resize-y disabled:opacity-50"
                placeholder="Enter text..."
                style={{ minHeight: '200px' }}
              />
              {showLoader && focusedField === 'q2' && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-2xl">
                  <DiamondLoader size={60} scale={0.7} />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Ask TaTTTy Button - Bottom of Card */}
        <div className="flex justify-center items-center py-4 mt-4">
          <AskTaTTTy 
            contextType="tattty"
            size="md"
            onOptimize={handleOptimize}
            onIdeas={handleIdeas}
            error={aiError}
            isLoading={showLoader}
          />
        </div>
        
        {/* Submit Chip - Below Ask Button */}
        <div className="flex justify-center items-center pb-2">
          <SaveChip 
            onSubmit={handleSubmit}
            isSubmitted={isSubmitted}
            isValid={isValid}
            errorMessage={getErrorMessage()}
          />
        </div>
      </CardContent>
    </Card>
  );
}
