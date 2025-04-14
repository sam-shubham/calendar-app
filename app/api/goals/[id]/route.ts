import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Goal from "@/lib/models/Goal";
import Task from "@/lib/models/Task"; // Import Task model to delete related tasks

// GET a specific goal
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const goal = await Goal.findById((await params).id);

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json(goal);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch goal" },
      { status: 500 }
    );
  }
}

// PUT/UPDATE a goal
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    await connectToDatabase();

    const updatedGoal = await Goal.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedGoal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json(updatedGoal);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update goal" },
      { status: 500 }
    );
  }
}

// DELETE a goal and its associated tasks
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    // First check if the goal exists
    const goal = await Goal.findById(params.id);
    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    // Delete the goal
    await Goal.findByIdAndDelete(params.id);

    // Also delete all tasks associated with this goal
    await Task.deleteMany({ goalId: params.id });

    return NextResponse.json({ message: "Goal deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete goal" },
      { status: 500 }
    );
  }
}
