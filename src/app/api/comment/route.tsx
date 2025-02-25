import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/model/Comment";
import Insult from "@/model/Insult";

// POST a new comment
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { text, insultId } = await req.json(); // Expect text and insultId

    // Validate required fields
    if (!text || !insultId) {
      return NextResponse.json(
        { message: "Missing required fields: text or insultId" },
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

    // Create a new comment
    const comment = await Comment.create({
      text,
      insultId,
    });

    // Push the comment reference to the insult's comments array
    insult.comments.push(comment._id);
    await insult.save();

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error adding comment", error: error.message },
      { status: 500 }
    );
  }
}

// export async function GET(req: NextRequest) {
//   await dbConnect();
//   try {
//     const insultId = req.nextUrl.searchParams.get("insultId");

//     if (!insultId) {
//       return NextResponse.json(
//         { message: "Missing insult ID" },
//         { status: 400 }
//       );
//     }

//     const comments = await Comment.find({ insultId });

//     return NextResponse.json(comments, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json(
//       { message: "Error fetching comments", error: error.message },
//       { status: 500 }
//     );
//   }
// }
export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const comments = await Comment.find({});
    return NextResponse.json(comments, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching comments", error: error.message },
      { status: 500 }
    );
  }
}
