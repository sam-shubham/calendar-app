import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const eventData = await request.json()
    const { id } = params

    await db.collection("events").updateOne({ _id: new ObjectId(id) }, { $set: eventData })

    return NextResponse.json({
      _id: id,
      ...eventData,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const { id } = params

    await db.collection("events").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ id })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
