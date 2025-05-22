import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { where, writeBatch } from "firebase/firestore";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import HomePage from "./HomePage";
import { useNavigate } from "react-router-dom";
import PrayerRequestsPage from "./PrayerRequestsPage";
import AdminDashboardPage from "./AdminDashboardPage";
import LoginPage from "./LoginPage";
import NavBar from "./NavBar";
import Header from "./Header";
import { useLocation } from "react-router-dom";

function PrivateRoute({ children, user, role, allowedRoles }) {
  if (!user || !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }
  return children;
}

function App() {
  // const navigate = useNavigate();
  // Auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [signupName, setSignupName] = useState("");
  const [userName, setUserName] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const isPastorOrAdmin = role === "pastor" || role === "admin";

  // Prayer request state
  const [prayerText, setPrayerText] = useState("");
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [answeredNote, setAnsweredNote] = useState("");
  // Add these new pieces of state at the top of your component:
  const [showAnsweredId, setShowAnsweredId] = useState(null);
  const [answeredNotes, setAnsweredNotes] = useState({}); // id => note
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/login") {
      resetLoginFields();
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserName(""); // Clear the user’s name
      setRole(""); // (Optional) Clear the role too
      resetLoginFields();
      // You can clear other state if needed
      navigate("/");
    } catch (err) {
      alert("Logout failed: " + err.message);
    }
  };
  // Clear the email and password boxes
  const resetLoginFields = () => {
    setEmail("");
    setPassword("");
    setSignupName("");
    setError("");
  };
  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (!user.emailVerified) {
          setError("Please verify your email address before logging in.");
          await signOut(auth);
          setUser(null);
          setRole("");
          return;
        }
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role);
          setUserName(docSnap.data().name || ""); // <-- add this!
        } else {
          await setDoc(userRef, { name: signupName, role: "member" });
          setRole("member");
          setUserName("");
        }
        setUser(user);
        setError("");
      } else {
        setUser(null);
        setRole("");
        setUserName("");
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch prayer requests when logged in
  useEffect(() => {
    if (user) {
      const fetchPrayerRequests = async () => {
        const q = query(
          collection(db, "prayerRequests"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const requests = [];
        querySnapshot.forEach((doc) => {
          requests.push({ id: doc.id, ...doc.data() });
        });
        setPrayerRequests(requests);
      };
      fetchPrayerRequests();
    }
  }, [user]);

  // Fetch users when logged in
  useEffect(() => {
    if (isPastorOrAdmin) {
      setUsersLoading(true);
      const fetchUsers = async () => {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        const users = [];
        querySnapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() });
        });
        setAllUsers(users);
        setUsersLoading(false);
      };
      fetchUsers();
    }
  }, [isPastorOrAdmin]);

  // Change a users role
  const handleRoleChange = async (userId, newRole) => {
    try {
      await setDoc(doc(db, "users", userId), {
        ...allUsers.find((u) => u.id === userId),
        role: newRole,
      });
      // Update local state
      setAllUsers(
        allUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert("Error updating role: " + err.message);
    }
  };
  // Handle deleting a user
  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user and all their prayer requests?"
      )
    )
      return;
    try {
      // 1. Delete user document
      await deleteDoc(doc(db, "users", userId));

      // 2. Find and delete all prayer requests by this user
      const q = query(
        collection(db, "prayerRequests"),
        where("createdBy", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);
      querySnapshot.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();

      // 3. Update local users state
      setAllUsers(allUsers.filter((u) => u.id !== userId));
      // 4. Refresh prayer requests so UI is up to date!
      await refreshPrayerRequests();
      // Optionally refresh prayer requests display if needed
      // refreshPrayerRequests();
    } catch (err) {
      alert("Error deleting user and their requests: " + err.message);
    }
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (!userCredential.user.emailVerified) {
        setError("Please verify your email address before logging in.");
        await signOut(auth);
        return;
      }
      // At this point, user is verified
      // You can check if their user doc exists
      const userRef = doc(db, "users", userCredential.user.uid);
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        // Prompt user for name if needed (simple example: show input box)
        // For demo, use a prompt (replace with a real UI flow in production)
        let newName = window.prompt(
          "Please enter your display name. This name will be visible to other users when you post prayer requests."
        );

        if (newName) {
          await setDoc(userRef, {
            name: newName,
            role: "member",
          });
          setUserName(newName);
        }
      } else {
        setUserName(docSnap.data().name || "");
        setRole(docSnap.data().role || "");
      }
      setUser(userCredential.user);
      setError("");
      navigate("/prayer-requests"); // <-- Add this line to redirect
    } catch (error) {
      setError("Login failed: " + error.message);
    }
  };

  // Sign up handler
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user);
      setError(
        "Sign up successful! Please check your email to verify your account before logging in."
      );
      await signOut(auth);
    } catch (error) {
      setError("Sign up failed: " + error.message);
    }
  };

  // Add a prayer request
  const handleAddPrayerRequest = async (e) => {
    e.preventDefault();
    if (!prayerText.trim()) return;
    try {
      await addDoc(collection(db, "prayerRequests"), {
        text: prayerText,
        createdBy: user.uid,
        createdByName: userName,
        createdAt: serverTimestamp(),
        status: "open",
        answeredNote: "",
        prayedForBy: [],
      });
      setPrayerText("");
      refreshPrayerRequests();
    } catch (error) {
      console.error("Error adding prayer request:", error);
    }
  };

  // Edit a prayer request
  const handleEditPrayerRequest = async (id) => {
    try {
      await updateDoc(doc(db, "prayerRequests", id), {
        text: editingText,
      });
      setEditingId(null);
      setEditingText("");
      refreshPrayerRequests();
    } catch (error) {
      console.error("Error editing prayer request:", error);
    }
  };

  // Delete a prayer request
  const handleDeletePrayerRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prayer request?"))
      return;
    try {
      await deleteDoc(doc(db, "prayerRequests", id));
      refreshPrayerRequests();
    } catch (error) {
      console.error("Error deleting prayer request:", error);
    }
  };

  // Mark as answered
  const handleMarkAsAnswered = async (id, note) => {
    if (!note.trim()) return;
    try {
      await updateDoc(doc(db, "prayerRequests", id), {
        status: "answered",
        answeredNote: note,
        updatedAt: serverTimestamp(),
      });
      setAnsweredNotes((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      refreshPrayerRequests();
    } catch (error) {
      console.error("Error marking as answered:", error);
    }
  };

  // Refresh prayer requests list
  const refreshPrayerRequests = async () => {
    const q = query(
      collection(db, "prayerRequests"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const requests = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    setPrayerRequests(requests);
  };

  // UI
  return (
    <div className="container-lg py-4">
      <Header />
      <NavBar user={user} role={role} handleLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={<HomePage user={user} userName={userName} />}
        />
        <Route
          path="/prayer-requests"
          element={
            <PrayerRequestsPage
              prayerText={prayerText}
              setPrayerText={setPrayerText}
              prayerRequests={prayerRequests}
              editingId={editingId}
              setEditingId={setEditingId}
              editingText={editingText}
              setEditingText={setEditingText}
              answeredNote={answeredNote}
              setAnsweredNote={setAnsweredNote}
              showAnsweredId={showAnsweredId}
              setShowAnsweredId={setShowAnsweredId}
              answeredNotes={answeredNotes}
              setAnsweredNotes={setAnsweredNotes}
              handleAddPrayerRequest={handleAddPrayerRequest}
              handleEditPrayerRequest={handleEditPrayerRequest}
              handleDeletePrayerRequest={handleDeletePrayerRequest}
              handleMarkAsAnswered={handleMarkAsAnswered}
              user={user}
              userName={userName}
              role={role}
            />
          }
        />
        <Route
          path="/admin"
          element={
            <AdminDashboardPage
              allUsers={allUsers}
              usersLoading={usersLoading}
              handleRoleChange={handleRoleChange}
              handleDeleteUser={handleDeleteUser}
              user={user}
              role={role}
            />
          }
        />
        <Route
          path="/login"
          element={
            <LoginPage
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              signupName={signupName}
              setSignupName={setSignupName}
              authMode={authMode}
              setAuthMode={setAuthMode}
              handleLogin={handleLogin}
              handleSignUp={handleSignUp}
              error={error}
            />
          }
        />
        {/* Optional: fallback for unknown routes */}
        <Route
          path="*"
          element={<HomePage user={user} userName={userName} />}
        />
      </Routes>
    </div>
  );
}

export default App;
