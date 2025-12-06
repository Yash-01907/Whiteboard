import { useState,useCallback } from "react";


const useHistory = (initialState) => {
    const [history,setHistory] = useState([initialState]);
    const [step,setStep] = useState(0);

    const canUndo = step > 0;
    const canRedo = step < history.length - 1;

    const addToHistory = useCallback((newState) => {
        const newHistory = [...history.slice(0,step + 1),newState];
        setHistory(newHistory);
        setStep(newHistory.length - 1);
    },[history,step])

    const undo = useCallback(() => {
        if(!canUndo) return null;
        setStep(step - 1);
        return history[step - 1];
    },[step])

    const redo = useCallback(() => {
        if(!canRedo) return null;
        setStep(step + 1);
        return history[step + 1];
    },[step])

    return {
        history,
        step,
        canUndo,
        canRedo,
        currentHistoryState: history[step],
        addToHistory,
        undo,
        redo
    }
}