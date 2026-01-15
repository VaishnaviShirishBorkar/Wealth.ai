import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from 'react-markdown';

const FinancialAdvisor = () => {
  const { accountId } = useParams();
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  /* Auto initial advice */
  useEffect(() => {
    // sendMessage("Give me an overview of my finances.");
     fetchChat();
  }, []);

  const fetchChat = async () => {
  try {
    const res = await axios.get(
      `/api/account/${accountId}/advisor/chat`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setMessages(res.data.messages || []);
  } catch (err) {
    console.error("Failed to load chat", err);
  }
};

  // const sendMessage = async (text) => {
  //   if (!text.trim()) return;

  //   const updatedMessages = [
  //     ...messages,
  //     { role: "user", content: text }
  //   ];

  //   setMessages(updatedMessages);
  //   setInput("");
  //   setLoading(true);

  //   try {
  //     const res = await axios.post(
  //       `http://localhost:5001/api/account/${accountId}/advisor/chat`,
  //       {
  //         messages: updatedMessages
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       }
  //     );

  //     setMessages([
  //       ...updatedMessages,
  //       {
  //         role: "assistant",
  //         content: res.data.reply
  //       }
  //     ]);
  //   } catch (err) {
  //     console.error("Advisor failed", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const sendMessage = async (text) => {
  if (!text.trim()) return;

  setLoading(true);

  try {
    const res = await axios.post(
      `/api/account/${accountId}/advisor/chat`,
      {
        messages: [
          ...messages,
          { role: "user", content: text }
        ]
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setMessages(res.data.messages);
    setInput("");
  } catch (err) {
    console.error("Advisor failed", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-100 text-black">
      <div className="max-w-4xl mx-auto px-6 pt-28 pb-10">

        <h2 className="text-2xl font-bold mb-6">
          💡 Financial Advisor
        </h2>

        {/* Chat */}
        <div className="bg-white rounded-xl shadow p-6 mb-4 h-[520px] overflow-y-auto space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg max-w-[80%] leading-relaxed ${
                m.role === "user"
                  ? "ml-auto bg-blue-100 text-right"
                  : "mr-auto bg-gray-100"
              }`}
            >
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          ))}

          {loading && (
            <p className="text-gray-500 text-sm">
              Advisor is thinking...
            </p>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e =>
              e.key === "Enter" && sendMessage(input)
            }
            placeholder="Ask about savings, spending, goals..."
            className="flex-1 border px-4 py-2 rounded-lg"
          />
          <button
            onClick={() => sendMessage(input)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
};

export default FinancialAdvisor;
