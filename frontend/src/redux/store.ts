import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import adminReducer from './slices/adminSlice';
import userReducer, { UserState } from './slices/userSlice'; // import UserState
import resourceReducer from "./slices/resourceSlice";
import jobReducer from './slices/jobSlice';
import analyticsReducer from './slices/analyticsSlice';
import resumeReducer from "./slices/resumeSlice";
import experienceReducer from "./slices/experienceSlice";
import paymentReducer from "./slices/paymentSlice";
import educationReducer from "./slices/educationSlice";

const userPersistConfig = {
  key: 'user',
  storage,
};
const adminPersistConfig = {
  key: 'admin',
  storage,
};

// Explicitly type the persisted reducer
const persistedUserReducer = persistReducer<UserState>(userPersistConfig, userReducer);

const store = configureStore({
  reducer: {
    admin: persistReducer(adminPersistConfig, adminReducer),
    user: persistedUserReducer, // use the typed reducer here
    job: jobReducer,
    analytics: analyticsReducer,
    experience: experienceReducer,
    education: educationReducer,
    payment: paymentReducer,
    resources: resumeReducer,
    resource: resourceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export default store;