import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Task from "@/lib/models/Task";

export async function GET() {
  try {
    await connectToDatabase();
    const tasks = await Task.find({});

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
