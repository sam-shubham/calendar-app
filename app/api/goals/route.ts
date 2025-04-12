import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Goal from "@/lib/models/Goal";

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
