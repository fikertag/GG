"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { pusherClient } from "@/lib/pusher";

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
          console.log("Invalid format in localStorage.");
        }
      } catch (error) {
        throw error;
      }
    }
  }, []);

  useEffect(() => {
    const channel = pusherClient.subscribe("insults");

    // Listen for "update-insult" events
    channel.bind("update-insult", (updatedInsult: Insult) => {
      setInsults((prev) =>
        prev.map((insult) =>
          insult._id === updatedInsult._id ? updatedInsult : insult
        )
      );
    });

    // Cleanup on unmount
    return () => {
      channel.unbind("update-insult");
      pusherClient.unsubscribe("insults");
    };
  }, []);

  useEffect(() => {
    const channel = pusherClient.subscribe("insults");
  
    // Listen for "update-insult" events
    channel.bind("update-insult", (updatedInsult: Insult) => {
      setInsults((prev) =>
        prev.map((insult) =>
          insult._id === updatedInsult._id ? updatedInsult : insult
        )
      );
    });
  
    // Listen for "new-insult" events
    channel.bind("new-insult", (newInsult: Insult) => {
      setInsults((prev) => [newInsult, ...prev]); // Add the new insult to the top of the list
    });
  
    // Cleanup on unmount
    return () => {
      channel.unbind("update-insult");
      channel.unbind("new-insult");
      pusherClient.unsubscribe("insults");
    };
  }, []);

  // Fetch insults from the API
  const fetchInsults = async () => {
    try {
      const response = await axios.get("/api/insult"); // Adjust the API endpoint
      setInsults(response.data);
    } catch (error) {
      throw error;
    }
  };

  // Add a new insult
  const addInsult = async (detail: string) => {
    try {
      await axios.post("/api/insult", { detail }); // Adjust the API endpoint
    } catch (error) {
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
      throw error;}
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
   throw error;
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
