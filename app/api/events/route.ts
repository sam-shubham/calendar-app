import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/lib/models/Event";

export async function GET() {
  try {
    await connectToDatabase();
    const events = await Event.find({});

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const eventData = await request.json();

    const event = new Event(eventData);
    await event.save();

    return NextResponse.json(event);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
