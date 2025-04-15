const

  modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.77)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },

  modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '500px',
    textAlign: 'center',
    position: 'relative',
  },

  closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '5px 10px',
    marginRight: '1em',
    border: '1px solid #ad65fff3',
    borderRadius: '50%',
    backgroundColor: '#ad65fff3',
    color: '#FFFFFF',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },

  saveButtonStyle = {
    background: 'green',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '4px',
  },

  fileButtonStyle = {
    // position: 'absolute',
    // top: '10px',
    // right: '10px',
    padding: '5px 10px',
    // marginRight: '1em',
    border: '1px solid #ad65fff3',
    borderRadius: '50%',
    backgroundColor: '#ad65fff3',
    color: '#FFFFFF',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },

  settingsListStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems:'flex-end',
    gap: '20px',
    marginTop: '20px',
  },

  inputGroupStyleRow = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '10px'
  },

  inputGroupStyleCol = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
  },

  previewImageStyle = (gradientColors) => {
    return {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '1px solid #ccc',
      boxShadow: `0 2px 10px ${gradientColors[1]}`,
      cursor: 'pointer'
    }
  },

  colorPickerStyle = {
    // width: '50px',
    // height: '30px',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
  },

  gradientPreviewStyle = {
    width: '100%',
    height: '50px',
    borderRadius: '50px',
    marginTop: '10px',
  };

  

export {
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
};
