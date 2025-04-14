import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Task from "@/lib/models/Task";
import Goal from "@/lib/models/Goal"; // To validate goal existence

// GET all tasks
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

// POST a new task
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Task name is required" },
        { status: 400 }
      );
    }

    if (!body.goalId) {
      return NextResponse.json(
        { error: "Goal ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verify goal exists
    const goalExists = await Goal.findById(body.goalId);
    if (!goalExists) {
      return NextResponse.json(
        { error: "The specified goal does not exist" },
        { status: 400 }
      );
    }

    const newTask = new Task({
      name: body.name,
      goalId: body.goalId,
      description: body.description || "",
      completed: body.completed || false,
    });

    await newTask.save();

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
