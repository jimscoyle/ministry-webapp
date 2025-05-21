import React from "react";

function PrayerRequestsPage({
  prayerText, setPrayerText, prayerRequests,
  editingId, setEditingId, editingText, setEditingText,
  answeredNote, setAnsweredNote, showAnsweredId, setShowAnsweredId,
  answeredNotes, setAnsweredNotes,
  handleAddPrayerRequest, handleEditPrayerRequest, handleDeletePrayerRequest, handleMarkAsAnswered,
  user, userName, role
}) {
  return (
    <div>
      <h2>Prayer Requests</h2>
      <form onSubmit={handleAddPrayerRequest}>
        <input
          value={prayerText}
          onChange={e => setPrayerText(e.target.value)}
          placeholder="Enter prayer request"
          style={{ width: "75%", marginRight: 8 }}
        />
        <button type="submit">Add</button>
      </form>
      <ul style={{ marginTop: 24 }}>
        {prayerRequests.map(req => (
          <li key={req.id} style={{ marginBottom: 18 }}>
            {editingId === req.id ? (
              <>
                <input
                  value={editingText}
                  onChange={e => setEditingText(e.target.value)}
                  style={{ width: "60%" }}
                />
                <button onClick={() => handleEditPrayerRequest(req.id)} style={{ marginLeft: 8 }}>Save</button>
                <button onClick={() => setEditingId(null)} style={{ marginLeft: 4 }}>Cancel</button>
              </>
            ) : (
              <>
                <b>{req.text}</b> <span style={{ color: "#999" }}>— {req.createdByName}</span>
                {req.status === "answered" && (
                  <div style={{ color: "green", marginTop: 4 }}>
                    <strong>Answered:</strong> {req.answeredNote}
                  </div>
                )}
                {(user && (role === "admin" || role === "pastor" || user.uid === req.createdBy)) && (
                  <div style={{ marginTop: 4 }}>
                    <button onClick={() => { setEditingId(req.id); setEditingText(req.text); }}>
                      Edit
                    </button>
                    <button onClick={() => handleDeletePrayerRequest(req.id)} style={{ marginLeft: 8 }}>
                      Delete
                    </button>
                    {req.status !== "answered" && (
                      <>
                        <button
                          style={{ marginLeft: 8 }}
                          onClick={() =>
                            setShowAnsweredId(showAnsweredId === req.id ? null : req.id)
                          }
                        >
                          Mark as Answered
                        </button>
                        {showAnsweredId === req.id && (
                          <span style={{ marginLeft: 8 }}>
                            <input
                              value={answeredNotes[req.id] || ""}
                              onChange={e =>
                                setAnsweredNotes({ ...answeredNotes, [req.id]: e.target.value })
                              }
                              placeholder="How was it answered?"
                              style={{ width: 150 }}
                            />
                            <button
                              onClick={() => {
                                handleMarkAsAnswered(req.id, answeredNotes[req.id] || "");
                                setShowAnsweredId(null);
                              }}
                              style={{ marginLeft: 4 }}
                            >
                              Save
                            </button>
                          </span>
                        )}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PrayerRequestsPage;
