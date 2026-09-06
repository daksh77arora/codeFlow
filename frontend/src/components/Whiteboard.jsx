import { useEffect } from "react";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { io } from "socket.io-client";

// Connect to backend
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? window.location.origin : "http://localhost:3000");
// Socket needs base URL, not /api
const SOCKET_URL = API_URL.replace("/api", "");

const socket = io(SOCKET_URL);

const Whiteboard = ({ roomId }) => {
    useEffect(() => {
        if (!roomId) return;

        socket.emit("join-room", roomId);

        // Listen for updates from other users
        const handleUpdate = () => {
            try {
                // We'll leave this empty for now as simple broadcasting needs internal tldraw store access
                // Ideally we need to access the store instance to merge updates.
                // Tldraw provides useEditor hook for this inside the component.
                // But for outside, we might need a custom store or use the editor instance.
            } catch (e) {
                console.error("Error applying update", e);
            }
        };

        socket.on("whiteboard-update", handleUpdate);

        return () => {
            socket.off("whiteboard-update", handleUpdate);
        };
    }, [roomId]);

    const handleMount = (editor) => {
        // Listen for local changes and broadcast
        editor.store.listen((update) => {
            // Only emit if the change originated from this client (source: 'user')
            if (update.source === "user") {
                socket.emit("whiteboard-update", { roomId, update });
            }
        });

        // Listen for remote updates and apply them
        socket.on("whiteboard-update", (update) => {
            editor.store.mergeRemoteChanges(() => {
                // Tldraw expects an array of records to put/remove?
                // The 'update' from listen() is { changes: {...}, source: 'user' }
                // We need to parse that.
                // Actually, the easiest way for simple sync is broadcasting the whole record or using Yjs.
                // For a simple socket impl, let's just merge changes.

                const { changes } = update;
                // changes format: { added: {}, updated: {}, removed: {} }

                // We need to apply these changes to the store
                // editor.store.applyDiff? No, mergeRemoteChanges is for Yjs mainly.
                // Let's manually apply.

                const { added, updated, removed } = changes;

                // Added
                Object.values(added).forEach(record => {
                    editor.store.put([record]);
                });

                // Updated
                Object.values(updated).forEach(([, to]) => {
                    editor.store.put([to]);
                });

                // Removed
                Object.values(removed).forEach(record => {
                    editor.store.remove([record.id]);
                });
            });
        });
    };

    return (
        <div className="h-full w-full relative">
            <Tldraw
                persistenceKey={`whiteboard-${roomId}`}
                onMount={handleMount}
            />
        </div>
    );
};

export default Whiteboard;
