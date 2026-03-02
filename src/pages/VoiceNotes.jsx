import { useState, useRef, useEffect } from "react";
import { Mic, Video, Trash2, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

// Backend URL – your Express API running locally
const BACKEND_URL = "http://localhost:5000";

export default function VoiceNotes() {
  // ---------------- STATE ----------------
  const [isRecording, setIsRecording] = useState(false);
  const [recordType, setRecordType] = useState("audio"); // audio or video
  const [notes, setNotes] = useState([]); // all voice notes
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recordTime, setRecordTime] = useState(0);
  const [filter, setFilter] = useState("all"); // filter by type
  const [loading, setLoading] = useState(true);

  const [activeComments, setActiveComments] = useState(null); // current note showing comments
  const [comments, setComments] = useState({}); // comments per note
  const [newComment, setNewComment] = useState({}); // input state per note

  // ---------------- REFS ----------------
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const timerRef = useRef(null);

  const token = localStorage.getItem("token"); // JWT from login

  // ---------------- FETCH NOTES ----------------
  useEffect(() => {
    fetchNotes();
  }, [filter]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/voice-notes?type=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data.data || []);
    } catch (err) {
      console.error("Fetch notes error:", err.response?.data || err.message);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RECORDING ----------------
  const startRecording = async (type) => {
    try {
      setRecordType(type);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === "video",
      });
      streamRef.current = stream;

      if (type === "video" && videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      setRecordTime(0);

      // Push data chunks while recording
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      // When recording stops
      recorder.onstop = async () => {
        clearInterval(timerRef.current);

        const blob = new Blob(chunksRef.current, {
          type: type === "video" ? "video/webm" : "audio/webm",
        });

        const file = new File([blob], `${Date.now()}.webm`, { type: blob.type });

        await uploadFile(file, type);

        // Stop all tracks
        stream.getTracks().forEach((t) => t.stop());
        if (videoPreviewRef.current) videoPreviewRef.current.srcObject = null;
      };

      recorder.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => setRecordTime((prev) => prev + 1), 1000);
    } catch (err) {
      console.error("Recording error:", err);
      toast.error("Camera/Microphone permission denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // ---------------- UPLOAD FILE ----------------
  const uploadFile = async (file, type) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mediaType", type);

      const res = await axios.post(`${BACKEND_URL}/api/voice-notes/upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => setUploadProgress(Math.round((event.loaded * 100) / event.total)),
      });

      // Add new note to top
      setNotes((prev) => [res.data.data, ...prev]);
      setUploadProgress(0);
      toast.success("Uploaded successfully");
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      toast.error("Upload failed");
      setUploadProgress(0);
    }
  };

  // ---------------- DELETE NOTE ----------------
  const deleteNote = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/voice-notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((n) => n.id !== id));
      toast.success("Deleted");
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      toast.error("Delete failed");
    }
  };

  // ---------------- REACTIONS ----------------
  const reactToNote = async (id) => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/voice-notes/${id}/react`,
        { type: "like" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? { ...note, reactions_count: res.data.count } : note))
      );
    } catch (err) {
      console.error("React error:", err.response?.data || err.message);
      toast.error("Reaction failed");
    }
  };

  // ---------------- COMMENTS ----------------
  const loadComments = async (id) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/voice-notes/${id}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => ({ ...prev, [id]: res.data }));
      setActiveComments(id);
    } catch (err) {
      console.error("Load comments error:", err.response?.data || err.message);
      toast.error("Failed to load comments");
    }
  };

  const addComment = async (id) => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/voice-notes/${id}/comment`,
        { comment: newComment[id] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment((prev) => ({ ...prev, [id]: "" }));
      loadComments(id);
    } catch (err) {
      console.error("Add comment error:", err.response?.data || err.message);
      toast.error("Comment failed");
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Voice Notes</h2>

      {/* Record Controls */}
      <div className="flex gap-2">
        <Button onClick={() => startRecording("audio")} disabled={isRecording}>
          <Mic /> Record Audio
        </Button>
        <Button onClick={() => startRecording("video")} disabled={isRecording}>
          <Video /> Record Video
        </Button>
        {isRecording && (
          <Button variant="destructive" onClick={stopRecording}>
            Stop
          </Button>
        )}
      </div>

      {/* Timer & Progress */}
      {isRecording && <p>Recording Time: {recordTime}s</p>}
      {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}

      {/* Video Preview */}
      {recordType === "video" && <video ref={videoPreviewRef} autoPlay muted className="w-full h-64 mt-2" />}

      {/* Notes List */}
      <div className="space-y-2 mt-4">
        {loading ? (
          <p>Loading notes...</p>
        ) : notes.length === 0 ? (
          <p>No notes found</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="p-2 border rounded flex flex-col gap-2">
              {/* Audio/Video Player */}
              {note.media_type === "audio" ? (
                <audio controls src={note.url}></audio>
              ) : (
                <video controls className="w-full h-48" src={note.url}></video>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={() => reactToNote(note.id)}>
                  <Heart /> {note.reactions_count || 0}
                </Button>
                <Button onClick={() => deleteNote(note.id)}>
                  <Trash2 /> Delete
                </Button>
                <Button onClick={() => loadComments(note.id)}>
                  <MessageCircle /> Comments
                </Button>
              </div>

              {/* Comments Section */}
              {activeComments === note.id && (
                <div className="mt-2 space-y-1">
                  {comments[note.id]?.map((c) => (
                    <p key={c.id} className="text-sm border p-1 rounded">
                      <strong>{c.user_name}:</strong> {c.comment}
                    </p>
                  ))}
                  <input
                    type="text"
                    value={newComment[note.id] || ""}
                    onChange={(e) =>
                      setNewComment((prev) => ({ ...prev, [note.id]: e.target.value }))
                    }
                    placeholder="Add comment"
                    className="border p-1 rounded w-full"
                  />
                  <Button onClick={() => addComment(note.id)}>Submit</Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}