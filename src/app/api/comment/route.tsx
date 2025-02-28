import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/model/Comment";
import Insult from "@/model/Insult";
import { pusherServer } from "@/lib/pusher";
import crypto from "crypto";
import RateLimit from "@/model/RateLimit";

interface PostRequestBody {
  text: string;
  insultId: string;
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { text, insultId } = (await req.json()) as PostRequestBody;

    if (!text || !insultId) {
      return NextResponse.json(
        { message: "Missing required fields: text or insultId" },
        { status: 400 }
      );
    }

    const MAX_LENGTH = 400;
    if (text.length > MAX_LENGTH) {
      return NextResponse.json(
        { message: `comment exceeds max length of ${MAX_LENGTH} characters` },
        { status: 400 }
      );
    }

    const forwardedFor = req.headers.get("x-forwarded-for");
    const userIP = forwardedFor?.split(",")[0] || "unknown"; // Get first IP if multiple

    // Hash the IP for privacy
    const userHash = crypto.createHash("sha256").update(userIP).digest("hex");

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

    const insult = await Insult.findById(insultId);
    if (!insult) {
      return NextResponse.json(
        { message: "Insult not found" },
        { status: 404 }
      );
    }

    const comment = await Comment.create({ text, insultId });
    insult.comments.push(comment._id);
    await insult.save();

    await pusherServer.trigger("comments", "new-comment", comment);

    return NextResponse.json(comment, { status: 201 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error adding comment:", errorMessage);
    return NextResponse.json(
      { message: "Error adding comment", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  await dbConnect();
  try {
    const insults = await Comment.deleteMany({});
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

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const insultId = req.nextUrl.searchParams.get("insultId");
    const comments = insultId
      ? await Comment.find({ insultId })
      : await Comment.find({});
    return NextResponse.json(comments, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Error fetching comments", error: errorMessage },
      { status: 500 }
    );
  }
}
