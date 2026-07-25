'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AppShell } from '@/shared/components/layout/app-shell';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { apiClient } from '@/shared/services/api-client';
import {
  Bot,
  Send,
  User,
  Sparkles,
  FileText,
  BarChart3,
  Network,
  Lightbulb,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import clsx from 'clsx';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  evidence?: string[];
  confidence?: number;
}

const SUGGESTED_QUERIES = [
  { icon: <FileText className="h-3.5 w-3.5" />, text: 'Show robbery trends in Bengaluru this year' },
  { icon: <Network className="h-3.5 w-3.5" />, text: 'Identify repeat offenders in NDPS cases' },
  { icon: <BarChart3 className="h-3.5 w-3.5" />, text: 'Which districts have highest crime rates?' },
  { icon: <Lightbulb className="h-3.5 w-3.5" />, text: 'Predict high-risk areas for next month' },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content:
      'Namaskara! I am ShadowProtocol AI, your crime intelligence assistant. I can help you analyze FIR records, identify criminal patterns, perform network analysis, and answer questions about Karnataka Police cases. What would you like to explore?',
    timestamp: new Date(),
    confidence: 1.0,
  },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const createConversation = async (): Promise<string> => {
    if (conversationId) return conversationId;

    try {
      const response = await apiClient.post<{ conversation_id: string }>('/ai/conversations');
      const newConversationId = response.data.conversation_id;
      setConversationId(newConversationId);
      return newConversationId;
    } catch (error) {
      throw new Error('Unable to create AI conversation.');
    }
  };

  const sendMessage = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const convoId = await createConversation();
      const response = await apiClient.post('/ai/chat', {
        query: userText,
        conversation_id: convoId,
        language: 'en',
        include_evidence: true,
      });

      const data = response.data as {
        response: string;
        confidence: number;
        evidence?: string[];
        followup_suggestions?: string[];
      };

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        evidence: data.evidence,
        confidence: data.confidence,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'Unable to process your request. The AI service is currently unavailable. Please try again in a moment.',
        timestamp: new Date(),
        confidence: 0,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-700 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">AI Crime Intelligence Assistant</h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs text-muted-foreground">Online · GPT-4 powered · RAG enabled</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            onClick={clearConversation}
          >
            New Chat
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-4 pr-1 pb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={clsx(
                'flex gap-3 animate-slide-up',
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              {/* Avatar */}
              <div
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1',
                  msg.role === 'user'
                    ? 'bg-primary-700'
                    : 'bg-slate-900 border border-white/10'
                )}
              >
                {msg.role === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-blue-400" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={clsx(
                  'max-w-[75%] rounded-2xl px-4 py-3',
                  msg.role === 'user'
                    ? 'bg-primary-700 text-white rounded-tr-sm'
                    : 'bg-white border border-border shadow-sm rounded-tl-sm'
                )}
              >
                <p
                  className={clsx(
                    'text-sm leading-relaxed',
                    msg.role === 'user' ? 'text-white' : 'text-foreground'
                  )}
                >
                  {msg.content}
                </p>

                {/* Evidence */}
                {msg.evidence && msg.evidence.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Evidence Sources
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.evidence.map((e, i) => (
                        <Badge key={i} variant="info" className="text-xs">
                          {e}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confidence + actions */}
                {msg.role === 'assistant' && msg.confidence !== undefined && (
                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-amber-500" />
                      <span className="text-xs text-muted-foreground">
                        {Math.round(msg.confidence * 100)}% confidence
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground">
                        <Copy className="h-3 w-3" />
                      </button>
                      <button className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-emerald-600">
                        <ThumbsUp className="h-3 w-3" />
                      </button>
                      <button className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-red-600">
                        <ThumbsDown className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}

                <p
                  className={clsx(
                    'text-xs mt-2',
                    msg.role === 'user' ? 'text-white/60' : 'text-muted-foreground'
                  )}
                >
                  {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-blue-400" />
              </div>
              <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested queries */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {SUGGESTED_QUERIES.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q.text)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-primary-50 hover:text-primary-700 border border-border hover:border-primary-200 rounded-full text-xs text-secondary font-medium transition-all duration-150"
              >
                {q.icon}
                {q.text}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="bg-white border border-border rounded-xl shadow-md p-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about crimes, suspects, patterns... (Enter to send)"
              className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[24px]"
              style={{ height: '24px' }}
            />
            <Button
              size="sm"
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              leftIcon={isTyping ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            >
              Send
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            AI responses are based on the Karnataka Police FIR database. Always verify before action.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
