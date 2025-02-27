"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Define the type for an insult
interface Comment {
  _id: string;
  text: string;
  insultId: string;
  createdAt: string;
  updatedAt: string;
}

// Define the type for the context
interface CommentContextType {
  comments: Comment[];
  isComment: string;
  setIsComment: (id: string) => void;
  fetchComments: () => Promise<void>;
  addComments: (text: string, insultId: string) => Promise<void>;
}

// Create the context
const CommentContext = createContext<CommentContextType>({
  comments: [],
  isComment: "",
  setIsComment: async () => {},
  fetchComments: async () => {},
  addComments: async () => {},
});

// Create the provider component
export const CommentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isComment, setIsComment] = useState<string>("");

  // Fetch insults from the API
  const fetchComments = async () => {
    try {
      const response = await axios.get("/api/comment"); // Adjust the API endpoint
      setComments(response.data);
    } catch (error) {
      throw error;
    }
  };

  // Add a new insult
  const addComments = async (text: string, insultId: string) => {
    try {
      const response = await axios.post("/api/comment", { text, insultId }); // Adjust the API endpoint
      setComments((prev) => [ ...prev, response.data]);
    } catch (error) {
      throw error;
    }
  };

  // Fetch insults on component mount
  useEffect(() => {
    fetchComments();
  }, []);

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

// Custom hook to consume the context
export const useComments = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useInsults must be used within an InsultProvider");
  }
  return context;
};
