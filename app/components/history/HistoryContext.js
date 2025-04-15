import { createContext, useReducer, useContext } from 'react';

const HistoryContext = createContext();

const historyReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_MESSAGE':
            return [...state, action.payload];
        case 'CLEAR_HISTORY':
            return [];
        default:
            return state;
    }
};

export const HistoryProvider = ({ children }) => {
    const [history, dispatch] = useReducer(historyReducer, []);

    return (
        <HistoryContext.Provider value={{ history, dispatch }}>
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = () => useContext(HistoryContext);
