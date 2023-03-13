import { Chat } from "@/components/Chat/Chat";
// import { Navbar } from "@/components/Layout/Navbar";
import { Sidebar } from "../components/Chat/Layout/Sidebar";
import { Message } from "@/types";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (message: Message) => {
    const updatedMessages = [...messages, message];

    setMessages(updatedMessages);
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: updatedMessages
      })
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    const data = response.body;

    if (!data) {
      return;
    }

    setLoading(false);

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let isFirst = true;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      if (isFirst) {
        isFirst = false;
        setMessages((messages) => [
          ...messages,
          {
            role: "assistant",
            content: chunkValue
          }
        ]);
      } else {
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const updatedMessage = {
            ...lastMessage,
            content: lastMessage.content + chunkValue
          };
          return [...messages.slice(0, -1), updatedMessage];
        });
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Hi there! I'm Ben, your AI friend. You can think about me just as your friends IRL!`
      }
    ]);
  }, []);

  return (
    <>
      <Head>
        <title>AI Friend</title>
        <meta
          name="description"
          content="your virtual friend"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      <div className="flex flex-col h-screen">
        {/* <Navbar /> */}
        <div className="flex justify-end w-full px-6 py-4">
          <button
            className="w-12 h-12 p-3 transition-all duration-300 ease-in-out bg-gray-100 rounded-full hover:bg-gray-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path
                fillRule="evenodd"
                d="M2.25 12C2.25 11.5858 2.58579 11.25 3 11.25H21C21.4142 11.25 21.75 11.5858 21.75 12C21.75 12.4142 21.4142 12.75 21 12.75H3C2.58579 12.75 2.25 12.4142 2.25 12ZM2.25 7.5C2.25 7.08579 2.58579 6.75 3 6.75H21C21.4142 6.75 21.75 7.08579 21.75 7.5C21.75 7.91421 21.4142 8.25 21 8.25H3C2.58579 8.25 2.25 7.91421 2.25 7.5ZM21 16.5C21.4142 16.5 21.75 16.8358 21.75 17.25C21.75 17.6642 21.4142 18
      994.75 18H3C2.58579 18 2.25 17.6642 2.25 17.25C2.25 16.8358 2.58579 16.5 3 16.5H21Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>


        <div className={`absolute h-screen w-1/2 md:w-1/5 bg-white transform z-50 ${isOpen ? "translate-x-0 ease-out" : "-translate-x-full ease-in"
          } transition-all duration-300`}>
          {isOpen && <Sidebar />}
        </div>

        <div className="flex-1 pb-4 overflow-auto sm:px-10 sm:pb-10">
          <div className="max-w-[800px] mx-auto mt-4 sm:mt-12">
            <Chat
              messages={messages}
              loading={loading}
              onSend={handleSend}
            />
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </>
  );
}
