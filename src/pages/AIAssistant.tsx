import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Lightbulb,
  FileText,
  CreditCard,
  TrendingUp
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  type?: 'suggestion' | 'analysis' | 'recommendation';
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant for creative funding. I can help you with application strategies, credit improvement tips, and funding opportunities. How can I assist you today?",
      sender: "ai",
      timestamp: new Date().toISOString(),
      type: "suggestion"
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickActions = [
    {
      title: "Application Tips",
      description: "Get advice on improving your application",
      icon: FileText,
      action: "Give me tips to improve my funding application"
    },
    {
      title: "Credit Improvement",
      description: "Learn how to boost your credit score",
      icon: CreditCard,
      action: "How can I improve my credit score?"
    },
    {
      title: "Funding Opportunities",
      description: "Find relevant funding opportunities",
      icon: TrendingUp,
      action: "What funding opportunities are available for my sector?"
    },
    {
      title: "Success Strategies",
      description: "Learn from successful applications",
      icon: Lightbulb,
      action: "What makes a funding application successful?"
    }
  ];

  const simulateAIResponse = (userMessage: string): string => {
    const responses: Record<string, string> = {
      "application": "Here are some key tips for your funding application:\n\n1. **Clear Project Description**: Be specific about your creative project and its impact\n2. **Detailed Budget**: Provide a comprehensive breakdown of how funds will be used\n3. **Market Research**: Show understanding of your target audience and competition\n4. **Timeline**: Include a realistic project timeline with milestones\n5. **Portfolio**: Showcase your previous work and achievements\n\nWould you like me to elaborate on any of these points?",
      
      "credit": "Here's how you can improve your credit score:\n\n1. **Pay Bills on Time**: Set up automatic payments to never miss due dates\n2. **Reduce Credit Utilization**: Keep usage below 30% of your credit limit\n3. **Keep Old Accounts Open**: Length of credit history matters\n4. **Monitor Your Report**: Check for errors and dispute them\n5. **Diversify Credit Types**: Mix of credit cards and loans can help\n\nYour current score of 720 is already very good! Focus on reducing utilization for the biggest impact.",
      
      "funding": "Based on your creative sector, here are relevant funding opportunities:\n\n**For Arts & Culture:**\n- Creative Industries Development Fund\n- Kenya Cultural Centre Grants\n- Youth Arts Initiative Program\n\n**For Digital Media:**\n- Digital Innovation Fund\n- Media Development Initiative\n- Creative Technology Grants\n\nWould you like specific details about any of these programs?",
      
      "successful": "Successful funding applications typically have these characteristics:\n\n1. **Strong Value Proposition**: Clear benefit to the community\n2. **Evidence-Based Approach**: Data supporting your project's need\n3. **Professional Presentation**: Well-structured and error-free\n4. **Realistic Goals**: Achievable objectives with measurable outcomes\n5. **Strong Team**: Demonstrable skills and experience\n6. **Sustainability Plan**: How the project continues after funding\n\nThe key is telling a compelling story while backing it up with solid facts and planning."
    };

    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('application') || lowerMessage.includes('tip')) {
      return responses.application;
    } else if (lowerMessage.includes('credit') || lowerMessage.includes('score')) {
      return responses.credit;
    } else if (lowerMessage.includes('funding') || lowerMessage.includes('opportunit')) {
      return responses.funding;
    } else if (lowerMessage.includes('successful') || lowerMessage.includes('strategy')) {
      return responses.successful;
    } else {
      return "I'm here to help with funding applications, credit improvement, and finding opportunities. Could you be more specific about what you'd like assistance with? You can use the quick action buttons below for common topics.";
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: simulateAIResponse(content),
        sender: "ai",
        timestamp: new Date().toISOString(),
        type: "recommendation"
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
          <p className="text-gray-600 mt-2">Get personalized advice for your creative funding journey</p>
        </div>

        {/* Chat Interface */}
        <div>
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-2 text-blue-600" />
                AI Assistant Chat
              </CardTitle>
              <CardDescription>
                    Ask questions about funding, applications, and credit improvement
                  </CardDescription>
                </CardHeader>

                {/* Messages Area */}
                <CardContent className="flex-1 overflow-y-auto p-0">
                  <div className="space-y-4 p-6">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start space-x-3 ${
                          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        <div className={`p-2 rounded-full ${
                          message.sender === 'user' ? 'bg-purple-100' : 'bg-blue-100'
                        }`}>
                          {message.sender === 'user' ? (
                            <User className="h-4 w-4 text-purple-600" />
                          ) : (
                            <Bot className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        
                        <div className={`max-w-[80%] ${
                          message.sender === 'user' ? 'text-right' : 'text-left'
                        }`}>
                          <div className={`inline-block p-3 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <div className="whitespace-pre-line text-sm">
                              {message.content}
                            </div>
                          </div>
                          
                          <div className="flex items-center mt-1 space-x-2">
                            <div className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                            {message.type && (
                              <Badge variant="outline" className="text-xs">
                                {message.type}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-full bg-blue-100">
                          <Bot className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>

                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about funding, applications, or credit..."
                      className="flex-1"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={() => handleSendMessage(inputMessage)}
                      disabled={!inputMessage.trim() || isTyping}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Press Enter to send, Shift+Enter for new line
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      );
    };

export default AIAssistant;
