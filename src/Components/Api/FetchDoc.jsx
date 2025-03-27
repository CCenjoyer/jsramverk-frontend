import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import toast from "../Common/toast.jsx";

const apiKey = process.env.REACT_APP_API_LINK;

const FetchDoc = () => {
    const { id } = useParams();
    const [docs, setDocs] = useState(null);
    const [shareEmail, setShareEmail] = useState("");
    const [quote, setQuote] = useState("");
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();
    const xAccessToken = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user"));
    let socketRef = useRef(null);

    useEffect(() => {
        if (!user && xAccessToken) {
            navigate("/login");
            toast("Please log in to access your documents.");
            return;
        }

        // Initialize the socket connection
        const socket = io(process.env.REACT_APP_API_LINK);
        socketRef.current = socket; // Store the socket instance in the ref

        fetch(apiKey + `/docs/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": xAccessToken,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.data.users.includes(user.email)) {
                    socket.emit("create", data.data._id);
                    console.log("Creating socket connection...");
                    setDocs(data.data); // Accessing the array inside the `data` property
                    if (data.data.comments) {
                        setComments(data.data.comments);
                    }
                    console.log(data.data);
                } else {
                    toast("You do not have access to this document.");
                    setTimeout(() => {
                        navigate("/");
                    }, 1000);
                }
            })
            .catch((err) => console.error("Error fetching data:", err));

        // Listen for document updates from the server
        socket.on("documentUpdated", ({ title, content }) => {
            setDocs((prevDocs) => ({
                ...prevDocs,
                title,
                content,
            }));
        });

        socket.on("commentReceived", (comment) => {
            console.log("Received comment:", comment);
            setComments((prevComments) => [...prevComments, comment]);
        });

        // Listen for the `commentDeleted` event
        socket.on("commentDeleted", ({ commentId }) => {
            console.log(`Comment deleted: ${commentId}`);
            setComments((prevComments) =>
                prevComments.filter((comment) => comment._id !== commentId)
            );
        });

        return () => {
            console.log("Disconnecting socket...");
            socket.disconnect();
        };
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDocs((prevDocs) => {
            const updatedDocs = {
                ...prevDocs,
                [name]: value,
            };

            // Emit the updateDocument event through the socket
            if (socketRef.current) {
                socketRef.current.emit("updateDocument", {
                    room: id,
                    title: updatedDocs.title,
                    content: updatedDocs.content,
                });
            }

            return updatedDocs;
        });
    };

    // Handle form submission for PUT request
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        fetch(apiKey + `/docs/${id}`, {
            method: "PUT", // Use PUT method
            headers: {
                "Content-Type": "application/json",
                "x-access-token": xAccessToken,
            },
            body: JSON.stringify(docs), // Send the updated document data as JSON
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    navigate("/");
                } else {
                    toast("Failed to update document.");
                }
            })
            .catch((err) => console.error("Error updating document:", err));
    };

    const handleDelete = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        fetch(apiKey + `/docs/${id}`, {
            method: "DELETE", // Use DELETE method
            headers: {
                "Content-Type": "application/json",
                "x-access-token": xAccessToken,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    navigate("/");
                } else {
                    toast("Failed to delete document.");
                }
            })
            .catch((err) => console.error("Error deleting document:", err));
    };

    const handleShareChange = (e) => {
        setShareEmail(e.target.value);
    };

    const handleTextSelect = (e) => {
        const selection = e.target.value.substring(
            e.target.selectionStart,
            e.target.selectionEnd
        );
        document.querySelector(".comment-form").style.visibility = selection
            ? "visible"
            : "hidden";
        setQuote(selection);
        setComment("");
    };

    const handleCommentSubmit = (e, quote, content) => {
        e.preventDefault(); // Prevent default form submission behavior
        let comment = { quote, content };

        if (socketRef.current) {
            socketRef.current.emit("comment", {
                room: id,
                comment,
            });
        }
        document.querySelector(".comment-form").style.visibility = "hidden";
        // Instead of using setComments, we wait for the socket event to update the comments
        // setComments((prevComments) => [...prevComments, { quote, content }]);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleCommentDelete = (commentId) => {
        if (socketRef.current) {
            socketRef.current.emit("deleteComment", {
                room: id,
                commentId,
            });
        }
    };

    const handleShare = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        fetch(apiKey + `/docs/${id}/share`, {
            method: "POST", // Use POST method
            headers: {
                "Content-Type": "application/json",
                "x-access-token": xAccessToken,
            },
            body: JSON.stringify({ user: user.email, addEmail: shareEmail }), // Send the email to share the document with
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    toast("Document shared successfully.");
                } else {
                    toast("Failed to share document.");
                }
            })
            .catch((err) => console.error("Error sharing document:", err));
    };

    return (
        <div>
            {docs ? (
                <div>
                    <form
                        onSubmit={(e) => handleCommentSubmit(e, quote, comment)}
                        className="comment-form fade-in"
                        style={{
                            position: "absolute",
                            top: "175px",
                            right: "25px",
                            width: "300px",
                            zIndex: 1000,
                            visibility: "hidden",
                        }}
                    >
                        <label htmlFor="comment">Quote:</label>
                        <br></br>
                        <input
                            type="text"
                            name="quote"
                            value={quote}
                            required
                            readOnly
                            style={{ padding: "0", border: "none" }}
                        />
                        <br></br>
                        <label htmlFor="content">Comment:</label>
                        <textarea
                            name="content"
                            value={comment}
                            onChange={handleCommentChange}
                            style={{
                                minHeight: "100px",
                                width: "100%",
                                maxWidth: "100%",
                                padding: "10px",
                            }}
                            required
                        />
                        <input
                            className="green-button"
                            type="submit"
                            value="Create Comment"
                            style={{ width: "100%", marginBottom: "0" }}
                        />
                    </form>

                    <div className="content-and-comments">
                        <form onSubmit={handleSubmit} className="new-doc">
                            <label
                                htmlFor="title"
                                style={{
                                    paddingTop: "10px",
                                    paddingBottom: "20px",
                                }}
                            >
                                Title:
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={docs.title}
                                onChange={handleInputChange}
                                required
                                style={{ width: "350px", padding: "10px" }}
                            />
                            <label htmlFor="content">Content:</label>
                            <div className="content-section">
                                <textarea
                                    name="content"
                                    value={docs.content}
                                    onChange={handleInputChange}
                                    style={{
                                        padding: "10px",
                                        minHeight: "500px",
                                        minWidth: "350px",
                                    }}
                                    onSelect={handleTextSelect}
                                />
                            </div>
                            <br></br>
                            <input
                                className="blue-button"
                                type="submit"
                                value="Save Changes"
                                style={{ width: "350px" }}
                            />
                        </form>

                        <div className="comment-section">
                            <div>
                                {comments.map((individualComment, index) => (
                                    <div
                                        key={index}
                                        className="comment fade-in"
                                    >
                                        <div>
                                            <strong>
                                                &quot;
                                                {individualComment.quote}
                                                &quot;
                                            </strong>
                                        </div>
                                        <div>{individualComment.comment}</div>
                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                handleCommentDelete(
                                                    individualComment._id
                                                )
                                            }
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <details style={{ position: "static", marginTop: "20px" }}>
                        <br></br>
                        <form
                            onSubmit={handleShare}
                            className="share-doc"
                            style={{ width: "100%" }}
                        >
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={shareEmail}
                                onChange={handleShareChange}
                                required
                                style={{ width: "350px", padding: "10px" }}
                            />
                            <input
                                className="green-button"
                                type="submit"
                                value="Share Document"
                            />
                        </form>
                        <form onSubmit={handleDelete} className="delete-doc">
                            <input
                                className="red-button"
                                type="submit"
                                value="Delete Document"
                                style={{ width: "350px" }}
                            />
                        </form>
                    </details>
                </div>
            ) : (
                <h3>Loading...</h3>
            )}
        </div>
    );
};

export default FetchDoc;
