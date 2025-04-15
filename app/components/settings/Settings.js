import React, { useState } from 'react';

import {
  modalOverlayStyle,
  modalContentStyle,
  closeButtonStyle,
  settingsListStyle,
  inputGroupStyleRow,
  inputGroupStyleCol,
  previewImageStyle,
  colorPickerStyle,
  gradientPreviewStyle,
  saveButtonStyle,
  fileButtonStyle
} from './SettingStyles.js';

export default function SettingsPage({ setShowSettings, setUsername, setAiName, username, aiName, setUserPfp, setAiPfp, userPfp, aiPfp, setGradientColors, gradientColors }) {

  const
    [tempUsername, setTempUsername] = useState(username),
    [tempAiName, setTempAiName] = useState(aiName),
    [tempUserPfp, setTempUserPfp] = useState(userPfp),
    [tempAiPfp, setTempAiPfp] = useState(aiPfp),
    [tempGradientColors, setTempGradientColors] = useState(gradientColors);

  const handleGradientChange = (index, color) => {
    const newColors = [...tempGradientColors];
    newColors[index] = color;
    setTempGradientColors(newColors);
  };

  const setPfp = (type, file) => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        type === 'user'
          ? setTempUserPfp(reader.result)
          : setTempAiPfp(reader.result);
      };
      reader.onerror = (e) => {
        console.log('Error: ', e);
      };

    }
  };

  const handleSave = async () => {
    const settings = {
      userName: tempUsername,
      aiName: tempAiName,
      userPfp: tempUserPfp,
      aiPfp: tempAiPfp,
      gradientColors: tempGradientColors,
    };

    setUsername(tempUsername);
    setAiName(tempAiName);
    setUserPfp(tempUserPfp);
    setAiPfp(tempAiPfp);
    setGradientColors(tempGradientColors);
    await window.processBridge.saveSettings(settings);
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button style={closeButtonStyle} onClick={() => setShowSettings(false)}>
          Close
        </button>
        <h1>Settings</h1>
        <p>Customize your pfp and theme</p>
        <div style={settingsListStyle}>
          <div style={inputGroupStyleRow}>
            <label>User:</label>
            <input
              style={fileButtonStyle}
              type="file"
              onChange={(e) => {
                // console.log("TargetValue: ", e.target.files[0]);
                if (e.target.files[0])
                  setPfp('user', e.target.files[0])
              }}
            />
            {tempUserPfp && <img src={tempUserPfp} alt="User PFP" style={previewImageStyle(tempGradientColors)} />}
          </div>
          <div style={inputGroupStyleRow}>
            <label>AI:</label>
            <input
              style={fileButtonStyle}
              type="file"
              onChange={(e) => {
                if (e.target.files[0])
                  setPfp('ai', e.target.files[0])
              }
              }
            />
            {tempAiPfp && <img src={tempAiPfp} alt="AI PFP" style={previewImageStyle(tempGradientColors)} />}
          </div>
        </div>
        <label>Gradient Colors:</label>
        <div style={inputGroupStyleCol}>
          <div style={inputGroupStyleRow}>
            {tempGradientColors.map((color, index) => (
              <input
                key={index}
                type="color"
                value={color}
                onChange={(e) => handleGradientChange(index, e.target.value)}
                style={colorPickerStyle}
              />
            ))}
          </div>
          <div style={{
            ...gradientPreviewStyle,
            background: `linear-gradient(90deg, ${tempGradientColors.join(', ')})`,
          }}>
          </div>
        </div>
        <button onClick={() => handleSave()} style={saveButtonStyle}>Save</button>
      </div>
    </div>
  );








}

