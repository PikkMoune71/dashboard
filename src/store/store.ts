import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Utilise localStorage par défaut
import projectsReducer from "@/store/slice/projectSlice";

// Configuration de redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["projects"],
};

const persistedReducer = persistReducer(persistConfig, projectsReducer);

export const store = configureStore({
  reducer: {
    projects: persistedReducer,
  },
  // Ajouter serializableCheck pour éviter les erreurs liées aux valeurs non sérialisables
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"], // Ignorer cette action spécifique
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store); // Crée un persistor
