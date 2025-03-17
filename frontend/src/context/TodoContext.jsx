import React, { createContext, useContext } from 'react';

const TodoStateContext = createContext();
const TodoDispatchContext = createContext();

export const useTodoState = () => useContext(TodoStateContext);
export const useTodoDispatch = () => useContext(TodoDispatchContext);

export const TodoProvider = ({ state, dispatch, children }) => (
  <TodoStateContext.Provider value={state}>
    <TodoDispatchContext.Provider value={dispatch}>
      {children}
    </TodoDispatchContext.Provider>
  </TodoStateContext.Provider>
);
