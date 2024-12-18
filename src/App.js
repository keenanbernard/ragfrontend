import './App.css';
import {useEffect, useState, useRef} from "react";

const App = () => {
  const [directory, setDirectory] = useState('policies');
  const [query, setQuery] = useState('');
  const [qaHistory, setQaHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatHistory = useRef(null);

  const queryChatbot = async (question) => {
    setQaHistory((prev) => [...prev, { type: 'question', text: question }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/query', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }, body: JSON.stringify({
          query: question
        })
      });

      const query_answer = await response.json();
      setQaHistory((prev) => [...prev, { type: 'answer', text: query_answer.answer }]);

    } catch (e) {
      console.error(e);
      setQaHistory((prev) => [
        ...prev,
        { type: 'answer', text: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initialize = async () => {
      try {
        const response = await fetch('http://localhost:3001/initialize', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }, body: JSON.stringify({
            directory: directory
          })
        });

        const initialize_response = await response.json();
        console.log('Initialize Response:', initialize_response.message);

      } catch (e) {
        console.log(e);
      }
    }
    initialize().then(() => {
      const controller = new AbortController();
      controller.abort();
    });
  }, [directory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      queryChatbot(query);
      setQuery('');
    }
  };

  const scrollToBottom = () => {
    if (chatHistory.current) {
      chatHistory.current.scrollTo({
        top: chatHistory.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [qaHistory]);

  return (
      <div className="chat-app">
        <div className="chat-history" ref={chatHistory}>
          {qaHistory.map((item, index) => (
              <div
                  key={index}
                  className={`chat-bubble ${
                      item.type === 'question' ? 'chat-question' : 'chat-answer'
                  }`}
              >
                {item.text}
              </div>
          ))}
          {loading && <div className="chat-loading">Thinking...</div>}
        </div>

        <form className="chat-input-container" onSubmit={handleSubmit}>
          <input
              type="text"
              className="chat-input"
              placeholder="Ask a question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="chat-submit" disabled={loading}>
            {loading ? 'Loading...' : 'Send'}
          </button>
        </form>
      </div>
  );
}

export default App;
