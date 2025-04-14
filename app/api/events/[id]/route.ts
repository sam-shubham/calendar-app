import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import EventModal from "@/lib/models/Event";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const eventData = await request.json();
    const { id } = params;

    await db
      .collection("events")
      .updateOne({ _id: new ObjectId(id) }, { $set: eventData });

    return NextResponse.json({
      _id: id,
      ...eventData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    connectToDatabase();
    const { id } = await params;

    await EventModal.findByIdAndDelete(id);

    return NextResponse.json({ id });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
