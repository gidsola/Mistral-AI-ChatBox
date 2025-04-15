'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/sidebar/Sidebar.js';
// import Canvas from './components/canvas/Canvas.js';
import SettingsPage from './components/settings/Settings.js';
import { HistoryProvider, useHistory } from './components/history/HistoryContext.js';
import { HistoryCompletion, getOCR } from './helpers/request_handler.mjs';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import renderMathInElement from 'katex/dist/contrib/auto-render.mjs';
import 'katex/dist/katex.mjs';
import 'katex/dist/katex.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

function ChatBox() {

  const
    minimizeButtonRef = useRef(null),
    maximizeButtonRef = useRef(null),
    closeButtonRef = useRef(null),
    historyDivRef = useRef(null),
    // canvasRef = useRef(null),

    inputFieldRef = useRef(null),
    messageContentRefs = useRef([]),

    { history, dispatch } = useHistory(),
    [input, setInput] = useState(''),

    [username, setUsername] = useState(''),
    [aiName, setAiName] = useState(''),
    [userPfp, setUserPfp] = useState(null),
    [aiPfp, setAiPfp] = useState(null),
    [gradientColors, setGradientColors] = useState([
      "#ff0000",
      "#00ff00",
      "#0000ff"
    ]),
    [isLoaded, setIsLoaded] = useState(false),

    [thinking, setThinking] = useState(false),
    [showSettings, setShowSettings] = useState(false);

  const handleSubmit = async () => {
    if (!input || input.trim() === '') return;

    const date = new Date().toLocaleString();
    dispatch({ type: 'ADD_MESSAGE', payload: { content: input, date: date, type: 'user' } });
    setInput('');
    inputFieldRef.current.focus();
    setThinking(true);

    const response = await HistoryCompletion(input, /*username,*/ history);
    dispatch({ type: 'ADD_MESSAGE', payload: { content: response, date: new Date().toLocaleString(), type: 'assistant' } });
    setThinking(false);
  };

  useEffect(() => {
    messageContentRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.innerHTML = DOMPurify.sanitize(marked.parse(history[index].content).trim());
      }
    });

    renderMathInElement(document.body, {
      throwOnError: false,
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: false },
        { left: "\\left(", right: "\\right)", display: false },
        { left: "\\left[", right: "\\right]", display: true },
        { left: "\\left{", right: "\\right}", display: false },
        { left: "\\begin{math}", right: "\\end{math}", display: false },
        { left: "\\begin{pmatrix}", right: "\\end{pmatrix}", display: true },
        { left: "\\begin{equation}", right: "\\end{equation}", display: true },
        { left: "\\begin{align}", right: "\\end{align}", display: false },
        { left: "\\begin{align*}", right: "\\end{align*}", display: true },
        { left: "\\begin{aligned}", right: "\\end{aligned}", display: false },
        { left: "\\begin{alignat}", right: "\\end{alignat}", display: false },
        { left: "\\begin{gather}", right: "\\end{gather}", display: true },
        { left: "\\begin{CD}", right: "\\end{CD}", display: true },
        { left: "\\cdot", right: "\\cdot", display: true },
      ]
    });

    const codeBlocks = document.querySelectorAll('code');
    codeBlocks.forEach(codeBlock => {
      hljs.highlightElement(codeBlock);
      if (!codeBlock.parentNode.querySelector('.copy-button')) {
        // if (codeBlock.innerText.length > 1000) return;
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '📋';

        copyButton.addEventListener('click', () => {
          navigator.clipboard.writeText(codeBlock.innerText).then(() => {
            copyButton.innerHTML = '✔️ Copied!';
            setTimeout(() => {
              copyButton.innerHTML = '📋';
            }, 2000);
          });
        });

        codeBlock.parentNode.appendChild(copyButton);
      }
    });

    const historyDiv = historyDivRef.current;
    if (historyDiv) {
      historyDiv.scrollTo({
        top: historyDiv.scrollHeight,
        behavior: 'smooth'
      });
    };

  }, [history]);

  useEffect(() => {
    const
      minimizeButton = minimizeButtonRef.current,
      maximizeButton = maximizeButtonRef.current,
      closeButton = closeButtonRef.current,

      handleMinimize = () => {
        window.processBridge.minimize();
      },
      handleMaximize = () => {
        window.processBridge.maximize();
      },
      handleClose = () => {
        window.processBridge.close();
      };

    minimizeButton.addEventListener('click', handleMinimize);
    maximizeButton.addEventListener('click', handleMaximize);
    closeButton.addEventListener('click', handleClose);

    if (inputFieldRef.current) {
      inputFieldRef.current.focus();
    }

    return () => {
      minimizeButton.removeEventListener('click', handleMinimize);
      maximizeButton.removeEventListener('click', handleMaximize);
      closeButton.removeEventListener('click', handleClose);
    };
  }, []);

  useEffect(() => {
    if (!window.processBridge) return;
    (async function getem() {
      if (username == '')
        setUsername(await window.processBridge.getUsername());
      if (aiName == '')
        setAiName(await window.processBridge.getAiName());
    })();

    if (!window.processBridge) return;
    (async function getem() {
      // const username = await window.processBridge.getUsername();
      // const aiName = await window.processBridge.getAiName();
      if (userPfp == null)
        setUserPfp(await window.processBridge.getUserPfp());
      if (aiPfp == null)
        setAiPfp(await window.processBridge.getAiPfp());
    })();

    if (!window.processBridge) return;
    (async function getem() {
      if (isLoaded) return;
      setGradientColors(await window.processBridge.getTheme());
      setIsLoaded(true);
    })();
  }, [username, aiName, userPfp, aiPfp, gradientColors]);


  useEffect(() => {
    const textarea = inputFieldRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;

    // textarea.style.overflowY = 'hidden';
    // textarea.style.overflowY = 'auto';
    const historyDiv = historyDivRef.current;
    if (historyDiv) {
      historyDiv.scrollTo({
        top: historyDiv.scrollHeight,
        behavior: 'smooth'
      });
    };
  }, [input]);

  return (
    <div id="AppContainer" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: `linear-gradient(45deg,${gradientColors[0]}, ${gradientColors[1]}, ${gradientColors[2]})`
    }}>

      <div className="title-bar">
        <div className="icon" id="titlebarIcon"></div>
        <div className="title">Chat BoX</div>
        <div className="buttons">
          <button id="minimize" ref={minimizeButtonRef} > ﹁ </button>
          <button id="maximize" ref={maximizeButtonRef}>「」</button>
          <button id="close" ref={closeButtonRef}> χ </button>
        </div>
      </div>

      <div className="container">

        <Sidebar getOCR={getOCR} setShowSettings={setShowSettings} />

        <div className="chat-box">
          {/* <div className="canvas-container"> */}
          {/* <Canvas width={800} height={200} /> */}
          {/* </div> */}
          <div className="history" id="history" ref={historyDivRef}>
            {history.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.type}-message`}
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector('.pfp-static').style.display = 'none';
                  e.currentTarget.querySelector('.pfp-animated').style.display = 'block';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector('.pfp-static').style.display = 'block';
                  e.currentTarget.querySelector('.pfp-animated').style.display = 'none';
                }}
              >
                <div className="message-header">
                  <img
                    className="pfp pfp-static"
                    src={msg.type === 'user' ? userPfp : aiPfp}
                    alt={msg.type === 'user' ? 'User Pfp' : 'AI Pfp'}
                    style={{ display: 'block' }}
                  />
                  <img
                    className="pfp pfp-animated"
                    src={msg.type === 'user' ? userPfp : aiPfp}
                    alt={msg.type === 'user' ? 'User Pfp' : 'AI Pfp'}
                    style={{ display: 'none' }}
                  />
                  <div className="dateTime">
                    <span className={`${msg.type}-name`}>
                      {msg.type === 'user'
                        ? `${username}`
                        : `${aiName}`}
                    </span> @ {msg.date}
                  </div>
                </div>
                <div className="message-content">
                  <div ref={(el) => (messageContentRefs.current[index] = el)}>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="chat-box-footer">
            <div id="loadingBubble" style={{ display: thinking ? 'flex' : 'none' }}>
              <img
                className="pfp"
                src={aiPfp}
                alt={aiName}
              />
              <img className="pfp" src='/images/loaders/pink_dots.svg'></img>
            </div>
            <div className="bottomChatBar" id="bottomChatBar">

              {/* <button style={{backgroundColor: '#f5f5f5', border: 'none', marginLeft: '1em'}}>㊂</button> */}
              <textarea rows={1}
                popoverTarget='inputField'
                inputMode='text'
                autoFocus={true}
                className="textarea"
                id="inputField"
                placeholder="Begin by typing something. Try saying hello or introducing yourself."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(event) => {
                  if (thinking) return;
                  if (event.key === 'Enter' && event.shiftKey) {
                    event.preventDefault();
                    setInput(input + '\n');
                  }
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleSubmit();
                  }
                }}
                ref={inputFieldRef}
                style={{ resize: 'none' }}
              ></textarea>
              {/* <div type="button" className="emoji" onClick={() => setInput(input + '😊')}><span role="img" aria-label="smile">😊</span></div> */}
              <button className="submit-button" id="submitButton" onClick={handleSubmit}>Send</button>
            </div>
          </div>
        </div>
        {/* // chat box */}

      </div>
      {/* // container */}

      <div className="app-container-footer">
        <div className="made-by">made with <span className="heart">❤</span> by goodsie</div>
        {/* <div className="powered-by"><a href="https://onsocket.com" target="_blank">Powered by <span className="onsocket">OnSocket</span></a></div> */}
      </div>

      {showSettings && (
        <SettingsPage setShowSettings={setShowSettings} setUsername={setUsername} setAiName={setAiName} username={username} aiName={aiName} setUserPfp={setUserPfp} setAiPfp={setAiPfp} userPfp={userPfp} aiPfp={aiPfp} setGradientColors={setGradientColors} gradientColors={gradientColors} />
      )}

    </div>
    // app container
  );
};

export default function WrappedChatBox() {
  return (
    <HistoryProvider>
      <ChatBox />
    </HistoryProvider>
  );
};
