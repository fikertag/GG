"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Define the type for an insult
interface Insult {
  _id: string;
  detail: string;
  like: number;
  dislike: number;
  comments: string[]; // Assuming comments are just strings for simplicity
  createdAt: string;
  updatedAt: string;
}

// Define the type for the context
interface InsultContextType {
  insults: Insult[];
  likedInsults: { id: string; type: string }[];
  selectedInsult: string;
  setSelectedInsult: (id: string) => void;
  addInsult: (detail: string) => Promise<void>;
  likeInsult: (id: string) => Promise<void>;
  dislikeInsult: (id: string) => Promise<void>;
  fetchInsults: () => Promise<void>;
}

// Create the context
const InsultContext = createContext<InsultContextType>({
  insults: [],
  likedInsults: [],
  selectedInsult: "",
  setSelectedInsult: () => {},
  addInsult: async () => {},
  likeInsult: async () => {},
  dislikeInsult: async () => {},
  fetchInsults: async () => {},
});

// Create the provider component
export const InsultProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [insults, setInsults] = useState<Insult[]>([]);
  const [selectedInsult, setSelectedInsult] = useState<string>("");
  const [likedInsults, setLikedInsults] = useState<
    { id: string; type: string }[]
  >([]);

  useEffect(() => {
    const storedVotes = localStorage.getItem("voted");

    if (storedVotes) {
      try {
        const votes = JSON.parse(storedVotes);

        if (
          Array.isArray(votes) &&
          votes.every(
            (vote) =>
              typeof vote.id === "string" && typeof vote.type === "string"
          )
        ) {
          setLikedInsults(votes);
        } else {
          console.error("Invalid format in localStorage.");
        }
      } catch (error) {
        console.error("Error parsing liked insults from localStorage:", error);
      }
    }
  }, []);

  // Fetch insults from the API
  const fetchInsults = async () => {
    try {
      const response = await axios.get("/api/insult"); // Adjust the API endpoint
      setInsults(response.data);
    } catch (error) {
      console.error("Failed to fetch insults:", error);
    }
  };

  // Add a new insult
  const addInsult = async (detail: string) => {
    try {
      const response = await axios.post("/api/insult", { detail }); // Adjust the API endpoint
      setInsults((prev) => [response.data, ...prev]);
    } catch (error) {
      console.log("Failed to add insult:", error);
      throw error
    }
  };

  // Like an insult

  const likeInsult = async (insultId: string) => {
    // Check if the user has already liked this insult
    if (likedInsults.some((insult) => insult.id === insultId)) return;

    // Optimistic update: Add to liked list and increment like count
    setLikedInsults((prev) => {
      const updatedLikedInsults = [...prev, { id: insultId, type: "like" }];

      // Save each insult's like/dislike status to localStorage
      localStorage.setItem(
        "voted",
        JSON.stringify(updatedLikedInsults) // Save array of objects with insult ID and action type
      );

      return updatedLikedInsults;
    });

    setInsults((prev) =>
      prev.map((insult) =>
        insult._id === insultId ? { ...insult, like: insult.like + 1 } : insult
      )
    );

    try {
      const action = "like";
      const response = await axios.put(`/api/insult`, { insultId, action });

      // Update state with actual response data
      setInsults((prev) =>
        prev.map((insult) => (insult._id === insultId ? response.data : insult))
      );
    } catch (error) {
      console.error("Failed to like insult:", error);

      // Rollback optimistic update if the request fails
      setLikedInsults((prev) =>
        prev.filter((insult) => insult.id !== insultId)
      );

      setInsults((prev) =>
        prev.map((insult) =>
          insult._id === insultId
            ? { ...insult, like: insult.like - 1 }
            : insult
        )
      );

      // Remove from localStorage if the operation fails
      const updatedLikedInsults = likedInsults.filter(
        (insult) => insult.id !== insultId
      );
      localStorage.setItem("voted", JSON.stringify(updatedLikedInsults)); // Update localStorage after rollback
    }
  };

  // Dislike an insult
  // Dislike an insult
  const dislikeInsult = async (insultId: string) => {
    // Check if the user has already liked this insult
    if (likedInsults.some((insult) => insult.id === insultId)) return;

    setLikedInsults((prev) => {
      const updatedLikedInsults = [...prev, { id: insultId, type: "dislike" }]; // Use 'dislike' type for dislikes
      localStorage.setItem("voted", JSON.stringify(updatedLikedInsults)); // Save to localStorage
      return updatedLikedInsults;
    });

    setInsults((prev) =>
      prev.map((insult) =>
        insult._id === insultId
          ? { ...insult, dislike: insult.dislike + 1 }
          : insult
      )
    );

    try {
      const action = "dislike";
      const response = await axios.put(`/api/insult`, { insultId, action }); // Adjust the API endpoint
      setInsults((prev) =>
        prev.map((insult) => (insult._id === insultId ? response.data : insult))
      );
    } catch (error) {
      console.log(error);
      // Rollback optimistic update if the request fails
      setLikedInsults((prev) =>
        prev.filter((insult) => insult.id !== insultId)
      );
      setInsults((prev) =>
        prev.map((insult) =>
          insult._id === insultId
            ? { ...insult, dislike: insult.dislike - 1 }
            : insult
        )
      );

      // Remove from localStorage if the operation fails
      const updatedLikedInsults = likedInsults.filter(
        (insult) => insult.id !== insultId
      );
      localStorage.setItem("voted", JSON.stringify(updatedLikedInsults)); // Update localStorage after rollback
    }
  };

  // Fetch insults on component mount
  useEffect(() => {
    fetchInsults();
  }, []);

  return (
    <InsultContext.Provider
      value={{
        insults,
        addInsult,
        likeInsult,
        dislikeInsult,
        fetchInsults,
        likedInsults,
        selectedInsult,
        setSelectedInsult,
      }}
    >
      {children}
    </InsultContext.Provider>
  );
};

// Custom hook to consume the context
export const useInsults = () => {
  const context = useContext(InsultContext);
  if (!context) {
    throw new Error("useInsults must be used within an InsultProvider");
  }
  return context;
};
