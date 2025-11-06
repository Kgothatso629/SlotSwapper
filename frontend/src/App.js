import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import API from "./api";

function App() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [events, setEvents] = useState([]);
  const [swappableSlots, setSwappableSlots] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);

  const login = async (email, password) => {
    const res = await API.post("/users/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    navigate("/dashboard");
  };

  const signup = async (name, email, password) => {
    await API.post("/users/signup", { name, email, password });
    await login(email, password);
  };

  const fetchEvents = async () => {
    const res = await API.get("/events");
    setEvents(res.data);
  };

  const fetchSwappableSlots = async () => {
    const res = await API.get("/swaps/swappable-slots");
    setSwappableSlots(res.data);
  };

  useEffect(() => {
    if (token) {
      fetchEvents();
      fetchSwappableSlots();
    }
  }, [token]);

  return (
    <div className="container">
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/marketplace">Marketplace</Link>
      </nav>
      <Routes>
        <Route path="/dashboard" element={<Dashboard events={events} fetchEvents={fetchEvents} />} />
        <Route path="/marketplace" element={<Marketplace slots={swappableSlots} fetchSlots={fetchSwappableSlots} />} />
      </Routes>
    </div>
  );
}

const Dashboard = ({ events, fetchEvents }) => {
  const makeSwappable = async (id) => {
    await API.patch(`/events/${id}`, { status: "SWAPPABLE" });
    fetchEvents();
  };
  return (
    <div>
      <h2>My Events</h2>
      {events.map((e) => (
        <div key={e._id}>
          {e.title} - {e.status}{" "}
          {e.status === "BUSY" && <button onClick={() => makeSwappable(e._id)}>Make Swappable</button>}
        </div>
      ))}
    </div>
  );
};

const Marketplace = ({ slots, fetchSlots }) => {
  return (
    <div>
      <h2>Swappable Slots</h2>
      {slots.map((s) => (
        <div key={s._id}>
          {s.title} - {new Date(s.startTime).toLocaleString()}{" "}
          <button>Request Swap</button>
        </div>
      ))}
    </div>
  );
};

export default App;
