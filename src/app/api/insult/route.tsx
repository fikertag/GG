import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Insult from "@/model/Insult";

// Define types for request bodies
interface PostRequestBody {
  detail: string;
}

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
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { detail } = (await req.json()) as PostRequestBody;

    // Validate required fields
    if (!detail) {
      return NextResponse.json(
        { message: "Missing required field: detail" },
        { status: 400 }
      );
    }

    // Create a new insult
    const insult = await Insult.create({ detail });
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

    // Find the insult by ID
    const insult = await Insult.findById(insultId);

    if (!insult) {
      return NextResponse.json(
        { message: "Insult not found" },
        { status: 404 }
      );
    }

    // Increment the like or dislike count based on the action
    if (action === "like") {
      insult.like += 1;
    } else if (action === "dislike") {
      insult.dislike += 1;
    } else {
      return NextResponse.json(
        { message: "Invalid action, must be 'like' or 'dislike'" },
        { status: 400 }
      );
    }

    // Save the updated insult
    await insult.save();

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
