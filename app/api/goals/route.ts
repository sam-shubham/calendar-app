import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Goal from "@/lib/models/Goal";

// GET all goals
export async function GET() {
  try {
    await connectToDatabase();
    const goals = await Goal.find({});

    return NextResponse.json(goals);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}

// POST a new goal
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Goal name is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newGoal = new Goal({
      name: body.name,
      color: body.color || "blue",
    });

    await newGoal.save();

    return NextResponse.json(newGoal, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 }
    );
  }
}
