# 🧠 react-redux-optimizer

A lightweight utility library to **optimize React + Redux performance**, reduce re-renders, and simplify selector management.

---

## 🚀 Features

- ⚡ **Memoized selectors** with shallow comparison  
- 🪝 Custom `useOptimizedSelector` hook  
- ✅ **TypeScript** support  
- 🔧 Easy to integrate with existing Redux setup  
- 🧼 Less boilerplate, more readable code  

---

## 📦 Installation

```bash
npm install react-redux-optimizer
# or
yarn add react-redux-optimizer


## 🔧 Usage

```tsx
import { createOptimizedSelector, useOptimizedSelector } from 'react-redux-optimizer';

// Example Redux selector
const selectUser = (state) => state.user;

// Create an optimized selector
const selectUserName = createOptimizedSelector(selectUser, (user) => user.name);

// Use it inside your component
function UserInfo() {
  const userName = useOptimizedSelector(selectUserName);

  return <div>Hello, {userName}!</div>;
}

## ✅ TypeScript Support

```ts
const selectUser = (state: RootState) => state.user;

const selectUserName = createOptimizedSelector(
  selectUser,
  (user) => user.name
);

---

## ⚠️ Limitations

- Works best when state slices are normalized  
- Not a full replacement for Redux Toolkit  
- Doesn't manage state – only enhances access to it  

---

## 🧠 Why use this?

✅ Better performance in large React+Redux apps  
✅ Reduced selector boilerplate  
✅ Helps prevent component over-rendering  
✅ Clean and composable API