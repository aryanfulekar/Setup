import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import postReducer from "./postSlice.js";
import socketReducer from "./socketSlice.js";
import chatReducer from "./chatSlice.js"
import storage from "redux-persist/lib/storage"; // use lib/storage (not es/storage)
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const reducer = combineReducers({
  auth: authReducer,
  post: postReducer,
  socketio: socketReducer,
  chat:chatReducer
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
