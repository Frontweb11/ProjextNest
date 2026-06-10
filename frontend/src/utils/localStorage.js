const STORAGE_KEY = "resume_builder_data";

export const saveToLocalStorage = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadFromLocalStorage = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};
