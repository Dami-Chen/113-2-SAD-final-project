import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { OneSignal } from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface AuthContextType {
  isLoggedIn: boolean | null; // ⬅️ 改為 boolean | null
  isAuthReady: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (form: RegisterFormType) => Promise<void>;
  createOrder:(form: OrderFormType)  => Promise<void>;
  historyOrder: (username: string | null) => Promise<{openOrders: OrderFormType[];
  joinOrders: OrderFormType[];}>;
  openOrderDetail: (username: string) =>  Promise<OrderFormType>;
  openJoinDetail: (order_id: string) =>  Promise<JoinOrderType>;
  getParticipantByOrder: (order_id: string) => Promise<JoinOrderType>
  getHostInfo: (username: string) => Promise<RegisterFormType>;
  openUserInfo:(username: string) => Promise<RegisterFormType>;
  updateUserInfo:(form:RegisterFormType) => Promise<void>;
  reportAbandon: (payload: {
    reporter_username: string;
    target_username: string;
    order_id: string;
    reason: string;
    reported_at: string;
    status: string;
  }) => Promise<void>;
}


export interface RegisterFormType {
  username: string;
  password: string;
  nickname: string;
  real_name: string;
  email: string;
  school: string;
  student_id: string;
  dorm: string;
  phone: string;
  score: number;
}


export interface OrderFormType{
  order_id: string;
  host_username: string;
  item_name: string;
  quantity: number|string;
  total_price: number|string;
  unit_price: number|string;
  imageUrl: string;
  information: string;
  share_method: string;
  share_location: string;
  stop_at_num: number|string;
  stop_at_date: string|null;
  comment: string;
  hashtag: string;
  paymentMethod: string;
  labels: string;
}


export interface JoinOrderType {
  username: string;
  order_id: string;
  quantity: number;
  item_name: string;
  score: number;
  phone: string;
}






