// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [loading, setLoading] = useState(true);

//   // Set axios default header
//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     } else {
//       delete axios.defaults.headers.common['Authorization'];
//     }
//   }, [token]);

//   // Load user on mount if token exists
//   useEffect(() => {
//     const loadUser = async () => {
//       if (token) {
//         try {
//           const res = await axios.get('/api/auth/me');
//           setUser(res.data.user);
//         } catch {
//           localStorage.removeItem('token');
//           setToken(null);
//         }
//       }
//       setLoading(false);
//     };
//     loadUser();
//   }, [token]);

//   const login = async (email, password) => {
//     const res = await axios.post('/api/auth/login', { email, password });
//     const { token: newToken, user: newUser } = res.data;
//     localStorage.setItem('token', newToken);
//     setToken(newToken);
//     setUser(newUser);
//     return res.data;
//   };

//   const register = async (name, email, password) => {
//     const res = await axios.post('/api/auth/register', { name, email, password });
//     const { token: newToken, user: newUser } = res.data;
//     localStorage.setItem('token', newToken);
//     setToken(newToken);
//     setUser(newUser);
//     return res.data;
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//     setUser(null);
//     delete axios.defaults.headers.common['Authorization'];
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within AuthProvider');
//   return context;
// };

// export default AuthContext;

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set axios default header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await axios.get('/api/auth/me');
          setUser(res.data.user);
        } catch {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
    return res.data;
  };

  // register only creates the account — does NOT log the user in
  // so after register() the app navigates to /login normally
  const register = async (name, email, password) => {
    const res = await axios.post('/api/auth/register', { name, email, password });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
