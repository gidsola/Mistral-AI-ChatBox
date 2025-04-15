import { useHistory } from '../history/HistoryContext';
import './sidebar-css.css';


export default function Sidebar({ getOCR, setShowSettings }) {
  const { history, dispatch } = useHistory();

  const doOCR = async (fileUrl) => {
    dispatch({ type: 'ADD_MESSAGE', payload: { content: "PDF INPUT", date: new Date().toLocaleString(), type: 'user' } });
    const response = await getOCR(fileUrl);
    dispatch({ type: 'ADD_MESSAGE', payload: { content: response, date: new Date().toLocaleString(), type: 'assistant' } });
  };


  const openFileDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        // console.log('Selected file:', file.name);
        const reader = new FileReader();
        reader.onload = async (event) => {
          const arrayBuffer = event.target.result;
          const blob = new Blob([arrayBuffer], { type: file.type });
          const fileUrl = URL.createObjectURL(blob);

          // console.log('Generated file URL:', { fileUrl });

          await doOCR({ fileUrl });
          URL.revokeObjectURL(fileUrl);
          // try {
          //   const response = await fetch('https://api.mistral.ai/v1/ocr', {
          //   method: 'POST',
          //   headers: {
          //     "Authorization": `Bearer ${Config.Mistral.api_key}`,
          //     "Content-Type": "application/json",
          //     "Accept": "application/json"
          //   },
          //   body: JSON.stringify({
          //     model: "mistral-ocr-latest",
          //     document: {
          //     type: "document_url",
          //     document_url: fileUrl
          //     },
          //     include_image_base64: true
          //   })
          //   });

          //   const result = await response.json();
          //   console.log('OCR Response:', result);
          // } catch (error) {
          //   console.error('Error during OCR request:', error);
          // } finally {
          //   URL.revokeObjectURL(fileUrl); // Clean up the URL object
          // }
        };
        reader.readAsArrayBuffer(file);
      }
    };
    input.click();
  };



  return (
    <div className="sidebar">
      <div>
        <button
          title="Clear History"
          onClick={() => dispatch({ type: 'CLEAR_HISTORY', payload: [] })}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <svg width="45" height="45" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1" fill="#000000">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path style={{ fill: '#dddddd' }} d="m 84,31 c 0,0 -28,16 -67,1 l 5,53 c 0,0 4,11 27,11 26,0 30,-11 30,-11 l 5,-54 z"></path>
              <path style={{ fill: '#bbbbbb', stroke: '#666666' }} d="m 79,82 c 0,0 -27,-25 -57,1 l 0,2 c 0,0 4,11 27,11 26,0 30,-11 30,-11 z"></path>
              <path style={{ fill: '#888888', stroke: '#444444', strokeWidth: 2 }} d="M 84 31 C 84 31 56 47 17 32 L 22 85 C 22 85 26 96 49 96 C 75 96 79 85 79 85 L 84 31 z M 27 40 L 28 40 C 32 41 32 45 32 45 L 36 82 C 36 82 36 86 33 85 C 30 84 30 80 30 80 L 26 44 C 26 44 25 40 27 40 z M 73 40 C 76 40 75 44 75 44 L 71 80 C 71 80 70 85 67 85 C 64 85 65 81 65 81 L 69 45 C 69 45 70 40 73 40 z M 50 44 C 54 44 54 47 54 47 L 54 85 C 54 85 53 88 50 88 C 47 88 46 85 46 85 L 46 47 C 46 47 46 44 50 44 z "></path>
              <ellipse cx="50" cy="23" rx="42" ry="17" style={{ fill: '#555555' }}></ellipse>
              <ellipse cx="50" cy="19" rx="42" ry="17" style={{ fill: '#aaaaaa' }}></ellipse>
              <ellipse cx="50" cy="18" rx="37" ry="13" style={{ fill: '#333333' }}></ellipse>
              <ellipse cx="50" cy="20" rx="37" ry="12" style={{ fill: '#666666' }}></ellipse>
              <path style={{ fill: '#aaaaaa', stroke: '#333333', strokeWidth: 1 }} d="M 32,19 C 32,2 50,2 50,2 50,2 68,2 68,19 l -5,0 C 63,19 64,6.9 50,6.9 37,6.9 37,19 37,19 z"></path>
            </g>
          </svg>
        </button>

        {/* <button
          title="Upload PDF"
          onClick={() => openFileDialog()}
        >
          Upload PDF
          <span style={{ margin: 'auto', display: 'flex', flexDirection: 'row' }}>
            <img width='20px' src="pdf.png" alt="pdf" />
          </span>
        </button> */}
      </div>
      <div>
        <button
          //className="settings"
          title="Settings"
          onClick={() => setShowSettings(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1" fill="#000000">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                style={{ fill: '#555555', stroke: '#000000', strokeWidth: '1.5px' }}
                d="m 43,2 -2,10 -11,5 -8,-6 -10,10 6,9 -4,11 -11,2 0,13 11,2 4,10 -6,10 10,10 9,-6 10,4 2,11 14,0 2,-12 8,-4 10,7 L 87,79 80,68 85,59 97,57 97,43 85,41 82,31 88,21 78,11 69,17 58,12 56,2 z m 6,20 C 63,22 75,34 75,48 75,63 63,74 49,74 35,74 23,63 23,48 23,34 35,22 49,22 z"
              ></path>
            </g>
          </svg>
        </button>

      </div>

    </div>
  );
};
