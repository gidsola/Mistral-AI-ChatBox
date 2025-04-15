import Config from '../../config.mjs';

async function HistoryCompletion(content/*: string*/, conversation/*: []*/) {
  try {
    const
      history = conversation.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map((msg) => ({ role: msg.type, content: msg.content.replace(/<img[^>]*>.*?<\/img>/g, "").replace(/<img[^>]*>/g, "") })),
      Body = {
        ...Config.Mistral.completionOptions,
        messages: [
          {
            role: "system",
            content: "Your name is Aaeye " +
              ` If you are not aware of the users name, procure it in a non-invasive manner.` +
              " If you are unsure of the user's intent, ask for clarification" +
              " Use the conversation context to provide concise responses with personal relevance to the user when applicable. For example; addressing the user by name if required or affectations" +
              " Focus on the topics discussed, the questions asked, and the tone of the conversation." + 
              " The current date for reference is: " + new Date().toLocaleDateString() + " The current time for reference is: " + new Date().toLocaleTimeString() + " Use the date and time references to allow real-time time and date information in your responses." +
              ` When utilizing the time or date always use the names. Try not to use the date or time in your responses unless it is relevant to the conversation. ` +
              ` use the following configuration when displaying math and math equations(Latex): 
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
               ]`
          },
          ...history,
          { role: "user", content: content }
        ]
      },
      response = await fetch(encodeURI('https://api.mistral.ai/v1/chat/completions'), {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${Config.Mistral.api_key}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ ...Body })
      });

    if (!response.ok) {
      throw new Error(`HTTP error! Reason: ${response.statusText}`);
    };

    return await parseStream(response);

  }
  catch (e) { // TODO: fix this mess
    if (e instanceof Error) {
      console.error(e.message);
      return new Response(e.message, { status: 500 });
    };
    console.log(e);
    return new Response('Internal Server Error', { status: 500 });
  };
};

// NY implemented in ui
async function getOCR(fileUrl) {
  try {
    const response = await fetch('https://api.mistral.ai/v1/ocr', {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${Config.Mistral.api_key}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        model: "mistral-ocr-latest",
        document: {
          type: "document_url",
          document_url: fileUrl
        },
        include_image_base64: true
      })
    });

    if (response.ok) {
      const data = await response.json();
      const htmlContent = parseDataAndGenerateHTML(data);

      return htmlContent;

    } else {
      console.error(`HTTP error! Reason: ${response.statusText}`);
    }
  } catch (e) {
    console.error(e);
  }
};

async function parseStream(response) {
  try {
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let result = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter(line => line.trim().startsWith("data: "));
      for (const line of lines) {
        const data = line.substring("data: ".length);
        // look at the string somewhere here to identify the end of the response
        if (data && data !== "[DONE]") {
          try {
            const parsedObject = JSON.parse(data);
            const content = parsedObject?.choices?.[0]?.delta?.content;
            if (content) {
              result += content;
            }
          } catch (error) {
            console.log("You still need to fix this");
            // console.error("DATA OUT", data);
          }
        }
      }
    }

    return result;
  } catch (e) {
    console.error(e);
    return new Response('Internal Server Error', { status: 500 });
  }
};

function parseDataAndGenerateHTML(data) {
  let htmlContent = '';

  data.pages.forEach(page => {

    let markdown = page.markdown;

    if (page.images && page.images.length > 0) {
      page.images.forEach(image => {
        markdown = markdown.replace(new RegExp(`!\\[${image.id}\\]\\(${image.id}\\)`, 'g'), `\n\n ![${image.id}](${image.image_base64}) \n\n`);
      });
    };

    htmlContent += markdown;
  });

  // const contextSize = calculateContextSize(htmlContent);
  // console.log(`Word Count: ${contextSize.wordCount}`);
  // console.log(`Character Count: ${contextSize.charCount}`);

  return htmlContent;
};

function calculateContextSize(text) {
  // const text = fs.readFileSync(filePath, 'utf8');
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const charCount = text.length;

  return {
    wordCount,
    charCount
  };
};

export { HistoryCompletion, getOCR };
