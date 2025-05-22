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
    <div className="container mt-4">
      <h2 className="mb-4">Prayer Requests</h2>
      <form className="d-flex mb-4 gap-2" onSubmit={handleAddPrayerRequest}>
        <input
          value={prayerText}
          onChange={e => setPrayerText(e.target.value)}
          placeholder="Enter prayer request"
          className="form-control"
        />
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>
      <ul className="list-group">
        {prayerRequests.map(req => (
          <li key={req.id} className="list-group-item mb-3">
            {editingId === req.id ? (
              <div className="d-flex align-items-center gap-2">
                <input
                  value={editingText}
                  onChange={e => setEditingText(e.target.value)}
                  className="form-control"
                  style={{ maxWidth: 350 }}
                />
                <button onClick={() => handleEditPrayerRequest(req.id)} className="btn btn-success btn-sm">
                  Save
                </button>
                <button onClick={() => setEditingId(null)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <b>{req.text}</b>
                    <span className="text-muted ms-2">— {req.createdByName}</span>
                  </div>
                  {(user && (role === "admin" || role === "pastor" || user.uid === req.createdBy)) && (
                    <div className="btn-group">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => { setEditingId(req.id); setEditingText(req.text); }}>
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeletePrayerRequest(req.id)}>
                        Delete
                      </button>
                      {req.status !== "answered" && (
                        <>
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() =>
                              setShowAnsweredId(showAnsweredId === req.id ? null : req.id)
                            }
                          >
                            Mark as Answered
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {req.status === "answered" && (
                  <div className="alert alert-success mt-2 py-2 px-3">
                    <strong>Answered:</strong> {req.answeredNote}
                  </div>
                )}
                {showAnsweredId === req.id && (
                  <div className="mt-2 d-flex align-items-center gap-2">
                    <input
                      value={answeredNotes[req.id] || ""}
                      onChange={e =>
                        setAnsweredNotes({ ...answeredNotes, [req.id]: e.target.value })
                      }
                      placeholder="How was it answered?"
                      className="form-control"
                      style={{ maxWidth: 250 }}
                    />
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => {
                        handleMarkAsAnswered(req.id, answeredNotes[req.id] || "");
                        setShowAnsweredId(null);
                      }}
                    >
                      Save
                    </button>
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
