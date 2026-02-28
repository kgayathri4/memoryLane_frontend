import { useState, useRef, useEffect } from "react";
import {
  Mic,
  Video,
  Square,
  Trash2,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";

export default function VoiceNotes() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordType, setRecordType] = useState("audio");
  const [notes, setNotes] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recordTime, setRecordTime] = useState(0);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [activeComments, setActiveComments] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const timerRef = useRef(null);

  const token = localStorage.getItem("token");

  // ================= FETCH NOTES =================
  useEffect(() => {
    fetchNotes();
  }, [filter]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/voice-notes?type=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data.data);
    } catch {
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  // ================= RECORDING =================
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

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        clearInterval(timerRef.current);

        const blob = new Blob(chunksRef.current, {
          type: type === "video" ? "video/webm" : "audio/webm",
        });

        const file = new File([blob], `${Date.now()}.webm`, {
          type: blob.type,
        });

        await uploadFile(file, type);

        stream.getTracks().forEach((t) => t.stop());
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = null;
        }
      };

      recorder.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } catch {
      toast.error("Camera/Microphone permission denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // ================= UPLOAD =================
  const uploadFile = async (file, type) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mediaType", type);

      const res = await api.post("/voice-notes/upload", formData, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });

      setNotes((prev) => [res.data.data, ...prev]);
      setUploadProgress(0);
      toast.success("Uploaded successfully");
    } catch {
      toast.error("Upload failed");
      setUploadProgress(0);
    }
  };

  // ================= DELETE =================
  const deleteNote = async (id) => {
    try {
      await api.delete(`/voice-notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes((prev) => prev.filter((note) => note.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= REACTIONS =================
  const reactToNote = async (id) => {
    try {
      const res = await api.post(
        `/voice-notes/${id}/react`,
        { type: "like" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotes((prev) =>
        prev.map((note) =>
          note.id === id
            ? { ...note, reactions_count: res.data.count }
            : note
        )
      );
    } catch {
      toast.error("Reaction failed");
    }
  };

  // ================= COMMENTS =================
  const loadComments = async (id) => {
    try {
      const res = await api.get(`/voice-notes/${id}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments((prev) => ({
        ...prev,
        [id]: res.data,
      }));

      setActiveComments(id);
    } catch {
      toast.error("Failed to load comments");
    }
  };

  const addComment = async (id) => {
    try {
      await api.post(
        `/voice-notes/${id}/comment`,
        { comment: newComment[id] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewComment((prev) => ({ ...prev, [id]: "" }));
      loadComments(id);
    } catch {
      toast.error("Comment failed");
    }
  };

  // ================= UI =================
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Voice & Video Notes</h1>

      {/* FILTER */}
      <div className="flex gap-3 mb-6">
        <Button onClick={() => setFilter("all")}>All</Button>
        <Button onClick={() => setFilter("audio")}>Audio</Button>
        <Button onClick={() => setFilter("video")}>Video</Button>
      </div>

      {/* VIDEO PREVIEW */}
      {recordType === "video" && isRecording && (
        <video
          ref={videoPreviewRef}
          autoPlay
          muted
          className="w-full rounded-lg mb-6"
        />
      )}

      {/* RECORD BUTTONS */}
      <div className="flex justify-center gap-6 mb-6">
        {!isRecording ? (
          <>
            <button
              onClick={() => startRecording("audio")}
              className="w-20 h-20 rounded-full bg-primary flex items-center justify-center"
            >
              <Mic className="w-8 h-8 text-white" />
            </button>

            <button
              onClick={() => startRecording("video")}
              className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center"
            >
              <Video className="w-8 h-8 text-white" />
            </button>
          </>
        ) : (
          <button
            onClick={stopRecording}
            className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center animate-pulse"
          >
            <Square className="w-8 h-8 text-white" />
          </button>
        )}
      </div>

      {isRecording && (
        <p className="text-center text-red-500 mb-4">
          Recording... {recordTime}s
        </p>
      )}

      {/* UPLOAD PROGRESS */}
      {uploadProgress > 0 && (
        <div className="mb-6">
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* NOTES */}
      {!loading && notes.length === 0 && (
        <p className="text-muted-foreground text-center">
          No notes found.
        </p>
      )}

      <div className="space-y-6">
        {notes.map((note) => (
          <div key={note.id} className="p-4 border rounded-lg">
            {note.media_type === "video" ? (
              <video
                src={note.media_url}
                controls
                poster={note.thumbnail_url || ""}
                className="w-full rounded mb-3"
              />
            ) : (
              <audio
                src={note.media_url}
                controls
                className="w-full mb-3"
              />
            )}

            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {new Date(note.created_at).toLocaleString()}
              </span>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => reactToNote(note.id)}
                  className="flex items-center gap-1"
                >
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-xs">
                    {note.reactions_count || 0}
                  </span>
                </button>

                <button onClick={() => loadComments(note.id)}>
                  <MessageCircle className="w-4 h-4" />
                </button>

                <button onClick={() => deleteNote(note.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>

            {/* COMMENTS */}
            {activeComments === note.id && (
              <div className="mt-4">
                <div className="space-y-2 mb-2">
                  {comments[note.id]?.map((c) => (
                    <div
                      key={c.id}
                      className="text-sm bg-muted p-2 rounded"
                    >
                      {c.comment}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    value={newComment[note.id] || ""}
                    onChange={(e) =>
                      setNewComment((prev) => ({
                        ...prev,
                        [note.id]: e.target.value,
                      }))
                    }
                    className="flex-1 border rounded px-2 py-1 text-sm"
                    placeholder="Write a comment..."
                  />
                  <Button onClick={() => addComment(note.id)}>
                    Send
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}