import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Insult from "@/model/Insult";
import { pusherServer } from "@/lib/pusher";
import crypto from "crypto";
import RateLimit from "@/model/RateLimit";

// Define types for request bodies
// interface PostRequestBody {
//   detail: string;
// }

interface PutRequestBody {
  insultId: string;
  action: "like" | "dislike";
}

// GET all insults
export async function GET() {
  await dbConnect();
  try {
    const insults = await Insult.find({}).sort({ createdAt: -1 });
    return NextResponse.json(insults, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Error fetching insults", error: errorMessage },
      { status: 500 }
    );
  }
}

// POST a new insult
// POST a new insult

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { detail } = (await req.json()) as { detail: string };

    if (!detail) {
      return NextResponse.json(
        { message: "Missing required field: detail" },
        { status: 400 }
      );
    }

    const MAX_LENGTH = 400;
    if (detail.length > MAX_LENGTH) {
      return NextResponse.json(
        { message: `Gossip exceeds max length of ${MAX_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Get the user's IP address
    const forwardedFor = req.headers.get("x-forwarded-for");
    const userIP = forwardedFor?.split(",")[0] || "unknown"; // Get first IP if multiple

    // Hash the IP for privacy
    const userHash = crypto.createHash("sha256").update(userIP).digest("hex");

    // Check if the same insult was recently sent
    const existingInsult = await Insult.findOne({ detail });
    if (existingInsult) {
      return NextResponse.json(
        { message: "Duplicate request: This insult was already sent" },
        { status: 403 }
      );
    }

    // Rate limit: Check requests from this userHash in the last 1 minute
    const RATE_LIMIT = 3; // Max requests allowed
    const TIME_WINDOW = 60 * 1000; // 1 minute

    const recentRequests = await RateLimit.countDocuments({
      userHash,
      timestamp: { $gte: new Date(Date.now() - TIME_WINDOW) },
    });

    if (recentRequests >= RATE_LIMIT) {
      return NextResponse.json(
        { message: "Too many requests, please slow down" },
        { status: 429 }
      );
    }

    // Store the request in the RateLimit collection
    await RateLimit.create({ userHash, timestamp: new Date() });

    // Create a new insult
    const insult = await Insult.create({ detail });

    // Emit a Pusher event to notify clients
    await pusherServer.trigger("insults", "new-insult", insult);

    return NextResponse.json(insult, { status: 201 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Error creating insult", error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT to like or dislike an insult
// PUT to like or dislike an insult
export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const { insultId, action } = (await req.json()) as PutRequestBody;

    // Validate required fields
    if (!insultId || !action) {
      return NextResponse.json(
        { message: "Missing required fields: insultId or action" },
        { status: 400 }
      );
    }

    // Extract user IP
    const forwardedFor = req.headers.get("x-forwarded-for");
    const userIP = forwardedFor?.split(",")[0] || "unknown";

    // Hash IP for privacy
    const userHash = crypto.createHash("sha256").update(userIP).digest("hex");

    // Find the insult by ID
    const insult = await Insult.findById(insultId);

    if (!insult) {
      return NextResponse.json(
        { message: "Insult not found" },
        { status: 404 }
      );
    }

    // Increment the like or dislike count based on the action
    // if (action === "like") {
    //   insult.like += 1;
    // } else if (action === "dislike") {
    //   insult.dislike += 1;
    // } else {
    //   return NextResponse.json(
    //     { message: "Invalid action, must be 'like' or 'dislike'" },
    //     { status: 400 }
    //   );
    // }

    // Check for duplicate like/dislike
    if (action === "like") {
      if (insult.likedBy.includes(userHash)) {
        return NextResponse.json(
          { message: "You already liked this" },
          { status: 403 }
        );
      }
      insult.like += 1;
      insult.likedBy.push(userHash);
    } else if (action === "dislike") {
      if (insult.dislikedBy.includes(userHash)) {
        return NextResponse.json(
          { message: "You already disliked this" },
          { status: 403 }
        );
      }
      insult.dislike += 1;
      insult.dislikedBy.push(userHash);
    } else {
      return NextResponse.json(
        { message: "Invalid action, must be 'like' or 'dislike'" },
        { status: 400 }
      );
    }

    // Save the updated insult
    await insult.save();

    // Emit a Pusher event to notify clients about the updated insult
    await pusherServer.trigger("insults", "update-insult", insult);

    return NextResponse.json(insult, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Error updating insult", error: errorMessage },
      { status: 500 }
    );
  }
}
