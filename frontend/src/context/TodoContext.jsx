import React, { createContext, useContext } from 'react';

const TodoStateContext = createContext();
const TodoDispatchContext = createContext();

export const useTodoState = () => useContext(TodoStateContext); // Hook to access state
export const useTodoDispatch = () => useContext(TodoDispatchContext); // Hook to access dispatch

export const TodoProvider = ({ state, dispatch, children }) => (
  <TodoStateContext.Provider value={state}>
    <TodoDispatchContext.Provider value={dispatch}>
      {children}
    </TodoDispatchContext.Provider>
  </TodoStateContext.Provider>
);
