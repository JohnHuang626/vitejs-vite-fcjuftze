import React, { useState, useEffect } from 'react';
// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// ================= CUSTOM SVG ICONS (Replaces lucide-react) =================
const IconCalendar = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const IconSettings = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconLogOut = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;
const IconAlertCircle = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;
const IconCheckCircle = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IconAlertTriangle = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
const IconKey = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>;
const IconLock = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconX = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const IconClock4 = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconUserX = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" x2="22" y1="8" y2="13"/><line x1="22" x2="17" y1="8" y2="13"/></svg>;
const IconUpload = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>;
const IconFileSpreadsheet = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg>;
const IconPrinter = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>;
const IconUsers = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconDownload = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const IconTrash2 = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>;

// 取得台北時間的今日日期 (YYYY-MM-DD)
const getTaipeiDate = () => {
  const d = new Date();
  const options = { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' };
  const formatter = new Intl.DateTimeFormat('en-CA', options);
  return formatter.format(d);
};

// ================= FIREBASE SETUP =================
// 已為您硬編碼填入專屬金鑰，發布至 Vercel 即可直接連線使用
const getFirebaseConfig = () => {
  return {
    apiKey: "AIzaSyCAez-1cVu5dGQGo7t7C8bcmfJzpuCcF_I",
    authDomain: "school-attendance-eb2db.firebaseapp.com",
    projectId: "school-attendance-eb2db",
    storageBucket: "school-attendance-eb2db.firebasestorage.app",
    messagingSenderId: "952198963179",
    appId: "1:952198963179:web:581a08b216cd92b4e603ae"
  };
};

const app = initializeApp(getFirebaseConfig());
const auth = getAuth(app);
const firestoreDb = getFirestore(app);
const appId = 'school-attendance-prod';
// ==================================================

export default function App() {
  // 系統狀態
  const [db, setDb] = useState({ students: [], passwords: {}, attendance: {} });
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null); // 自訂確認視窗
  
  // 權限與登入
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminType, setAdminType] = useState('full'); // 'full' 或 'assistant'
  const [showLogin, setShowLogin] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');

  // 學生端狀態
  const [selectedDate, setSelectedDate] = useState(getTaipeiDate());
  const [selectedClass, setSelectedClass] = useState('');
  const [unlockedClass, setUnlockedClass] = useState(null);
  const [inputPin, setInputPin] = useState('');
  const [attendanceData, setAttendanceData] = useState({});

  // 管理端狀態
  const [adminTab, setAdminTab] = useState('reports');
  const [adminSelectedDate, setAdminSelectedDate] = useState(getTaipeiDate());
  const [editingRecord, setEditingRecord] = useState(null);
  const [centerMessage, setCenterMessage] = useState(null);

  // 衍生資料
  const classes = [...new Set(db.students?.map(s => s.className) || [])].sort();
  const classStudents = db.students?.filter(s => s.className === selectedClass).sort((a, b) => parseInt(a.seat) - parseInt(b.seat)) || [];
  const dailyData = db.attendance?.[selectedDate] || {};
  const adminDailyData = db.attendance?.[adminSelectedDate] || {};

  // 初始化 Firebase Auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Auth init error:", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 監聽 Firestore 資料即時更新
  useEffect(() => {
    if (!user) return;
    
    // 資料儲存路徑為: /artifacts/{appId}/public/data/schoolData/main
    const docRef = doc(firestoreDb, 'artifacts', appId, 'public', 'data', 'schoolData', 'main');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setDb(docSnap.data());
      } else {
        // 初始化空資料庫
        setDoc(docRef, { students: [], passwords: {}, attendance: {} });
      }
    }, (error) => {
      console.error("Firestore error:", error);
      showToast('無法連接雲端資料庫，請檢查網路連線', 'error');
    });

    return () => unsubscribe();
  }, [user]);

  const saveDb = async (newData) => {
    if (!user) return;
    try {
      setDb(newData); // Optimistic local update
      const docRef = doc(firestoreDb, 'artifacts', appId, 'public', 'data', 'schoolData', 'main');
      await setDoc(docRef, newData);
    } catch (err) {
      console.error("Save error:", err);
      showToast('資料儲存至雲端失敗', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setUnlockedClass(null);
    setInputPin('');
    setAttendanceData({});
  }, [selectedClass, selectedDate]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (loginPassword === 'stu1234') {
      setIsAdmin(true);
      setAdminType('full');
      setShowLogin(false);
      setLoginPassword('');
      showToast('成功登入管理員系統 (完整權限)');
    } else if (loginPassword === 'stu888') {
      setIsAdmin(true);
      setAdminType('assistant');
      setAdminTab('reports'); // 公差模式強制切換至報表
      setShowLogin(false);
      setLoginPassword('');
      showToast('成功登入 (公差模式)');
    } else {
      showToast('密碼錯誤', 'error');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setSelectedClass('');
    showToast('已登出管理員系統');
  };

  const handleUnlockClass = () => {
    const expectedPin = db.passwords?.[selectedClass] || selectedClass;
    if (inputPin === expectedPin) {
      setUnlockedClass(selectedClass);
      const existingData = dailyData[selectedClass];
      if (existingData) {
        setAttendanceData(existingData);
      } else {
        const initial = {};
        classStudents.forEach(s => { initial[s.seat] = { status: 'present' }; });
        setAttendanceData(initial);
      }
      showToast(`已解鎖 ${selectedClass} 班`);
    } else {
      showToast('班級密碼錯誤，請重新輸入', 'error');
    }
  };

  const handleStatusChange = (seat, status) => {
    setAttendanceData(prev => {
      // 動態建立物件，避免產生 undefined (Firebase 不支援 undefined)
      const newRecord = { status };
      if (status === 'late') {
        newRecord.time = '08:00';
      } else if (status === 'absent') {
        newRecord.reason = 'sick';
      }
      return {
        ...prev,
        [seat]: newRecord
      };
    });
  };

  const handleDetailChange = (seat, field, value) => {
    setAttendanceData(prev => ({
      ...prev,
      [seat]: { ...prev[seat], [field]: value }
    }));
  };

  const submitAttendance = () => {
    if (!unlockedClass) return;
    if (selectedDate !== getTaipeiDate()) {
      showToast('為確保紀錄正確，僅允許修改與送出「當日」的點名紀錄！', 'error');
      return;
    }
    
    const newDb = { ...db };
    if (!newDb.attendance) newDb.attendance = {};
    if (!newDb.attendance[selectedDate]) newDb.attendance[selectedDate] = {};
    
    newDb.attendance[selectedDate][unlockedClass] = attendanceData;
    saveDb(newDb);
    
    setCenterMessage(`✅ 已成功送出 ${unlockedClass} 班點名資料！`);
    setTimeout(() => setCenterMessage(null), 3000);
  };

  const requestDeleteRecord = (className, seat) => {
    setConfirmDialog({
      title: '確認刪除紀錄',
      message: '確定要刪除這筆紀錄，將該名學生改為「正常出勤」嗎？',
      onConfirm: () => {
        const newDb = { ...db };
        if (newDb.attendance[adminSelectedDate] && newDb.attendance[adminSelectedDate][className]) {
          newDb.attendance[adminSelectedDate][className][seat] = { status: 'present' };
          saveDb(newDb);
          showToast('已刪除紀錄並恢復為正常出勤');
        }
      }
    });
  };

  const requestClearAllStudents = () => {
    setConfirmDialog({
      title: '⚠️ 警告：一鍵清空所有資料',
      message: '確定要「一鍵清空」全校學生資料與班級密碼嗎？\n\n💡 此操作通常於【新學年換班】時使用。\n清空後必須重新匯入新名單，舊的班級密碼也會一併失效！',
      isDanger: true,
      onConfirm: () => {
        saveDb({ ...db, students: [], passwords: {} });
        showToast('已成功清空所有學生資料與班級密碼');
      }
    });
  };

  const openEditRecord = (student, record, className) => {
    setEditingRecord({
      date: adminSelectedDate, className, seat: student.seat, name: student.name,
      status: record.status, time: record.time || '08:00', reason: record.reason || 'sick'
    });
  };

  const saveEditRecord = () => {
    if (!editingRecord) return;
    const newDb = { ...db };
    if (!newDb.attendance) newDb.attendance = {};
    if (!newDb.attendance[editingRecord.date]) newDb.attendance[editingRecord.date] = {};
    if (!newDb.attendance[editingRecord.date][editingRecord.className]) newDb.attendance[editingRecord.date][editingRecord.className] = {};

    // 避免寫入 undefined，動態構建儲存物件
    const recordToSave = { status: editingRecord.status };
    if (editingRecord.status === 'late') {
      recordToSave.time = editingRecord.time;
    } else if (editingRecord.status === 'absent') {
      recordToSave.reason = editingRecord.reason;
    }

    newDb.attendance[editingRecord.date][editingRecord.className][editingRecord.seat] = recordToSave;
    
    saveDb(newDb);
    showToast('單筆資料修改成功');
    setEditingRecord(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        const lines = text.split('\n');
        const newStudents = [];
        let newPasswords = { ...(db.passwords || {}) };
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          const parts = line.split(',');
          if (parts.length >= 3) {
            const className = parts[0].trim();
            const seat = parts[1].trim();
            const name = parts[2].trim();
            if (className && seat && name) {
              newStudents.push({ className, seat, name });
              if (!newPasswords[className]) newPasswords[className] = className;
            }
          }
        }

        if (newStudents.length > 0) {
          saveDb({ ...db, students: newStudents, passwords: newPasswords });
          showToast(`成功匯入 ${newStudents.length} 筆學生資料！`);
        } else {
          showToast('找不到有效的資料，請確認檔案格式', 'error');
        }
      } catch (err) {
        showToast('檔案解析失敗', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = null; 
  };

  const downloadTemplate = () => {
    const csvContent = "\uFEFF班級,座號,姓名\n101,1,王小明\n101,2,陳小華\n102,1,李大同";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '學生資料匯入範本.csv';
    link.click();
  };

  const reasonMap = {
    sick: '病假', personal: '事假', official: '公假', bereavement: '喪假', truancy: '曠課', other: '其他'
  };

  // 新增：回到首頁的處理函式
  const handleGoHome = () => {
    setSelectedClass('');
    setUnlockedClass(null);
    setInputPin('');
    setSelectedDate(getTaipeiDate());
    if (isAdmin) {
      setAdminTab('reports');
      setAdminSelectedDate(getTaipeiDate());
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-blue-200" style={{ colorScheme: 'light' }}>
      
      {/* ⚠️ 強制消除 Vite/Vercel 預設限制寬度的 CSS Reset (解決黑邊問題) 並且加入動畫 class */}
      <style dangerouslySetInnerHTML={{__html: `
        :root, html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          min-height: 100vh !important;
          overflow-x: hidden !important;
          display: block !important;
        }
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
          .print-area { padding: 0; }
          .break-inside-avoid { break-inside: avoid; }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
        .animate-fade-in-down { animation: fadeInDown 0.4s ease-out forwards; }
      `}} />

      {/* 載入中遮罩 (保護尚未連上 Firebase 前的閃爍) */}
      {!user && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium tracking-widest animate-pulse">連線至雲端系統中...</p>
        </div>
      )}

      {/* 自訂確認視窗 (取代原生的 window.confirm) */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all">
            <div className={`px-6 py-4 border-b flex justify-between items-center ${confirmDialog.isDanger ? 'bg-red-50' : 'bg-gray-50'}`}>
              <h3 className={`font-bold flex items-center ${confirmDialog.isDanger ? 'text-red-700' : 'text-gray-700'}`}>
                {confirmDialog.isDanger && <IconAlertTriangle className="w-5 h-5 mr-2" />}
                {confirmDialog.title}
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">{confirmDialog.message}</p>
              <div className="mt-6 flex space-x-3">
                <button onClick={() => setConfirmDialog(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded-lg transition">
                  取消
                </button>
                <button 
                  onClick={() => { confirmDialog.onConfirm(); setConfirmDialog(null); }} 
                  className={`flex-1 font-medium py-2 rounded-lg transition text-white ${confirmDialog.isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  確認執行
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[60] px-6 py-3 rounded-lg shadow-lg text-white font-medium flex items-center animate-fade-in-down ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-600'}`}>
          {toast.type === 'error' ? <IconAlertCircle className="w-5 h-5 mr-2" /> : <IconCheckCircle className="w-5 h-5 mr-2" />}
          {toast.message}
        </div>
      )}

      {/* Center Success Message */}
      {centerMessage && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] animate-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center transform scale-100 transition-transform">
            <div className="bg-green-100 rounded-full p-3 mb-4">
              <IconCheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center">{centerMessage}</h2>
          </div>
        </div>
      )}

      {/* Edit Record Modal (Admin) */}
      {editingRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-700">修改單筆紀錄 - {editingRecord.className}班</h3>
              <button onClick={() => setEditingRecord(null)} className="text-gray-400 hover:text-gray-600"><IconX className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">學生</label>
                <div className="p-2 bg-gray-100 rounded font-medium text-gray-800">{editingRecord.seat}號 {editingRecord.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">出勤狀態</label>
              <select 
                className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 outline-none bg-white text-gray-900"
                value={editingRecord.status}
                onChange={e => setEditingRecord({...editingRecord, status: e.target.value})}
              >
                  <option value="present">正常出勤 (清除紀錄)</option>
                  <option value="late">遲到</option>
                  <option value="absent">缺席</option>
                </select>
              </div>
              {editingRecord.status === 'late' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">到校時間</label>
                <input 
                  type="time" 
                  className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 outline-none bg-white text-gray-900"
                  value={editingRecord.time}
                  onChange={e => setEditingRecord({...editingRecord, time: e.target.value})}
                />
              </div>
              )}
              {editingRecord.status === 'absent' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">假別</label>
                <select 
                  className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 outline-none bg-white text-gray-900"
                  value={editingRecord.reason}
                  onChange={e => setEditingRecord({...editingRecord, reason: e.target.value})}
                >
                    {Object.entries(reasonMap).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="pt-4 flex space-x-3">
                <button onClick={() => setEditingRecord(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded transition">取消</button>
                <button onClick={saveEditRecord} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition">儲存修改</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 頁首 */}
      <header className="w-full bg-blue-700 text-white shadow-md print:hidden m-0">
        <div className="w-full max-w-none px-4 sm:px-8 py-4 flex justify-between items-center">
          {/* 加入 onClick 與 cursor-pointer 讓標題可點擊 */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={handleGoHome}
            title="回到首頁"
          >
            <div className="bg-white/20 p-2 rounded-lg">
              <IconCalendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide flex items-center">
                學生出缺席回報系統
                <span className="ml-2 text-xs bg-blue-500 px-2 py-0.5 rounded-full border border-blue-400">雲端版</span>
              </h1>
              <p className="text-blue-200 text-sm">Student Attendance System</p>
            </div>
          </div>
          <div>
            {!isAdmin ? (
              <button onClick={() => setShowLogin(true)} className="flex items-center space-x-1 hover:bg-blue-600 px-3 py-2 rounded-md transition text-sm">
                <IconSettings className="w-4 h-4" />
                <span className="hidden sm:inline">學務處管理</span>
              </button>
            ) : (
              <button onClick={handleLogout} className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md transition text-sm">
                <IconLogOut className="w-4 h-4" />
                <span>登出管理員</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Admin Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in-up">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-700 flex items-center"><IconLock className="w-4 h-4 mr-2" /> 管理員登入</h3>
              <button onClick={() => setShowLogin(false)} className="text-gray-400 hover:text-gray-600"><IconX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdminLogin} className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">管理密碼</label>
              <input 
                type="password" 
                className="w-full border-gray-300 border rounded-md p-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900" 
                placeholder="請輸入密碼"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                autoFocus
              />
              <button type="submit" className="w-full bg-blue-600 text-white rounded-md py-2 font-medium hover:bg-blue-700 transition">
                登入
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 主要內容區 */}
      <main className="w-full max-w-none px-4 sm:px-8 py-8 mx-auto">
        
        {/* ================= USER VIEW (CLASS) ================= */}
        {!isAdmin && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between w-full max-w-5xl mx-auto">
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <div className="flex items-center space-x-2">
                  <IconCalendar className="w-5 h-5 text-gray-500" />
                  <input 
                    type="date" 
                    className="border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500 bg-white text-gray-900 cursor-pointer"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/3">
                <select 
                  className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:border-blue-500 bg-white text-gray-900 font-medium cursor-pointer"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="" className="bg-white text-gray-900">-- 請選擇班級 --</option>
                  {classes.map(c => <option key={c} value={c} className="bg-white text-gray-900">{c} 班</option>)}
                </select>
              </div>
            </div>

            <div className="w-full max-w-5xl mx-auto">
              {classes.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-xl flex items-center justify-center space-x-3">
                  <IconAlertTriangle className="w-6 h-6" />
                  <p>目前系統內尚無學生資料。請通知學務處登入後進行資料匯入。</p>
                </div>
              )}

              {selectedClass && unlockedClass !== selectedClass && (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center max-w-md mx-auto mt-12 animate-fade-in-up">
                  <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconKey className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-800">解鎖 {selectedClass} 班</h3>
                  <p className="text-gray-500 text-sm mb-6">為防止誤填與亂填，請輸入班級專屬密碼。<br/>(預設密碼為班級名稱，如 {selectedClass})</p>
                  <input
                    type="password"
                    className="w-full border-2 border-gray-200 rounded-lg p-3 mb-4 text-center text-xl tracking-widest focus:border-blue-500 focus:ring-0 outline-none transition-colors bg-white text-gray-900"
                    placeholder="請輸入密碼"
                    value={inputPin}
                    onChange={e => setInputPin(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleUnlockClass()}
                    autoFocus
                  />
                  <button 
                    onClick={handleUnlockClass} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-bold shadow-md transition-colors"
                  >
                    進入點名表單
                  </button>
                </div>
              )}

              {selectedClass && unlockedClass === selectedClass && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                  <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-blue-800">{selectedClass} 班 - {selectedDate} 出缺席點名表</h2>
                    {dailyData[selectedClass] && (
                       <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium flex items-center">
                         <IconCheckCircle className="w-3 h-3 mr-1" /> 已有雲端紀錄
                       </span>
                    )}
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider border-b border-gray-200">
                          <th className="p-4 w-20 text-center">座號</th>
                          <th className="p-4 w-32">姓名</th>
                          <th className="p-4">出缺席狀態與註記</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {classStudents.map(student => {
                          const rec = attendanceData[student.seat] || { status: 'present' };
                          const isLate = rec.status === 'late';
                          const isAbsent = rec.status === 'absent';
                          
                          return (
                            <tr key={student.seat} className="hover:bg-gray-50 transition">
                              <td className="p-4 text-center font-medium text-gray-500">{student.seat}</td>
                              <td className="p-4 font-bold text-gray-800">{student.name}</td>
                              <td className="p-4">
                                <div className="flex flex-wrap items-center gap-3">
                                  <div className="flex bg-gray-100 p-1 rounded-lg">
                                    <button 
                                      onClick={() => handleStatusChange(student.seat, 'present')}
                                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${!isLate && !isAbsent ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:bg-gray-200'}`}
                                    >
                                      正常
                                    </button>
                                    <button 
                                      onClick={() => handleStatusChange(student.seat, 'late')}
                                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition flex items-center ${isLate ? 'bg-yellow-100 text-yellow-700 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                                    >
                                      <IconClock4 className="w-3 h-3 mr-1" /> 遲到
                                    </button>
                                    <button 
                                      onClick={() => handleStatusChange(student.seat, 'absent')}
                                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition flex items-center ${isAbsent ? 'bg-red-100 text-red-700 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                                    >
                                      <IconUserX className="w-3 h-3 mr-1" /> 缺席
                                    </button>
                                  </div>
                                  {isLate && (
                                  <div className="flex items-center space-x-2 animate-fade-in">
                                    <span className="text-sm text-gray-500">到校時間:</span>
                                    <input 
                                      type="time" 
                                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:border-yellow-500 outline-none bg-white text-gray-900 cursor-pointer"
                                      value={rec.time || '08:00'}
                                      onChange={(e) => handleDetailChange(student.seat, 'time', e.target.value)}
                                    />
                                  </div>
                                )}
                                {isAbsent && (
                                  <div className="flex items-center space-x-2 animate-fade-in">
                                    <span className="text-sm text-gray-500">假別:</span>
                                    <select 
                                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:border-red-500 outline-none bg-white text-gray-900 cursor-pointer"
                                      value={rec.reason || 'sick'}
                                      onChange={(e) => handleDetailChange(student.seat, 'reason', e.target.value)}
                                    >
                                        {Object.entries(reasonMap).map(([key, label]) => (
                                          <option key={key} value={key} className="bg-white text-gray-900">{label}</option>
                                        ))}
                                      </select>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {selectedDate !== getTaipeiDate() ? (
                    <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
                      <p className="text-red-500 font-medium flex items-center">
                        <IconAlertCircle className="w-5 h-5 mr-2" /> 非當日資料，僅供檢視無法修改，如需要修改，請找學務處生教組長
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-end items-center gap-4">
                      <span className="text-sm text-gray-500 flex items-center">
                        <IconCheckCircle className="w-4 h-4 mr-1" /> 重複送出將覆蓋當日資料
                      </span>
                      <button 
                        onClick={submitAttendance}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-lg shadow-md transition flex items-center w-full sm:w-auto justify-center"
                      >
                        <IconUpload className="w-5 h-5 mr-2" /> 送出點名紀錄
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= ADMIN VIEW ================= */}
        {isAdmin && (
          <div className="space-y-6 animate-fade-in w-full max-w-5xl mx-auto">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex space-x-2 print:hidden">
              <button 
                onClick={() => setAdminTab('reports')}
                className={`flex-1 py-3 rounded-lg font-medium transition ${adminTab === 'reports' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <IconFileSpreadsheet className="w-5 h-5 inline-block mr-2 -mt-1" /> 缺曠課報表總覽
              </button>
              {adminType === 'full' && (
                <button 
                  onClick={() => setAdminTab('settings')}
                  className={`flex-1 py-3 rounded-lg font-medium transition ${adminTab === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <IconSettings className="w-5 h-5 inline-block mr-2 -mt-1" /> 系統設定與資料匯入
                </button>
              )}
            </div>

            {adminTab === 'reports' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6 print:hidden">
                <div className="flex items-center space-x-3">
                  <label className="font-medium text-gray-700">選擇列印日期：</label>
                  <input 
                    type="date" 
                    className="border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500 bg-white text-gray-900 cursor-pointer"
                    value={adminSelectedDate}
                    onChange={(e) => setAdminSelectedDate(e.target.value)}
                  />
                </div>
                <button onClick={() => window.print()} className="flex items-center bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-md transition">
                    <IconPrinter className="w-4 h-4 mr-2" /> 列印報表
                  </button>
                </div>

                <div className="print-area">
                  <h2 className="text-2xl font-bold text-center mb-6 hidden print:block">
                    全校缺曠課及遲到總表 ({adminSelectedDate})
                  </h2>
                  
                  {Object.keys(adminDailyData).length === 0 ? (
                    <div className="text-center text-gray-500 py-12 border-2 border-dashed border-gray-200 rounded-lg">
                      <IconFileSpreadsheet className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p>本日 ({adminSelectedDate}) 尚無班級回報資料</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {classes.map(cls => {
                        const classData = adminDailyData[cls];
                        if (!classData) return null;

                        const anomalies = [];
                        const classStu = db.students.filter(s => s.className === cls);
                        
                        classStu.forEach(stu => {
                          const record = classData[stu.seat];
                          if (record && (record.status === 'late' || record.status === 'absent')) {
                            anomalies.push({ student: stu, record });
                          }
                        });

                        return (
                          <div key={cls} className="border border-gray-200 rounded-lg overflow-hidden break-inside-avoid">
                            <div className="bg-gray-100 px-4 py-2 font-bold text-gray-700 flex justify-between">
                              <span>{cls} 班</span>
                              <span className="text-sm font-normal text-gray-500">
                                回報狀態：已回報 | 異常人數：{anomalies.length}人
                              </span>
                            </div>
                            {anomalies.length === 0 ? (
                              <div className="px-4 py-3 text-sm text-green-600 bg-green-50">
                                <IconCheckCircle className="w-4 h-4 inline mr-1 -mt-0.5" /> 全班全勤
                              </div>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm min-w-[500px]">
                                  <thead>
                                    <tr className="bg-gray-50 text-gray-500 border-b">
                                      <th className="px-4 py-2 text-left w-20">座號</th>
                                      <th className="px-4 py-2 text-left w-32">姓名</th>
                                      <th className="px-4 py-2 text-left w-24">狀態</th>
                                      <th className="px-4 py-2 text-left">備註 (時間/假別)</th>
                                      {adminType === 'full' && <th className="px-4 py-2 text-center w-32 print:hidden">操作</th>}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {anomalies.map(({student, record}) => (
                                      <tr key={student.seat}>
                                        <td className="px-4 py-2">{student.seat}</td>
                                        <td className="px-4 py-2 font-medium">{student.name}</td>
                                        <td className="px-4 py-2">
                                          {record.status === 'late' ? <span className="text-yellow-600 font-bold">遲到</span> : <span className="text-red-600 font-bold">缺席</span>}
                                        </td>
                                        <td className="px-4 py-2 text-gray-600">
                                          {record.status === 'late' ? `到校時間: ${record.time}` : reasonMap[record.reason]}
                                        </td>
                                        {adminType === 'full' && (
                                          <td className="px-4 py-2 text-center print:hidden">
                                            <button onClick={() => openEditRecord(student, record, cls)} className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">修改</button>
                                            <button onClick={() => requestDeleteRecord(cls, student.seat)} className="text-red-600 hover:text-red-800 text-sm font-medium">刪除</button>
                                          </td>
                                        )}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      
                      {classes.filter(c => !adminDailyData[c]).length > 0 && (
                         <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-100 print:hidden">
                           <h4 className="font-bold text-red-700 mb-2 flex items-center">
                             <IconAlertCircle className="w-4 h-4 mr-2" /> 尚未回報班級
                           </h4>
                           <div className="flex flex-wrap gap-2">
                             {classes.filter(c => !adminDailyData[c]).map(c => (
                               <span key={c} className="bg-white border border-red-200 text-red-600 px-2 py-1 rounded text-sm font-medium shadow-sm">{c} 班</span>
                             ))}
                           </div>
                         </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {adminTab === 'settings' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold mb-4 flex items-center"><IconUsers className="w-5 h-5 mr-2 text-blue-600" /> 學生名單建置</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    請上傳 CSV 檔案建置全校名單。檔案需包含欄位：<strong>班級、座號、姓名</strong>。
                  </p>
                  
                  <div className="flex space-x-3 mb-6">
                    <button 
                      onClick={downloadTemplate}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-md transition flex justify-center items-center text-sm font-medium"
                    >
                      <IconDownload className="w-4 h-4 mr-2" /> 下載 CSV 範本
                    </button>
                    
                    <div className="flex-1 relative">
                      <input 
                        type="file" accept=".csv" onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 py-2 rounded-md transition flex justify-center items-center text-sm font-medium">
                        <IconUpload className="w-4 h-4 mr-2" /> 匯入 CSV 檔案
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="text-sm text-gray-500">雲端資料庫狀態</div>
                      <div className="font-bold text-gray-800">已載入 {classes.length} 個班級, 共 {db.students?.length || 0} 名學生</div>
                    </div>
                    {(db.students?.length || 0) > 0 && (
                      <button 
                        onClick={requestClearAllStudents}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2 px-4 rounded-md transition flex justify-center items-center text-sm font-bold shadow-sm"
                      >
                        <IconTrash2 className="w-4 h-4 mr-2" /> 一鍵清空名單
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold mb-4 flex items-center"><IconKey className="w-5 h-5 mr-2 text-blue-600" /> 班級密碼管理</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    為防止學生誤填或亂填，各班點名需輸入密碼。<br/><strong>預設密碼即為班級名稱</strong>。可點擊欄位修改。
                  </p>
                  
                  {classes.length === 0 ? (
                    <div className="text-sm text-gray-400 text-center py-4">請先匯入學生名單</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
                      {classes.map(c => (
                        <div key={c} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                          <span className="font-medium text-gray-700">{c} 班</span>
                          <input
                            type="text"
                            className="w-16 border border-gray-300 rounded px-1 py-1 text-center text-sm focus:border-blue-500 outline-none bg-white text-gray-900"
                            defaultValue={db.passwords?.[c] !== undefined ? db.passwords[c] : c}
                            onBlur={(e) => {
                              const newPass = e.target.value;
                              if (newPass === db.passwords?.[c]) return;
                              const newDb = { ...db, passwords: { ...(db.passwords || {}), [c]: newPass } };
                              saveDb(newDb);
                              showToast(`${c} 班密碼已更新`);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}