const AuthContext = createContext<AuthContextType | null>(null);
const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // ⬅️ 初始為 null
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [username, setUsername] = useState<string | null>(null);


  useEffect(() => {
    const restoreSession = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
        setIsLoggedIn(true);
        OneSignal.login(storedUsername);
      } else {
        setIsLoggedIn(false); // ⬅️ 沒登入時顯式設為 false
      }
      setIsAuthReady(true);
    };
    restoreSession();
  }, []);


  const login = async (username: string, password: string) => {
    try {
      await axios.post(`${apiUrl}/api/login`, { username, password });


      setIsLoggedIn(true);
      setUsername(username);


      await AsyncStorage.setItem('username', username);
      OneSignal.login(username);
    } catch (err: any) {
      console.log("❌ Login error:", err);
      alert(err.response?.data?.error || '登入失敗');
    } finally {
      setIsAuthReady(true);
    }
  };


  const register = async (form: RegisterFormType) => {
    try {
      await axios.post(`${apiUrl}/api/register`, {
        ...form,
        score: 0,
      });
      alert('註冊成功，請登入');
    } catch (err: any) {
      console.error('註冊失敗:', err);
      const errorMessage = err.response?.data?.error || '註冊失敗';
      const detailMessage = err.response?.data?.detail;
      alert(`❌ ${errorMessage}${detailMessage ? `\n原因：${detailMessage}` : ''}`);
    }
  };


  const createOrder = async (form: OrderFormType) => {
    console.log('📌 createOrder form:', form);
    try {
      await axios.post(`${apiUrl}/api/orders`, {
        username: form.host_username,  // host_username
        item_name: form.item_name,
        quantity: form.quantity,
        total_price: form.total_price,
        unit_price: form.unit_price,
        image_Url: form.imageUrl,
        information: form.information,
        share_method: form.share_method,
        share_location: form.share_location,
        stop_at_num: form.stop_at_num,
        stop_at_date: form.stop_at_date,
        // stop_at_num:  5, // 確保有值
        // stop_at_date: null,
        comment: form.comment,
        hashtag: form.hashtag,
        pay_method: form.paymentMethod,
        labels: form.labels,
      });
      alert('成功，團購已發起');
    } catch (err: any) {
      console.log("❌ create order error:", err);
      alert(err.response?.data?.error || '發起團購失敗');
    }
  };


  const historyOrder = async (username: string | null) => {
    console.log('📌 username from query:', username);
    try {
      const res = await axios.get(`${apiUrl}/api/history_order`, {
      params: { username }
    });
      const allOrders = res.data;
      // console.log("✅ historyOrder API response:", res.data);  // Check if it's an array or object


      const openOrders = allOrders.filter((o: any) => o.order_type === 'host');
      const joinOrders = allOrders.filter((o: any) => o.order_type === 'join');
      // console.log("✅ Open Orders:", openOrders);
      // console.log("✅ Join Orders:", joinOrders);
      return { openOrders, joinOrders };
      alert('成功查詢歷史團購');
    } catch (err: any) {
      console.log("❌ fetch history orders error:", err);
      alert(err.response?.data?.error || '查詢歷史團購失敗');
      throw new Error(err.response?.data?.error || '查詢失敗');
    }
  };


  const openOrderDetail = async (username: string) => {
    try{
      const res = await axios.get(`${apiUrl}/api/open_order`, {
      params: { username }
    });
      console.log("✅ openOrderDetail API response:", res.data);
      return res.data;
      alert('成功查詢開團資料');
    } catch (err: any) {
      console.log("❌ fetch open order detail error:", err);
      throw new Error(err.response?.data?.error || '查詢開團資料失敗');
    }


  }


  const openJoinDetail = async (order_id: string) => {
    try{
      const res = await axios.get(`${apiUrl}/api/joined_order/${order_id}`);
      console.log("📌 order_id from query:", order_id);
      console.log("✅ joinedOrder API response:", res.data);
      return res.data;


    } catch (err: any) {
      console.log("❌ fetch joined order error:", err);
      throw new Error(err.response?.data?.error || '查詢拼單資訊失敗');
    }
  }


  const getHostInfo = async (username: string) => {
    try{
      const res = await axios.get(`${apiUrl}/api/order_host`, {
      params: { username }
    });
      console.log("✅ getHostInfo API response:", res.data);
      return res.data;


    }catch (err: any) {
      console.log("❌ fetch Host Info error:", err);
      throw new Error(err.response?.data?.error || '查詢主揪資訊失敗');
    }
 
  }
  const getParticipantByOrder = async (order_id: string) => {
    try{
      const res = await axios.get(`${apiUrl}/api/orders/${order_id}`);
      console.log("✅ participantByOrder API response:", res.data);
      return res.data;
    } catch (err: any) {
      console.log("❌ fetch participant by order error:", err);
      throw new Error(err.response?.data?.error || '查詢團購拼單者失敗');
    }
  }


  /// 個人資訊頁面
  const openUserInfo = async (username: string) => {
    try{
      const res = await axios.get(`${apiUrl}/api/userInfo`, {
      params: { username }
    });
      console.log("✅ participantByOrder API response:", res.data);
      return res.data;


    }
    catch (err: any) {
      console.log("❌ fetch participant by order error:", err);
      throw new Error(err.response?.data?.error || '查詢團購拼單者失敗');
    }
  }


  // 更新個人資訊
  const updateUserInfo = async (form: RegisterFormType) => {
    try{
      await axios.post(`${apiUrl}/api/updateUserInfo`, {
        username,  // host_username
        real_name: form.real_name,
        email: form.email,
        school: form.school,
        student_id: form.student_id,
        dorm: form.dorm,
      });      


    } catch (err: any) {
      console.log("❌ update user info error:", err);
      throw new Error(err.response?.data?.error || '更改個人資訊失敗');


    }
  }

  //棄單
  const reportAbandon = async (payload: {
    reporter_username: string;
    target_username: string;
    order_id: string;
    reason: string;
    reported_at: string;
    status: string;
  }) => {
    try {
      console.log('📡 發送棄單請求:', payload);

      const response = await axios.post(
        `${apiUrl}/api/abandonReport`,
        payload
      );

      return response.data;
    } catch (err: any) {
      console.error('❌ reportAbandon 發送失敗:', err.response?.data || err.message);
      throw new Error(err.response?.data?.error || '棄單送出失敗');
    }
  };



  const logout = async () => {
    setIsLoggedIn(false);
    setUsername(null);
    await AsyncStorage.removeItem('username');
    OneSignal.logout();
    setIsAuthReady(true);
  };


  return (
    <AuthContext.Provider value={{ isLoggedIn, isAuthReady, login, logout, username, register,
    createOrder, historyOrder, openOrderDetail, openJoinDetail, getParticipantByOrder, getHostInfo,
    openUserInfo, updateUserInfo, reportAbandon}}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider');
  return context;
};



