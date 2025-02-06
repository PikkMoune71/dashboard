import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import projectsReducer from "@/store/slices/projectSlice";
import tasksReducer from "@/store/slices/taskSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["projects", "tasks"],
};

const projectPersistedReducer = persistReducer(persistConfig, projectsReducer);
const taskPersistedReducer = persistReducer(persistConfig, tasksReducer);

export const store = configureStore({
  reducer: {
    projects: projectPersistedReducer,
    tasks: taskPersistedReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
