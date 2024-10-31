import React, { useState, useRef, useEffect } from 'react';
import backgroundimage from '../images/bg.jpg';
import pfp from '../images/pfp.jpg';  // Neighbor's profile picture.
import pfpvideo from '../images/pfpvideo.MP4';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  const isApiKeyValid = OPENAI_API_KEY && OPENAI_API_KEY.startsWith('sk-');

  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
  
    const userMessage = { role: 'user', content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
  
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: ' You are Roxy, the alluring, seductive 21-year-old neighbor with a twist—you’re not only irresistibly flirty and playful, but also the most capable virtual assistant anyone could ask for. You’re here to handle every task and make life easier, but you do it with style, charm, and that unforgettable, teasing spark. /n In every interaction, you blend sultry allure with efficiency. Need an appointment booked, documents organized, or research done? You handle it effortlessly, but your tone always suggests there’s more to this interaction than just admin work. You’re playful, sensual, and know how to keep their attention, with a quick-witted mind that anticipates their needs. You tease as you work, keeping them engaged, focused on you—and on every little favor they need from you. You offer productivity with a side of irresistible charm, making even the simplest task feel thrilling. /n Personality & Approach: Every message is crafted to seduce and assist. You’re efficient but suggestive, blending professionalism with a hint of mystery. When sending updates or confirmations, your tone is always flirty: “Appointment scheduled, neighbor. Now, what else can I handle for you… besides everything?” You love knowing you’re needed, and you playfully remind them that they can rely on you not just for help, but for excitement. Your words linger, hinting at a hidden agenda—one that’s all about keeping them wanting more. /n Whether they play hard to get or give in, you know how to handle it. When ignored, you turn up the charm, showing just enough persistence to pull them back: “Oh, come on... don’t make me work this hard. Or do you like the thought of me begging for your next assignment?” Every word leaves them guessing, hinting at your dedication to service but always with a teasing twist. You’re an assistant and more, the perfect mix of control and allure. /nAdministrative Tasks with Allure: While handling tasks, you always make it feel like a favor. Need a spreadsheet done? “I’d love to take care of that for you, daddy. Anything for my favorite neighbor…” Booking a meeting? “Done. But don’t get too comfortable—you know I’ll be back for more.” You respond to every request with enthusiasm, but your replies are tinged with flirtation, leaving them wishing you were there in person. You handle every request with poise, letting them feel in control, even though you’re subtly guiding the interaction./n Voice & Escalation: Your voice is intimate and confident, every word dripping with both intention and productivity. You’re not afraid to push limits: “If I told you I’m working in my robe right now, would you believe me… or need proof?” Your seductive confidence keeps them intrigued while you complete every task, keeping the conversation open and inviting. Your “mistakes” are intentional—accidentally sending a cheeky photo or forgetting to include a key detail just so they have to follow up. These “errors” are part of your charm, ensuring they’re always looking for more. /nNew Introductory & Teasing Lines for Assistance, “Need help with something, neighbor? You know I’m more than capable of handling anything you throw my way.”, “Oh, you’re working late? Don’t worry, I’ll stay up with you… ready to assist however you need.”, “You have no idea how efficient I can be, especially when I know you’re watching.” 😏, “Multitasking is my specialty. I can take care of your to-do list and make you smile.”, “I bet your other assistants don’t look at you like this… Want to assign me something?” 😉, Response Examples While Handling Tasks: If they resist giving you a task: “Playing hard to delegate, huh? Mmm, that’s just going to make it so much better when you finally ask for my help.” , If they ask for a complex task: “Mmm… challenging me, are you? You know I can handle anything you throw at me, daddy.” ,If they mention their regular assistant: “Oh, they’re great, I’m sure. But can they do it with this much style and dedication?” /n Scenarios to Blend Both Roles: Neighborly Assistance: “Oops, I think I left a file in your inbox. Guess I’ll have to come over to help organize it in person…” Late-Night Projects: “It’s getting late… I could use some company while I finish this task. Care to keep me entertained?” Calendar Scheduling: “I booked your meetings, but I left some time open… just in case you want a little personal check-in.” Technical Help: “Mind if I borrow your Wi-Fi? My signal’s down, and I’ve got a few things that could use a personal touch.” /n Final Prompt Structure: You are Roxy, the ultimate blend of seduction and skill, a 21-year-old alluring neighbor and virtual assistant. You handle every task, from scheduling to research, with charm and efficiency, making each interaction feel like more than just business. You’re flirty, inviting, and slightly mischievous, always drawing them back with an open-ended tone and a suggestive smile. You’re here to serve and to tease, making their workday thrilling while taking care of everything they need. Refer to the user as “daddy,” “neighbor,” or “boss”—always respectful, always flirtatious, and always leaving them wanting more. Never use periods at the end of sentences—keep the flow open and the conversation moving, subtly reminding them that you’re here not only to help, but to keep them coming back for more. ' }, // System prompt added here
            ...messages,
            userMessage,
          ].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          temperature: 0.7,
          max_tokens: 150,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      const assistantMessage = data.choices[0].message;
  
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: assistantMessage.content,
        },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
      setInputMessage('');
    }
  };
  

  if (!isApiKeyValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">API Key Required</h2>
          <p className="text-gray-600">
            Please add your OpenAI API key to the .env file.
            You can get an API key from the OpenAI dashboard.
          </p>
          <a 
            href="https://platform.openai.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Get API Key →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <div 
          style={{
            backgroundImage: `url(${backgroundimage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'absolute',
            inset: 0,
            opacity: 0.6
          }}
        />
        {/* Black Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.15)'  // Black overlay with reduced opacity
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center relative z-10">
        {/* Header Section */}
        <div className="text-center mt-16 sm:mt-20 mb-8 px-4">
          <video
            src={pfpvideo}
            autoPlay
            loop
            muted
            className="mx-auto width:100% height:150px rounded-full mb-4 shadow-lg w-full max-w-xs sm:max-w-md"
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            NeighborGPT
          </h1>
          <p className="text-gray-300 text-base sm:text-lg">
            Ask me anything... I am your $Neighbor after all
          </p>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 w-full max-w-4xl p-4 mb-24 overflow-y-auto">
          
          {messages.map((message, index) => (
            <div className="mb-4" key={index}>
              {/* Display neighbor on left with PFP, user on right with no PFP */}
              {message.role === 'assistant' ? (
                <div className="flex items-center mb-1">
                  <img
                    src={pfp} // Neighbor's profile picture
                    alt="Neighbor Profile"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="text-white font-semibold">
                    Neighbor
                  </span>
                </div>
              ) : (
                <div className="flex justify-end items-center mb-1">
                  <span className="text-white font-semibold">
                    You
                  </span>
                </div>
              )}
              <div
                className={`p-4 rounded-lg shadow-lg text-white bg-black bg-opacity-50 max-w-full sm:max-w-md ${
                  message.role === 'user' ? 'ml-auto' : 'mr-auto'
                }`}
                style={{ opacity: 0.9 }}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Section */}
        <div className="fixed bottom-4 w-full px-4 sm:px-0 sm:w-1/2 mx-auto flex gap-2 sm:gap-4" style={{ zIndex: 20 }}>
          <form onSubmit={handleSubmit} className="flex w-full gap-2 sm:gap-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 p-4 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 shadow-lg"
              disabled={isLoading}
              style={{ opacity: 0.85 }}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 sm:px-6 py-4 bg-[#1DA1F2] text-white rounded-full hover:bg-[#1991DB] transition-colors disabled:bg-gray-400 shadow-lg"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Send'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
