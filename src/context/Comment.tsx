"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { pusherClient } from "@/lib/pusher";

interface Comment {
  _id: string;
  text: string;
  insultId: string;
  createdAt: string;
  updatedAt: string;
}

interface CommentContextType {
  comments: Comment[];
  isComment: string;
  setIsComment: (id: string) => void;
  fetchComments: () => Promise<void>;
  addComments: (text: string, insultId: string) => Promise<void>;
}

const CommentContext = createContext<CommentContextType>({
  comments: [],
  isComment: "",
  setIsComment: () => {},
  fetchComments: async () => {},
  addComments: async () => {},
});

export const CommentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isComment, setIsComment] = useState<string>("");

  // Fetch comments on component mount
  useEffect(() => {
    fetchComments();
  }, []);

  // Initialize Pusher client
  useEffect(() => {
    const channel = pusherClient.subscribe("comments");

    // Bind to the "new-comment" event
    channel.bind("new-comment", (newComment: Comment) => {
      setComments((prev) => [...prev, newComment]);
    });

    // Cleanup on unmount
    return () => {
      channel.unbind("new-comment");
      pusherClient.unsubscribe("comments");
    };
  }, []);

  // Fetch comments from the API
  const fetchComments = async () => {
    try {
      const response = await axios.get("/api/comment");
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Add a new comment ll
  const addComments = async (text: string, insultId: string) => {
    try {
      await axios.post("/api/comment", { text, insultId });
      // Do not manually update the state here. Let Pusher handle it.
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <CommentContext.Provider
      value={{
        comments,
        isComment,
        setIsComment,
        addComments,
        fetchComments,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};

export const useComments = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useComments must be used within a CommentProvider");
  }
  return context;
};
